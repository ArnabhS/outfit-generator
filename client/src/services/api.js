import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL
export async function uploadImageAndGetStyle(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(`${BASE_URL}/api/generate-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to generate style:", error);
    throw new Error("Failed to generate style.");
  }
}
