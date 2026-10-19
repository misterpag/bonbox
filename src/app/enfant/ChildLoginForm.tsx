"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Alert, Button, Card, Field } from "@/components/ui";
import { PasskeySignInButton } from "@/components/PasskeyButton";

export function ChildLoginForm() {
  const t = useTranslations("childAuth");
  const tc = useTranslations("common");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(form: FormData) {
    setError(null);
    setBusy(true);
    const res = await authClient.signIn.username({
      username: String(form.get("username")).trim().toLowerCase(),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (res.error) return setError(res.error.message ?? tc("genericError"));
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md space-y-5">
      <PasskeySignInButton />
      <p className="text-center text-violet-200">— {t("or")} —</p>
      <form action={onSubmit} className="flex flex-col gap-4">
        <Field label={t("username")} name="username" required autoCapitalize="none" autoComplete="username" />
        <Field label={tc("password")} name="password" type="password" required autoComplete="current-password" />
        {error && <Alert tone="error">{error}</Alert>}
        <Button type="submit" disabled={busy}>
          {busy ? tc("loading") : t("signIn")}
        </Button>
      </form>
    </Card>
  );
}
