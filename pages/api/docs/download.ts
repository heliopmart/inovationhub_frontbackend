import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';
import { get } from "https";
import {getBlobUrl, allowedPrefixes} from "@/lib/azure";
import { validatePublicToken, validatePrivateToken } from '@/lib/tokenManager';

const BASE_URL = getBlobUrl();
const ALLOWRD_PREFIXES = allowedPrefixes()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;

    const cookies = parse(req.headers.cookie || '');
    const publicHash = cookies.public_token;
    const privateId = cookies.private_token;

    let authData = null;
    
    if (privateId) {
        authData = await validatePrivateToken(privateId);
    }

    if (!authData && publicHash) {
        authData = await validatePublicToken(publicHash);
    }

    // Se mesmo após tentativa não houver token válido
    if (!authData) {
        return res.status(403).json({ error: "Token inválido, permissão negada" });
    }

    if (!path || typeof path !== "string") {
        return res.status(400).json({ error: "URL inválida" });
    }

    // Verificação adicional de segurança
    const fullUrl = BASE_URL + path;

    // Verificação de segurança
    
    if (!ALLOWRD_PREFIXES.some(prefix => path.startsWith(prefix)) || path.includes("..")) {
        return res.status(400).json({ error: "Caminho de download não permitido." });
    }

    try {
        get(fullUrl, (fileRes) => {
            res.setHeader("Content-Disposition", `attachment; filename="${decodeURIComponent(path.split("/").pop() || "arquivo")}"`);
            res.setHeader("Content-Type", fileRes.headers["content-type"] || "application/octet-stream");
        
            fileRes.pipe(res);
          });
    } catch (err) {
        res.status(500).json({ error: "Erro ao realizar o download." });
    }
}
