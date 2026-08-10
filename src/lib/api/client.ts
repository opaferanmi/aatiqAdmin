import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const baseURL = `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/api/v1`;

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status === 401 && !original?._retry) {
      const { refreshToken, setTokens, logout } = useAuthStore.getState();
      if (!refreshToken) {
        logout();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) return reject(error);
            original.headers = original.headers ?? {};
            (original.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            original._retry = true;
            resolve(apiClient(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${baseURL}/admin/auth/refresh-token`, {
          refreshToken,
        });
        const newAccess = data?.data?.accessToken ?? data?.accessToken;
        const newRefresh = data?.data?.refreshToken ?? data?.refreshToken ?? refreshToken;
        setTokens({ accessToken: newAccess, refreshToken: newRefresh });
        flushQueue(newAccess);
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newAccess}`;
        original._retry = true;
        return apiClient(original);
      } catch (e) {
        flushQueue(null);
        logout();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const e = err as AxiosError<{ message?: string; error?: { message?: string } }>;
  // Only surface explicit API-level messages from the response body — never raw network/Axios errors
  return e?.response?.data?.message ?? e?.response?.data?.error?.message ?? fallback;
}
