import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { validateToken } from '@/lib/authManager';
import redis from '@/lib/upstash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Recupera o cookie de autenticação
    const cookies = parse(req.headers.cookie || '');
    const requestToken = cookies.private_token;

    // Verifica se o token está presente
    if (!requestToken) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const token = requestToken.split(":")[0]
    const idUser = requestToken.split(":")[1]

    // Verifica se o token é válido
    const isValid = await validateToken(token, idUser);

    if (!isValid.status) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Recuperar os dados do usuário do Redis
    const userData = await redis.get(`private_token:${idUser}`) as any;

    // Verificar se os dados existem e se são válidos
    if (!userData) {
      return res.status(401).json({ error: 'Token não corresponde ao usuário ou expirado' });
    }

    // Retornar os dados do usuário
    return res.status(200).json({user: userData.user});
  } catch (error) {
    console.error('Erro na verificação do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
