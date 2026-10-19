import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type Role = "parent" | "child" | "teacher";

/** Session courante (ou null), lue côté serveur. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function roleOf(session: Awaited<ReturnType<typeof getSession>>): Role | null {
  return (session?.user.role as Role | undefined) ?? null;
}
