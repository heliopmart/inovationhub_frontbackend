import { serialize } from 'cookie';
import { NextApiResponse, NextApiRequest } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST method allowed' });
    }    
    
    const data = req.body

    const cookie = serialize('viewTeam', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ ok: true });
}