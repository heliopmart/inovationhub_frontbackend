import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { validatePrivateToken } from '@/lib/tokenManager';
import { supabase } from '@/lib/supabase';
import { IncomingForm, File } from 'formidable';
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

// Função auxiliar para upload na Cloudinary
async function uploadToCloudinary(file: File, userId: string): Promise<string | null> {
  
  console.log("+++++++++++++++++++++++++++++++")
  console.log(file)
  try {
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "users",
      public_id: `user_${userId}_${Date.now()}`,
      resource_type: "image",
    });

    return uploadResult.secure_url;
  } catch (err) {
    console.error("Erro ao enviar imagem para Cloudinary:", err);
    return null;
  }
}

// Verificação do token
async function verifyToken(req: NextApiRequest): Promise<boolean> {
  const cookies = parse(req.headers.cookie || "");
  const privateId = cookies.private_token;

  if (!privateId) return false;

  const auth = await validatePrivateToken(privateId);
  return !!auth;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  if (!(await verifyToken(req))) {
    return res.status(401).json({ error: "Token inexistente ou inválido." });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Erro ao processar os dados" });

    const dynamicFields: Record<string, any> = {};
    const arrayAllowed = ['socialMedia']; // campos que devem manter como array

    for (const key in fields) {
      const value = fields[key];

      if (arrayAllowed.includes(key)) {
        try {
          dynamicFields[key] = JSON.parse(Array.isArray(value) ? value[0] || '{}' : value || '{}');
        } catch {
          dynamicFields[key] = value;
        }
      } else {
        const raw = Array.isArray(value) ? value[0] : value;
        dynamicFields[key] = raw;
      }
    }

    if (!dynamicFields.id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    // Upload da imagem no Cloudinary (se houver)
    if (files?.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const cloudinaryUrl = await uploadToCloudinary(file, dynamicFields.id);


      if (!cloudinaryUrl) {
        return res.status(500).json({ error: "Erro ao fazer upload da imagem no Cloudinary" });
      }

      dynamicFields.image = cloudinaryUrl;
    }

    // Separar id do resto dos dados
    const { id, ...dataToUpdate } = dynamicFields;

    const { error, data } = await supabase
      .from("User") // substitua por nome correto da tabela se diferente
      .update(dataToUpdate)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erro ao atualizar Supabase:", error);
      return res.status(500).json({ error: "Erro ao atualizar dados" });
    }

    return res.status(200).json({
      message: "Dados atualizados com sucesso",
      data: data?.[0] || {},
    });
  });
}
