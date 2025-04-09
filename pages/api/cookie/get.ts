import { parse } from 'cookie';
import { NextApiResponse, NextApiRequest } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Only GET method allowed' });
    }    
    
    const cookies = parse(req.headers.cookie || '');
    const viewTeam = (cookies.viewTeam) as string;

    return res.status(200).json(JSON.parse(viewTeam));
}