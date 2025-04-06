import { getPublicToken, createPrivateToken, verifyPrivateToken, verifyPublicToken } from '@/lib/auth.token';
import {TokenVerifyProps} from "@/types/interfaceClass"
 
const public_access = ['Team', 'Investor', 'TeamInvestor', 'User', 'Resource', 'NucleiBoardOfDirectors', 'UserLogin', 'Nuclei', "InvestorInvestment", "ResourceSupplier", "Event", "EventSponsors", "TeamDocs", "TeamArt", "TeamBids", "Art", "Docs", "Bids", "TeamMember"]
const private_access = ["Team"]

export async function initializePublicToken(): Promise<string> {
  const token = await getPublicToken();
  console.log('Public Token Inicializado:', token);
  return token;
}

export async function validatePublicAccess(token: string): Promise<boolean> {
  const isValid = await verifyPublicToken(token);
  if (!isValid) {
    console.log('Public Token inválido. Criando um novo.');
    await initializePublicToken();
  }
  return isValid;
}

export async function inicializePrivateToken(userId: string): Promise<string> {
  const privateToken = await createPrivateToken(userId);
  console.log('Login bem-sucedido. Token privado criado:', privateToken);
  return privateToken;
}

export async function validatePrivateAccess(token: string, userId: string): Promise<boolean> {
  const isValid = await verifyPrivateToken(token, userId);
  if (!isValid) {
    console.log('Token privado inválido. Usuário deve fazer login novamente.');
  }
  return isValid;
}

export async function validateToken(token: string, userId?:string):Promise<TokenVerifyProps>{
  const typeToken = token.split("_")[0]
  if(typeToken == 'public'){
    return {status: await validatePublicAccess(token), allowedTables: [...public_access]}
  }else{
    return {status: await validatePrivateAccess(token, userId || ""), allowedTables: [...public_access, ...private_access]}
  }
}