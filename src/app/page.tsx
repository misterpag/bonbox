import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession, roleOf } from "@/lib/session";
import { GiftBox } from "@/components/GiftBox";
import { RARITIES } from "@/lib/economy";

export default async function Home() {
  const session = await getSession();
  if (session) redirect(roleOf(session) === "child" ? "/enfant" : "/parent");
  const t = await getTranslations();
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-10 px-4 py-12 text-center">
      <div className="space-y-3">
        <h1 className="text-6xl font-extrabold tracking-tight text-legendary drop-shadow">{t("app.name")}</h1>
        <p className="text-xl text-violet-100">{t("app.tagline")}</p>
      </div>

      <section className="w-full space-y-4">
        <h2 className="text-lg font-semibold text-violet-200">{t("home.rarities")}</h2>
        <div className="flex flex-wrap items-end justify-center gap-6">
          {RARITIES.map((r) => (
            <div key={r} className="flex flex-col items-center gap-2">
              <div className="transition-transform hover:-rotate-6 hover:scale-110">
                <GiftBox rarity={r} size={r === "legendary" ? 140 : 110} />
              </div>
              <span className="font-bold">{t(`home.${r}`)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Link href="/parent" className="flex-1 rounded-2xl bg-legendary px-6 py-4 text-lg font-bold text-night shadow-lg">
          {t("home.parentCta")}
        </Link>
        <Link href="/enfant" className="flex-1 rounded-2xl bg-epic px-6 py-4 text-lg font-bold shadow-lg">
          {t("home.childCta")}
        </Link>
      </div>

      <p className="text-sm text-violet-300">{t("home.openSource")}</p>
    </main>
  );
}
