import { authUser } from '@/types/interfaceClass';
import { UploadFile } from '@/services/service.upload.file';
import {generateCustomCode, generateUUIDv4} from "@/services/services.generate"

export async function callCreateArt(data: any, teamId: string) {    
    if(!teamId || teamId == undefined || teamId == null){
        return false
    }
    
    const {id} = await CreateArt(data);

    if(!id){
        return false
    }

    const ArtTeamId = await CreateTeamArt(id, teamId)

    if(!ArtTeamId.st){
        return false
    }

    const ArtMemberLeaderId = await CreateArtMemberLeader(id, teamId, data.leaderId)

    if(!ArtMemberLeaderId.st){
        return false
    }

    const ArtMemberCoordinatorId = await CreateArtMemberCoordinator(id, teamId, data.coordinatorId)

    if(!ArtMemberCoordinatorId.st){
        return false
    }
    
    return true
}

async function CreateArt(data: any) {
    const id = await generateUUIDv4();
    const code = await generateCustomCode()
    const status = "processing"
    const docLink = await UploadFile(data.file, code.split("#")[1])

    const _data: Record<string, any> = {
        id,
        code,
        status,
        name: data.name,
        type: data.type,
        linkDoc: docLink,
        limitDate: data.limitDate,
        table: "Art"
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

async function CreateArtMemberLeader(uuid: string, teamId: string, memberId: string) {
    try {
        const id = await generateUUIDv4();

        const formData = new FormData();
        formData.append("id", id);
        formData.append("teamId", teamId);
        formData.append("memberId", memberId);
        formData.append("allocatedArt", uuid);
        formData.append("role", "member");
        formData.append("roleTeam", "allocatedLeader");
        formData.append("table", "TeamMember");

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
        return { st: false, value: "Erro inesperado ao cadastrar" }
            ;
    }
}

async function CreateArtMemberCoordinator(uuid: string, teamId: string, coordinatorId: string) {
    try {
        const id = await generateUUIDv4();

        const formData = new FormData();
        formData.append("id", id);
        formData.append("teamId", teamId);
        formData.append("memberId", coordinatorId);
        formData.append("allocatedArt", uuid);
        formData.append("role", "member");
        formData.append("roleTeam", "coordinator");
        formData.append("table", "TeamMember");

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
        return { st: false, value: "Erro inesperado ao cadastrar" }
            ;
    }
}

async function CreateTeamArt(uuid:string, teamId: string) {
    try {
        const id = await generateUUIDv4();

        const formData = new FormData();
        formData.append("id", id);
        formData.append("teamId", teamId);
        formData.append("artId", uuid);
        formData.append("table", "TeamArt");

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
