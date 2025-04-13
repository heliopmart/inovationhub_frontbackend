import cloudinary from "@/lib/cloudinary";
import { File } from "formidable";

export async function uploadToCloudinary(file: File, userId: string): Promise<string | null> {
    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "users",
        public_id: `user_${userId}_${Date.now()}`,
        resource_type: "image",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Erro ao enviar imagem para Cloudinary:", error);
      return null;
    }
  }
  