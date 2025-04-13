import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import {IncomingForm} from "formidable";
import { validatePublicToken } from '@/lib/tokenManager';
import { supabase } from '@/lib/supabase';
import {authUser} from "@/types/interfaceClass"

export const config = {
  api: { bodyParser: false },
};

async function verifyToken(req: NextApiRequest): Promise<authUser | false> {
  const cookies = parse(req.headers.cookie || "");
  const publicHash = cookies.public_token;

  if (!publicHash) return false;

   const auth = await validatePublicToken(publicHash);

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

  form.parse(req, async (err, fields) => {
    if (err) return res.status(500).json({ error: "Erro ao processar os dados" });

    const dynamicFields: Record<string, any> = {};
    for (const key in fields) {
      try {
        dynamicFields[key] = JSON.parse(fields[key] as unknown as string);
      } catch {
        dynamicFields[key] = fields[key];
      }
    }

    try{
      const { data, error } = await supabase.from('PartnersContact').insert(dynamicFields);
      return res.status(200).json({
        message: "Registro criado com sucesso",
        data,
      });
    }catch(error){
      console.error("Erro ao inserir no Supabase:", error);
      return res.status(500).json({ error: "Erro ao salvar os dados no banco" });
    }    
  });
}
