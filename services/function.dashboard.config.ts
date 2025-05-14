import { GetUserForConfig } from "@/types/interfaceDashboardSql";

export async function getUserInformations(userId: string): Promise<GetUserForConfig> { // Promise<>
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'UserLogin',
                select: `
                    id,
                    email,
                    user: User (*)
                `,
                filter: [
                    {
                        column: 'userId',
                        op: 'eq',
                        value: userId
                    }
                ]
            })
        });

        if (res.status != 200) return { st: false, value: null }
        const data = (await res.json())[0];

        return { st: true, value: data };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: null };
    }
}

export async function updateUserInformations(data: any, imageFile?: File): Promise<boolean> {
    try {
        const formData = new FormData();

        // Adiciona os dados dinâmicos ao formData
        for (const key in data) {
            const value = data[key];
            if (typeof value === "object") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        // Adiciona imagem, se houver
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const res = await fetch("/api/query/update", {
        method: "PUT",
        body: formData,
        });

        if (res.status !== 200) return false;
        return true;
    } catch (ex) {
        console.error("updateUserInformations | Error:", ex);
        return false;
    }
}