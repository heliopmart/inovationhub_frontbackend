export async function generateUUIDv4(): Promise<string> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function generateCustomCode(): Promise<string> {
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