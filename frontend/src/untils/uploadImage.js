import axiosInstance from "./axiosInstance";

export async function uploadImageAPI(file) {
  const formData = new FormData();
  formData.append("image", file); // đúng field name!
  const res = await axiosInstance.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { url: res.data.imageUrl };
}
