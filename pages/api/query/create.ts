import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { File, IncomingForm } from "formidable";
import { validatePrivateToken } from '@/lib/tokenManager';
import {uploadToCloudinary} from "@/pages/api/query/createImage"
import { supabase } from '@/lib/supabase';
import {authUser} from "@/types/interfaceClass"

export const config = {
  api: { bodyParser: false },
};

async function verifyToken(req: NextApiRequest): Promise<authUser | false> {
  const cookies = parse(req.headers.cookie || "");
  const privateId = cookies.private_token;

  if (!privateId) return false;

  const auth = await validatePrivateToken(privateId);

  if(!auth) return false;

  return auth.token;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const auth = await verifyToken(req)
  if (!(auth)) {
    return res.status(401).json({ error: "Token inexistente ou inválido." });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Erro ao processar os dados" });

    const dynamicFields: Record<string, any> = {};
    for (const key in fields) {
      const rawValue = Array.isArray(fields[key]) ? fields[key][0] : fields[key];

      try {
        dynamicFields[key] = JSON.parse(rawValue || "");
      } catch {
        dynamicFields[key] = rawValue;
      }
    }

    if (files?.image) {
      const file = files.image as unknown as File;
      const uploadedUrl = await uploadToCloudinary(file, auth?.user.id || "");
      if (uploadedUrl) {
        dynamicFields["image"] = uploadedUrl;
      }
    }

    const tableName = dynamicFields.table;
    delete dynamicFields.table;
    
    if (!tableName) {
      return res.status(400).json({ error: "Nome da tabela não especificado" });
    }

    try{
      const { data, error } = await supabase.from(tableName).insert(dynamicFields);
      return res.status(200).json({
        data,
      });
    }catch(error){
      console.error("Erro ao inserir no Supabase:", error);
      return res.status(500).json({ error: "Erro ao salvar os dados no banco" });
    }    
  });
}
