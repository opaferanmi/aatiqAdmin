import apiClient from "./api/client";

interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder?: string;
}

async function uploadToCloudinary(
  file: File,
  folder?: string,
): Promise<{ url: string; publicId: string }> {
  const sigRes = await apiClient.post<{
    success: boolean;
    data: CloudinarySignatureResponse;
  }>("/admin/uploads/signature", folder ? { folder } : {});

  const sig = sigRes.data?.data ?? (sigRes.data as unknown as CloudinarySignatureResponse);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.api_key);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  if (sig.folder) formData.append("folder", sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const json = (await res.json()) as { secure_url: string; public_id: string };
  return { url: json.secure_url, publicId: json.public_id };
}

export const uploadAPI = {
  uploadFile: (file: File, folder?: string) => uploadToCloudinary(file, folder),
};
