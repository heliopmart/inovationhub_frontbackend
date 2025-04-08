import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { buildPrivateTokenPayload } from '@/lib/auth.token';
import { createPrivateToken } from '@/lib/tokenManager';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar usuário com suas relações
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

    const passwordMatch = await bcrypt.compare(password, userLogin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Criar token privado e salvar no Redis
    const payload = buildPrivateTokenPayload(userLogin.user);
    const userId = await createPrivateToken(payload);

    // Salvar cookie assinado
    res.setHeader('Set-Cookie', serialize('private_token', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    }));

    // Atualiza o último login
    await supabase
      .from('UserLogin')
      .update({ loginAt: new Date().toISOString(), privateToken: userId })
      .eq('id', userLogin.id);

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error('Erro na autenticação do usuário:', (error as Error).message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
