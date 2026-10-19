import "server-only";
import { randomInt } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { childSettings, group, groupMember, passkey, pointLedger, user } from "@/db/schema";

export const USERNAME_PATTERN = /^[a-z0-9_.]{3,30}$/;
/** Domaine technique non routable (RFC 2606) : les enfants n'ont pas d'email réel. */
const CHILD_EMAIL_DOMAIN = "enfant.bonbox.invalid";

/** Retourne la famille du parent, en la créant au premier passage. */
export async function ensureFamily(parentId: string, defaultName: string) {
  const existing = await db
    .select({ id: group.id, name: group.name })
    .from(groupMember)
    .innerJoin(group, eq(group.id, groupMember.groupId))
    .where(and(eq(groupMember.userId, parentId), eq(group.kind, "family")))
    .limit(1);
  if (existing[0]) return existing[0];

  const [created] = await db.insert(group).values({ kind: "family", name: defaultName }).returning();
  await db.insert(groupMember).values({ groupId: created.id, userId: parentId, roleInGroup: "parent" });
  return { id: created.id, name: created.name };
}

/** Enfants d'une famille, avec leur cagnotte (somme du journal de points). */
export async function listChildren(familyId: string) {
  return db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      points: sql<number>`coalesce((select sum(${pointLedger.amount}) from ${pointLedger} where ${pointLedger.childId} = ${user.id}), 0)::int`,
    })
    .from(groupMember)
    .innerJoin(user, eq(user.id, groupMember.userId))
    .where(and(eq(groupMember.groupId, familyId), eq(groupMember.roleInGroup, "child")))
    .orderBy(user.createdAt);
}

export async function walletBalance(childId: string) {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${pointLedger.amount}), 0)::int` })
    .from(pointLedger)
    .where(eq(pointLedger.childId, childId));
  return row?.total ?? 0;
}

export async function passkeyCount(userId: string) {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(passkey)
    .where(eq(passkey.userId, userId));
  return row?.n ?? 0;
}

/** Code ami lisible, sans caractères ambigus (0/O, 1/I). Ex. « BX-7KQ4 ». */
function newFriendCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += alphabet[randomInt(alphabet.length)];
  return `BX-${code}`;
}

export type CreateChildResult =
  | { ok: true; name: string; username: string }
  | { ok: false; error: "nameRequired" | "usernameInvalid" | "usernameTaken" | "passwordTooShort" };

/**
 * Crée le compte d'un enfant, rattaché à la famille du parent.
 * On passe par l'adaptateur interne de Better Auth pour ne PAS ouvrir de session
 * au nom de l'enfant dans le navigateur du parent.
 */
export async function createChild(
  familyId: string,
  input: { name: string; username: string; password: string },
): Promise<CreateChildResult> {
  const name = input.name.trim();
  const username = input.username.trim().toLowerCase();
  if (!name) return { ok: false, error: "nameRequired" };
  if (!USERNAME_PATTERN.test(username)) return { ok: false, error: "usernameInvalid" };
  if (input.password.length < 8) return { ok: false, error: "passwordTooShort" };

  const taken = await db.select({ id: user.id }).from(user).where(eq(user.username, username)).limit(1);
  if (taken[0]) return { ok: false, error: "usernameTaken" };

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(input.password);
  const child = await ctx.internalAdapter.createUser({
    name,
    email: `${username}@${CHILD_EMAIL_DOMAIN}`,
    username,
    displayUsername: name,
    role: "child",
  }, { method: "parent-created-child" });
  await ctx.internalAdapter.linkAccount({
    userId: child.id,
    providerId: "credential",
    accountId: child.id,
    password: hash,
  });

  await db.insert(groupMember).values({ groupId: familyId, userId: child.id, roleInGroup: "child" });
  for (let attempt = 0; attempt < 5; attempt++) {
    const inserted = await db
      .insert(childSettings)
      .values({ childId: child.id, friendCode: newFriendCode() })
      .onConflictDoNothing()
      .returning();
    if (inserted.length) break;
  }
  return { ok: true, name, username };
}
