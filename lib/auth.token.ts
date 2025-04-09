// src/lib/auth.token.ts
import { nanoid } from 'nanoid';

export type PublicTokenData = {
  token: string;
};

export type PrivateTokenData = {
  id: string;
  admin: boolean;
  name: string;
  image?: string;
  teamMembers?: {
    id: string;
    teamId: string;
    role: string;
    roleTeam?: string;
  };
};

export function generatePublicToken(): PublicTokenData {
  return { token: nanoid(32) };
}

export function buildPrivateTokenPayload(user: any): PrivateTokenData {
  return {
    id: user.id,
    admin: user.admin,
    name: user.name,
    image: user.image,
    teamMembers: user.teamMembers,
  };
}