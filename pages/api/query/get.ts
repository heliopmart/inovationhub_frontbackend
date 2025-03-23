import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { AuthToken } from "../auth/auth.token"

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

    const token = req.headers['x-auth-token'];

    // 🔐 Ponto para autenticação futura
    if (!token || typeof token !== 'string') {
        return res.status(401).json({ error: 'Token missing' });
    }

    // authenticação por token public ou private

    const validedToken = await AuthToken(token);

    if (!validedToken.status) {
        return res.status(403).json({ error: validedToken.message });
    }

    // ✅ Tabela obrigatória
    if (!table || typeof table !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid table name' });
    }

    // 🔒 Lista branca (recomendada para segurança)
    if (!validedToken.allowedTables?.includes(table)) {
        return res.status(403).json({ error: 'Access to this table is not allowed' });
    }

    let query = supabase.from(table).select(select);

    // 🔍 Filtros dinâmicos simples
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

/*
POST /api/get
{
  "table": "Team",
  "select": "*, teamInvestors(investor(id, name))",
  "filter": { "id": "eq.team-1" }
}
*/