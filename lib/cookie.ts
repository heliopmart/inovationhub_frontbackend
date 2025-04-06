import { serialize } from 'cookie';
import { NextApiResponse } from 'next';

// Função para criar e definir o cookie diretamente na resposta
export function createCookie(res: NextApiResponse, name: string, value: string, maxAge: number = 3600): void {
  const cookie = serialize(name, value, {
    httpOnly: true,                   // Impede acesso via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS em produção
    maxAge,                           // Tempo de vida em segundos
    path: '/',                        // Disponível em toda a aplicação
    sameSite: 'lax',                  // Protege contra CSRF
  });

  // Define o cookie no cabeçalho da resposta
  res.setHeader('Set-Cookie', cookie);
}