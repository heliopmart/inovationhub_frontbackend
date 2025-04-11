import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { revokePrivateToken } from '@/lib/tokenManager';
import {deleteCookie} from '@/lib/cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Recupera o cookie assinado
    const cookies = parse(req.headers.cookie || '');
    const userId = cookies.private_token;

    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    await revokePrivateToken(userId);
    deleteCookie(res, 'private_token');

    return res.status(200).json(true);
  } catch (error) {
    console.error('Erro na verificação do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
