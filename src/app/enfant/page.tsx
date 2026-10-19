import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui";
import { GiftBox } from "@/components/GiftBox";
import { AddPasskeyButton } from "@/components/PasskeyButton";
import { SignOutButton } from "@/components/SignOutButton";
import { passkeyCount, walletBalance } from "@/lib/family";
import { getSession, roleOf } from "@/lib/session";
import { ChildLoginForm } from "./ChildLoginForm";

export default async function ChildPage() {
  const session = await getSession();
  const t = await getTranslations();

  if (!session) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <Link href="/" className="self-start text-violet-200 hover:underline">← {t("common.back")}</Link>
        <GiftBox rarity="legendary" size={120} />
        <h1 className="text-5xl font-extrabold">{t("childAuth.title")}</h1>
        <p className="text-xl text-violet-100">{t("childAuth.subtitle")}</p>
        <ChildLoginForm />
      </main>
    );
  }
  if (roleOf(session) !== "child") redirect("/parent");

  const [points, passkeys] = await Promise.all([walletBalance(session.user.id), passkeyCount(session.user.id)]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-10 text-center">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">{t("child.hello", { name: session.user.name })}</h1>
        <SignOutButton />
      </header>

      <Card className="space-y-2">
        <p className="text-violet-200">{t("child.wallet")}</p>
        <p className="text-6xl font-extrabold text-legendary">{t("child.points", { count: points })}</p>
      </Card>

      <Card className="flex flex-col items-center gap-3">
        <div className="flex gap-4 opacity-60">
          <GiftBox rarity="rare" size={72} />
          <GiftBox rarity="epic" size={72} />
          <GiftBox rarity="legendary" size={72} />
        </div>
        <p className="text-violet-200">{t("child.boxesSoon")}</p>
      </Card>

      {passkeys === 0 && (
        <Card className="space-y-3">
          <h2 className="text-2xl font-bold">{t("child.security")}</h2>
          <AddPasskeyButton />
        </Card>
      )}
    </main>
  );
}
