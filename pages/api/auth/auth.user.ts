import type { NextApiRequest, NextApiResponse } from 'next';
import { inicializePrivateToken } from '@/lib/authManager';
import { supabase } from '@/lib/supabase';
import {createCookie} from "@/lib/cookie"
import bcrypt from 'bcrypt';
import redis from '@/lib/upstash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Consultar o usuário pelo email na tabela UserLogin
    const { data: userLogin, error: userError } = await supabase
      .from('UserLogin')
      .select(`
        *,
        user: User(id, admin, name, image, teamMembers: TeamMember (id, teamId, role, roleTeam))
      `)
      .eq('email', email)
      .single();

    if (userError || !userLogin) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verificar a senha usando bcrypt
    const passwordMatch = await bcrypt.compare(password, userLogin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gerar o token privado após autenticação bem-sucedida
    const token = await inicializePrivateToken(userLogin.userId);

    createCookie(res, `private_token`, `${token}:${userLogin.userId}`);
    // Armazenar os dados completos do usuário no Redis

    // TODO TEMP remove
    console.log(userLogin.teamMembers)

    await redis.set(`private_token:${userLogin.userId}`, JSON.stringify({
      token,
      user: {
        id: userLogin.user.id,
        admin: userLogin.user.admin,
        name: userLogin.user.name,
        image: userLogin.user.image,
        teamMembers: userLogin.teamMembers,
      }
    }), { ex: 3600 });

    // Atualizar a última data de login na tabela
    await supabase
      .from('UserLogin')
      .update({ loginAt: new Date().toISOString(), privateToken: token })
      .eq('id', userLogin.id);

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erro na autenticação do usuário:', (error as Error).message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
