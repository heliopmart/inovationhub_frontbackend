import { createToken, revokeToken, validateToken } from '@/lib/tokenManager';

export async function getPublicToken(): Promise<string> {
  const existingToken = await createToken('public', 'guest');
  return existingToken;
}

export async function verifyPublicToken(token: string): Promise<boolean> {
  return await validateToken('public', token);
}

export async function createPrivateToken(userId: string): Promise<string> {
  await revokeToken('private', userId); // Revoga o antigo se existir
  const privateToken = await createToken('private', userId);
  return privateToken;
}

export async function verifyPrivateToken(token: string, userId: string): Promise<boolean> {
  return await validateToken('private', token, userId);
}