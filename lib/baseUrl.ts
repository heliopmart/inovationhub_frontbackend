export function getBaseUrl() {
    if (typeof window !== 'undefined') {
        // Executando no cliente
        return '';
    }
    // Executando no servidor
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
}
