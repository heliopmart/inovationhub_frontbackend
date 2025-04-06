import jwt, { JwtPayload, Secret  } from 'jsonwebtoken';

const secret: Secret = process.env.NEXT_PUBLIC_JWT_SECRET || 'default_secret';

export function generateToken(payload: object, expiresIn: string = '1h'): string {
  if (!secret) {
    throw new Error('JWT_SECRET não está definido.');
  }

  return jwt.sign(payload, secret, { expiresIn: `1h`});
}
  
export function verifyToken(token: string, type:string = 'public'): JwtPayload | null {
  try {
    if (!secret) {
      throw new Error('JWT_SECRET não está definido.');
    }

    if(type == 'public'){
      return jwt.verify(token, secret) as JwtPayload;
    }else{
      return jwt.verify(token, secret) as JwtPayload;
    }

  } catch (error) {
    return null;
  }
}