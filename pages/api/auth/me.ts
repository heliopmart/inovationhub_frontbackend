import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { validatePrivateToken } from '@/lib/tokenManager';
import redis from '@/lib/upstash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Recupera o cookie assinado
    const cookies = parse(req.headers.cookie || '');
    const userId = cookies.private_token;

    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const isValid = await validatePrivateToken(userId);

    if (!isValid) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const userData = await redis.get(`private_token:${userId}`);

    if (!userData) {
      return res.status(401).json({ error: 'Dados de usuário expirados ou inválidos' });
    }

    return res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Erro na verificação do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
