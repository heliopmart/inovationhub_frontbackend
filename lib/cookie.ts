// src/lib/cookie.ts
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken } from './jwt';

export function setSignedCookie(res: NextResponse, name: string, value: string, maxAge: number) {
  const token = generateToken({ v: value }, `${maxAge}s`);

  res.headers.append('Set-Cookie', serialize(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  }));
}

export function getSignedCookie(req: NextRequest, name: string): string | null {
  const cookie = req.cookies.get(name)?.value;
  if (!cookie) return null;

  const payload = verifyToken(cookie);
  return payload?.v || null;
}

export function deleteCookie(res: NextResponse, name: string) {
  res.headers.append('Set-Cookie', serialize(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  }));
}
