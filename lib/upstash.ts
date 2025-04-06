import { Redis } from '@upstash/redis';

if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_URL || !process.env.NEXT_PUBLIC_UPSTASH_REDIS_TOKEN) {
  throw new Error('Variáveis de ambiente do Upstash não configuradas');
}

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_URL,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_TOKEN,
});

export default redis;