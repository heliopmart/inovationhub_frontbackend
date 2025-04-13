export async function UploadFile(doc: File, code: string, folder: string = 'art'): Promise<string> {
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
