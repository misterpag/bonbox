"use client";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Button, Card, Field } from "@/components/ui";
import { createChildAction, type CreateChildState } from "./actions";

export function CreateChildForm() {
  const t = useTranslations("parent");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState<CreateChildState, FormData>(createChildAction, undefined);
  const r = state?.result;

  return (
    <Card className="space-y-4">
      <h2 className="text-2xl font-bold">{t("addChild")}</h2>
      <form action={action} className="flex flex-col gap-4" key={r?.ok ? r.username : "form"}>
        <Field label={t("childName")} name="name" required />
        <Field
          label={t("childUsername")}
          name="username"
          required
          pattern="[A-Za-z0-9_.]{3,30}"
          hint={t("childUsernameHint")}
          autoCapitalize="none"
          autoComplete="off"
        />
        <Field label={t("childPassword")} name="password" type="password" required minLength={8} autoComplete="new-password" />
        {r && !r.ok && <Alert tone="error">{t(r.error)}</Alert>}
        {r?.ok && <Alert tone="success">{t("childCreated", { name: r.name, username: r.username })}</Alert>}
        <Button type="submit" disabled={pending}>
          {pending ? tc("loading") : t("createChild")}
        </Button>
      </form>
    </Card>
  );
}
