import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { validatePrivateToken } from '@/lib/tokenManager';

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

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error('Erro na verificação do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}