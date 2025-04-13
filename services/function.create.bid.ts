import {generateCustomCode, generateUUIDv4} from "@/services/services.generate"
import { UploadFile } from '@/services/service.upload.file';
import { GetArtsTeamReturn } from "@/types/interfaceClass"

export async function getUserInformations(teamId: string): Promise<GetArtsTeamReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'TeamArt',
                select: `
                    art: Art ( name, id, type )
                `,
                filter: [
                    {
                        column: 'teamId',
                        operator: 'eq',
                        value: teamId
                    }
                ]
            })
        });

        if (res.status != 200) return { st: false, value: [] }
        
        const data = (await res.json());
        
        return { st: true, value: data.map((dt:any) => dt.art) };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }
}

export async function callCreateBid(data: any, teamId: string) {    
    if(!teamId || teamId == undefined || teamId == null){
        return false
    }
    
    const {id} = await CreateBid(data);

    if(!id){
        return false
    }

    const ArtTeamId = await CreateTeamBid(id, teamId, data.artId);

    if(!ArtTeamId.st){
        return false
    }

    return true
}

async function CreateBid(data: any) {
    const id = await generateUUIDv4();
    const code = await generateCustomCode()
    const status = "processing"
    const docLink = await UploadFile(data.file, code.split("#")[1], 'bid')

    const _data: Record<string, any> = {
        id,
        code,
        status,
        type: data.type,
        linkDoc: docLink,
        table: "Bids"
    }

    try {
        const formData = new FormData();

        for (const key in _data) {
            const value = _data[key];
            if (typeof value === "object") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        const res = await fetch("/api/query/create", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();

        if (res.status !== 200) {
            return { st: false, value: result?.error || "Erro ao cadastrar" };
        }

        return { st: true, id: id };
    } catch (ex) {
        console.error("createPartnersContact | Error:", ex);
        return { st: false, value: "Erro inesperado ao cadastrar" };
    }
}


async function CreateTeamBid(uuid:string, teamId: string, artid:string) {
    try {
        const id = await generateUUIDv4();

        const formData = new FormData();
        formData.append("id", id);
        formData.append("teamId", teamId);
        formData.append("bidId", uuid);
        formData.append("artId", artid);
        formData.append("table", "TeamBids");

        const res = await fetch("/api/query/create", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();

        if (res.status !== 200) {
            return { st: false, value: result?.error || "Erro ao cadastrar" };
        }

        return { st: true, id: id };
    } catch (ex) {
        console.error("createPartnersContact | Error:", ex);
        return { st: false, value: "Erro inesperado ao cadastrar" };
    }
}
