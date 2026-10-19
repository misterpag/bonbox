import type { Metadata, Viewport } from "next";
import "@fontsource-variable/baloo-2";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");
  return {
    title: t("name"),
    description: t("description"),
    appleWebApp: { capable: true, title: "Bonbox", statusBarStyle: "black-translucent" },
  };
}

export const viewport: Viewport = { themeColor: "#7c3aed" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
