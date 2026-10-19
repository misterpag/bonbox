"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Alert, Button, Card, Field } from "@/components/ui";
import { PasskeySignInButton } from "@/components/PasskeyButton";

export function ParentAuthForm() {
  const t = useTranslations("parentAuth");
  const tc = useTranslations("common");
  const router = useRouter();
  const [mode, setMode] = useState<"signUp" | "signIn">("signUp");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(form: FormData) {
    setError(null);
    setBusy(true);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const res =
      mode === "signUp"
        ? await authClient.signUp.email({ name: String(form.get("name")), email, password })
        : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (res.error) return setError(res.error.message ?? tc("genericError"));
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-1">
        {(["signUp", "signIn"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-xl py-2 font-bold ${mode === m ? "bg-white text-night" : "text-violet-100"}`}
          >
            {t(m === "signUp" ? "signUpTab" : "signInTab")}
          </button>
        ))}
      </div>
      <form action={onSubmit} className="flex flex-col gap-4">
        {mode === "signUp" && <Field label={t("name")} name="name" required autoComplete="given-name" />}
        <Field label={t("email")} name="email" type="email" required autoComplete="email" />
        <Field
          label={tc("password")}
          name="password"
          type="password"
          required
          minLength={8}
          hint={mode === "signUp" ? t("passwordHint") : undefined}
          autoComplete={mode === "signUp" ? "new-password" : "current-password"}
        />
        {error && <Alert tone="error">{error}</Alert>}
        <Button type="submit" disabled={busy}>
          {busy ? tc("loading") : t(mode)}
        </Button>
      </form>
      {mode === "signIn" && <PasskeySignInButton />}
    </Card>
  );
}
