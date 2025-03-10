import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "pt"],  // Idiomas suportados
  defaultLocale: "pt",    // Idioma padrão
  localeDetection: false, // 🔹 Desativa redirecionamento automático
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Aplica apenas nas páginas, sem forçar redirecionamento
};
