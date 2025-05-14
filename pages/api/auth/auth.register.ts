import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { email, password, name, curse, type } = req.body;

    if (!email || !password || !name || !curse || !type) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const { data: existingUser, error: existingUserError } = await supabase
            .from('UserLogin')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser && existingUser.id) {
            return res.status(401).json({ error: 'Usuário já existe, tente LogIn!' });
        }

        const criptedPassword = await bcrypt.hash(password, 10);
        const UserId =  await gerarHashSeguro()
        // cria um User
        const createUser = await supabase
            .from('User')
            .insert({
                id:UserId,

                name: name,
                graduations: [curse],
                color: "#1a1a1a",
                image: "",
                admin: false,
                socialMedia: [{ "link": "", "type": "instagram" }, { "link": "", "type": "linkedin" }],

                type: type,

                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString(),
            });

        if(createUser.status !== 201){
            return res.status(401).json({ error: 'Erro ao criar usuário' });
        }

        const createUserLogin = await supabase
            .from('UserLogin')
            .insert({
                userId: UserId,
                email,
                password: criptedPassword,
                createAt: new Date().toISOString(),
                loginAt: new Date().toISOString(),
            });

        if(createUserLogin.status !== 201){
            return res.status(401).json({ error: 'Erro ao criar usuário' });
        }

        return res.status(200).json({ status: true });
    } catch (error) {
        console.error('Erro na autenticação do usuário:', (error as Error).message);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function gerarHashSeguro(): Promise<string> {
    const randomString = randomBytes(32).toString('hex');
    const saltRounds = 10;
    const hash = await bcrypt.hash(randomString, saltRounds);
    return hash;
}