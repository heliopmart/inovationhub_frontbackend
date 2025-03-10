/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "pt",
    localeDetection: false, // Evita redirecionamento automático
  },
};

module.exports = nextConfig;