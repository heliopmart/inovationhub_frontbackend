import { verifyToken } from '@/lib/jwt';
import redis from '@/lib/upstash';

interface TokenValidationResult {
  status: boolean;
  message: string;
  allowedTables?: string[];
}

export async function createToken(type: 'public' | 'private', userId: string): Promise<string> {
  const timestamp = Date.now();
  const token = `${type}_${userId}_${timestamp}`;

  if (type === 'private') {
    await redis.set(`private_token:${userId}`, {token}, { ex: 3600 });
  } else {
    await redis.set('public_token', token, { ex: 31536000 });
  }

  return token;
}

export async function verifyTokenExists(type: 'public' | 'private', userId?: string): Promise<boolean> {
  const key = type === 'private' ? `private_token:${userId}` : 'public_token';
  const token = await redis.get(key);
  return token !== null;
}

export async function revokeToken(type: 'public' | 'private', userId?: string): Promise<boolean> {
  const key = type === 'private' ? `private_token:${userId}` : 'public_token';
  return await redis.del(key) > 0;
}

export async function validateToken(type: 'public' | 'private', token: string, userId?: string): Promise<boolean> {
  const key = type === 'private' ? `private_token:${userId}` : 'public_token';
  const storedToken = await redis.get(key) as any;

  return storedToken.token === (token.split(":")[1] ? token.split(":")[0] : token);
}
