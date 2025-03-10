export async function getTranslations(page: string, locale: string) {
  try {
    const messages = (await import(`@/locale/${page}/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Erro ao carregar traduções para ${page} (${locale}):`, error);
    return {}; // Retorna um objeto vazio se não encontrar
  }
}