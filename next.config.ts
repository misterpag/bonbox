import path from "node:path";
import type { NextConfig } from "next";

/**
 * next-intl : on déclare nous-mêmes l'alias `next-intl/config` au lieu d'utiliser
 * `createNextIntlPlugin`. Le plugin charge @swc/core (compilateur natif), dont le
 * cache refuse de démarrer sur certains postes Windows (ERR_SWC_NATIVE_CACHE).
 */
const I18N_REQUEST_CONFIG = "./src/i18n/request.ts";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: { "next-intl/config": I18N_REQUEST_CONFIG },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next-intl/config": path.resolve(process.cwd(), I18N_REQUEST_CONFIG),
    };
    return config;
  },
};

export default nextConfig;
