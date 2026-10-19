import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

/** Langue : cookie « locale » s'il existe, sinon langue du navigateur, sinon français. */
export default getRequestConfig(async () => {
  const fromCookie = (await cookies()).get("locale")?.value;
  const fromHeader = (await headers()).get("accept-language")?.slice(0, 2);
  const candidate = fromCookie ?? fromHeader;
  const locale: Locale = LOCALES.includes(candidate as Locale) ? (candidate as Locale) : DEFAULT_LOCALE;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
