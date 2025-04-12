const AZURE_CONFIG = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME!,
  container: process.env.AZURE_STORAGE_CONTAINER!,
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
  baseUrl: process.env.AZURE_STORAGE_BASE_URL!,
};

if (!AZURE_CONFIG.baseUrl || !AZURE_CONFIG.container) {
  throw new Error('Variáveis de ambiente do Upstash não configuradas');
}

export function getBlobUrl(): string {
  return `${AZURE_CONFIG.baseUrl}/${AZURE_CONFIG.container}/`;
}

export function allowedPrefixes():string[]{
  return ["art/", "bid/", "doc/", "internal/"];
}