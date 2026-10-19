import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui";
import { GiftBox } from "@/components/GiftBox";
import { AddPasskeyButton } from "@/components/PasskeyButton";
import { SignOutButton } from "@/components/SignOutButton";
import { ensureFamily, listChildren, passkeyCount } from "@/lib/family";
import { getSession, roleOf } from "@/lib/session";
import { ParentAuthForm } from "./ParentAuthForm";
import { CreateChildForm } from "./CreateChildForm";

export default async function ParentPage() {
  const session = await getSession();
  const t = await getTranslations();

  if (!session) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12">
        <Link href="/" className="self-start text-violet-200 hover:underline">← {t("common.back")}</Link>
        <h1 className="text-4xl font-extrabold">{t("parentAuth.title")}</h1>
        <ParentAuthForm />
      </main>
    );
  }
  if (roleOf(session) === "child") redirect("/enfant");

  const family = await ensureFamily(session.user.id, t("parent.familyDefaultName", { name: session.user.name }));
  const [children, passkeys] = await Promise.all([listChildren(family.id), passkeyCount(session.user.id)]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">{t("parent.hello", { name: session.user.name })}</h1>
          <p className="text-violet-200">{t("parent.family", { name: family.name })}</p>
        </div>
        <SignOutButton />
      </header>

      <Card className="space-y-4">
        <h2 className="text-2xl font-bold">{t("parent.children")}</h2>
        {children.length === 0 ? (
          <p className="text-violet-200">{t("parent.noChildren")}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {children.map((c) => (
              <li key={c.id} className="flex items-center gap-4 rounded-2xl bg-black/20 p-4">
                <GiftBox rarity="epic" size={56} />
                <div>
                  <p className="text-xl font-bold">{c.name}</p>
                  <p className="text-sm text-violet-200">{t("parent.loginAs", { username: c.username ?? "" })}</p>
                  <p className="font-semibold text-legendary">{t("parent.points", { count: c.points })}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <CreateChildForm />

      <Card className="space-y-3">
        <h2 className="text-2xl font-bold">{t("parent.security")}</h2>
        <p className="text-violet-200">{t("passkey.count", { count: passkeys })}</p>
        <AddPasskeyButton />
      </Card>
    </main>
  );
}
