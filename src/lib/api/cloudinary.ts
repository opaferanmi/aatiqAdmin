import apiClient from "./client";

interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder?: string;
}

export async function uploadToCloudinary(
  file: File,
  folder?: string,
): Promise<{ url: string; publicId: string }> {
  // 1. Get signature from backend
  const sigRes = await apiClient.post<{ success: boolean; data: CloudinarySignatureResponse }>(
    "/admin/uploads/signature",
    folder ? { folder } : {},
  );
  const sig = sigRes.data?.data ?? (sigRes.data as unknown as CloudinarySignatureResponse);

  // 2. Build form data and POST to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.api_key);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  if (sig.folder) formData.append("folder", sig.folder);

  const url = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`;
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }
  const json = (await res.json()) as { secure_url: string; public_id: string };
  return { url: json.secure_url, publicId: json.public_id };
}
