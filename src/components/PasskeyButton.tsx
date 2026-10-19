"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Alert, Button } from "@/components/ui";

/** Enregistre une passkey (empreinte, Face ID, Windows Hello…) pour l'utilisateur connecté. */
export function AddPasskeyButton() {
  const t = useTranslations("passkey");
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error" | "unsupported">("idle");

  async function add() {
    if (typeof window === "undefined" || !window.PublicKeyCredential) return setStatus("unsupported");
    setStatus("busy");
    // Sans nom explicite, la passkey porte le prénom de l'utilisateur : c'est ce qui
    // s'affiche dans le sélecteur du système sur une tablette partagée par la famille.
    const res = await authClient.passkey.addPasskey();
    if (res?.error) return setStatus("error");
    setStatus("done");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" onClick={add} disabled={status === "busy"}>
        {t("add")}
      </Button>
      {status === "done" && <Alert tone="success">{t("added")}</Alert>}
      {status === "unsupported" && <Alert tone="error">{t("notSupported")}</Alert>}
      {status === "error" && <Alert tone="error">{t("notSupported")}</Alert>}
    </div>
  );
}

/** Connexion par passkey, puis redirection vers l'espace du bon rôle. */
export function PasskeySignInButton() {
  const t = useTranslations("passkey");
  const router = useRouter();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setError(false);
    setBusy(true);
    const res = await authClient.signIn.passkey();
    setBusy(false);
    if (res?.error) return setError(true);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" onClick={signIn} disabled={busy}>
        {t("signIn")}
      </Button>
      {error && <Alert tone="error">{t("notSupported")}</Alert>}
    </div>
  );
}
