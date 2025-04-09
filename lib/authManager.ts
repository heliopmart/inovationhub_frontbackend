// import {TokenVerifyProps} from "@/types/interfaceClass"
// import { NextRequest, NextResponse } from 'next/server';
// import { getSignedCookie, setSignedCookie } from './cookie';
// import {
//   createPublicToken,
//   createPrivateToken,
//   validatePublicToken,
//   validatePrivateToken
// } from './tokenManager';

// export async function handleAuth(req: NextRequest, res: NextResponse) {
//   // 1. Validar ou criar token público
//   const publicHash = getSignedCookie(req, 'public_token');
//   let publicData = publicHash ? await validatePublicToken(publicHash) : null;

//   if (!publicData) {
//     const { hash, token } = await createPublicToken();
//     setSignedCookie(res, 'public_token', hash, 60 * 60 * 24 * 5); // 5 dias
//     publicData = { token, allowedTables };
//   }

//   // 2. Validar token privado
//   const userId = getSignedCookie(req, 'private_token');
//   let userData = userId ? await validatePrivateToken(userId) : null;

//   if (!userData) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   // 3. Retornar dados válidos
//   return { public: publicData, private: userData };
// }