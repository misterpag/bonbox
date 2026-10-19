"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui";

export function SignOutButton() {
  const t = useTranslations("common");
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {t("signOut")}
    </Button>
  );
}
