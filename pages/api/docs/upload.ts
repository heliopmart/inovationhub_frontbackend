import type { NextApiRequest, NextApiResponse } from "next";
import { File, IncomingForm } from "formidable";
import { parse } from "cookie";
import { validatePrivateToken } from "@/lib/tokenManager";
import { uploadToAzure } from "@/lib/azureUploader";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const cookies = parse(req.headers.cookie || "");
  const privateToken = cookies.private_token;

  if (!privateToken || !(await validatePrivateToken(privateToken))) {
    return res.status(403).json({ error: "Token inválido, permissão negada" });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao processar os dados do formulário" });
    }

    const folder = fields.folder as unknown as string;
    const code = fields.code as unknown as string;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "Arquivo ausente ou inválido" });
    }


    try {
      const uploadResult = await uploadToAzure(folder, file, code);
      return res.status(200).json({url:  uploadResult});
    } catch (error) {
      console.log("______________________________")
      console.log(error)
      console.error("Erro ao enviar para o Azure:", error);
      return res.status(500).json({ error: "Falha ao realizar o upload" });
    }
  });
}
