// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import formidable from 'formidable';

// Para desabilitar o bodyParser padrão do Next
export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Erro ao fazer upload' });

    const file = Array.isArray(files.file) ? files.file[0] : (files.file as unknown as formidable.File);

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'inova_hub', // opcional
      public_id: file.originalFilename?.split('.')[0]
    });

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });
  });
}
