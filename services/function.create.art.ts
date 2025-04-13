import { authUser } from '@/types/interfaceClass';
export async function callCreateArt(data: any, authUser: authUser, teamId: string) {    
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

async function UploadFile(doc: File, code: string): Promise<string> {
    if (!doc || !code) {
        return "";
    }

    const formData = new FormData();
    formData.append("folder", "art");
    formData.append("code", code);
    formData.append("file", doc);

    try {
        const res = await fetch("/api/docs/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (res.ok && data.url) {
            return data.url;
        }

        console.error("Erro no upload:", data.error);
        return "";
    } catch (error) {
        console.error("Erro na requisição de upload:", error);
        return "";
    }
}

async function generateUUIDv4(): Promise<string> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function generateCustomCode(): Promise<string> {
    const randomHex = (length: number) => {
        return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase();
    };

    const randomLetters = (length: number) => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
    };

    const part1 = randomHex(6);
    const part2 = randomLetters(2);
    const part3 = randomHex(6);
    const part4 = randomLetters(1);

    return `#${part1}-${part2}-${part3}-${part4}`;
}