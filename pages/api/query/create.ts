import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import formidable from "formidable";
import fs from "fs";
import { validatePrivateToken } from '@/lib/tokenManager';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.private_token?.split(":")[0];
  const privateId = cookies.private_token?.split(":")[1];

  if (!privateId) {
    return res.status(403).json({ error: "Token inválido, permissão negada" });
  }

  const auth = await validatePrivateToken(privateId);

  if (!auth) {
    return res.status(403).json({ error: "Token inválido, permissão negada" });
  }

  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Erro ao processar os dados" });

    // Extrai todos os campos dinâmicos em formato JSON
    const dynamicFields: Record<string, any> = {};
    for (const key in fields) {
      try {
        dynamicFields[key] = JSON.parse(fields[key] as unknown as string);
      } catch {
        dynamicFields[key] = fields[key];
      }
    }

    let imageBase64 = null;

    if (files?.image) {
      const file = files.image as unknown as formidable.File;
      const fileBuffer = fs.readFileSync(file.filepath);
      imageBase64 = fileBuffer.toString("base64");

      // Suponha que aqui você envie para Cloudinary, Supabase, etc.
      dynamicFields["image"] = imageBase64;
    }

    return res.status(200).json({
      message: "Registro criado com sucesso",
      data: dynamicFields,
    });
  });
}
