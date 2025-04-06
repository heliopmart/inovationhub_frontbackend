import { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/upstash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await redis.set('test-key', 'Hello from Upstash!');

    const value = await redis.get<string>('test-key');
    
    res.status(200).json({ message: `Valor armazenado: ${value}` });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Falha na conexão com o Upstash' });
  }
}
