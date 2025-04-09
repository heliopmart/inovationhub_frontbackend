// src/pages/api/get.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { parse } from 'cookie';
import { createPublicToken, validatePublicToken, validatePrivateToken } from '@/lib/tokenManager';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const {
    table,
    select = '*',
    filter,
    limit,
    order,
  } = req.body;

  const cookies = parse(req.headers.cookie || '');
  const publicHash = cookies.public_token;
  const privateId = cookies.private_token;

  let authData = null;
  
  if (privateId) {
    authData = await validatePrivateToken(privateId);
  }

  if (!authData && publicHash) {
    authData = await validatePublicToken(publicHash);
  }

  if (!authData) {
    const { hash } = await createPublicToken();
    res.setHeader('Set-Cookie', serialize('public_token', hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 5,
      path: '/',
    }));
    authData = { token: hash };
  }

  // Se mesmo após tentativa não houver token válido
  if (!authData) {
    return res.status(403).json({ error: "Token inválido, permissão negada" });
  }

  // ✅ Tabela obrigatória
  if (!table || typeof table !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid table name' });
  }

  // 🔒 Lista branca de tabelas permitidas
  if ('allowedTables' in authData && !authData.allowedTables?.includes(table)) {
    return res.status(403).json({ error: 'Access to this table is not allowed' });
  }

  let query = supabase.from(table).select(select);

  if (Array.isArray(filter)) {
    for (const cond of filter) {
      const { column, op, value } = cond;
      if (column && op && value) {
        query = (query as any)[op](column, value);
      }
    }
  }

  if (order) {
    query = query.order(order);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
