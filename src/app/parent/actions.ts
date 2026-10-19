"use server";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createChild, ensureFamily, type CreateChildResult } from "@/lib/family";
import { getSession, roleOf } from "@/lib/session";

export type CreateChildState = { result?: CreateChildResult } | undefined;

export async function createChildAction(_prev: CreateChildState, form: FormData): Promise<CreateChildState> {
  const session = await getSession();
  if (!session || roleOf(session) !== "parent") throw new Error("Réservé aux parents");
  const t = await getTranslations("parent");
  const family = await ensureFamily(session.user.id, t("familyDefaultName", { name: session.user.name }));
  const result = await createChild(family.id, {
    name: String(form.get("name") ?? ""),
    username: String(form.get("username") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (result.ok) revalidatePath("/parent");
  return { result };
}
