export function getBaseUrl() {
    if (typeof window !== 'undefined') {
        // Executando no cliente
        return '';
    }
    // Executando no servidor
    return process.env.API_BASE_URL || 'http://localhost:3000';
}
