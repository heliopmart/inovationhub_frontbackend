// src/lib/tokenManager.ts
import { nanoid } from 'nanoid';
import redis from './upstash';

const PUBLIC_TTL = 60 * 60 * 24 * 5; // 5 dias
const PRIVATE_TTL = 60 * 60 * 24;    // 1 dia


const public_access = ['Team', 'Investor', 'TeamInvestor', 'User', 'Resource', 'NucleiBoardOfDirectors', 'UserLogin', 'Nuclei', "InvestorInvestment", "ResourceSupplier", "Event", "EventSponsors", "TeamDocs", "TeamArt", "TeamBids", "Art", "Docs", "Bids", "TeamMember"]
const private_access = ["Team"]


export async function createPublicToken() {
  const hash = nanoid();
  const tokenData = { token: nanoid(32) };

  await redis.set(`public_token:${hash}`, JSON.stringify(tokenData), { ex: PUBLIC_TTL });
  return { hash, token: tokenData.token };
}

export async function createPrivateToken(user: any) {
  const userData = {
    id: user.id,
    admin: user.admin,
    name: user.name,
    image: user.image,
    teamMember: user.teamMember,
  };

  await redis.set(`private_token:${user.id}`, JSON.stringify(userData), { ex: PRIVATE_TTL });
  return user.id;
}

export async function validatePublicToken(hash: string) {
  const data = (await redis.get(`public_token:${hash}`)) as any;
  if (!data) return null;
  return {token: data, allowedTables: [...public_access]}
}

export async function validatePrivateToken(userId: string) {
  const data = (await redis.get(`private_token:${userId}`)) as any;
  if (!data) return null;
  return {token: data, allowedTables: [...private_access, ...public_access]}
}

export async function revokePublicToken(hash: string) {
  await redis.del(`public_token:${hash}`);
}

export async function revokePrivateToken(userId: string) {
  await redis.del(`private_token:${userId}`);
}