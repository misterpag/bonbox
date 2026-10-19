import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";
import { passkey } from "@better-auth/passkey";
import { db } from "@/db";
import * as schema from "@/db/schema";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

/**
 * Authentification Bonbox :
 * - parents (et profs en V2) : email + mot de passe
 * - enfants : identifiant (username) + mot de passe, compte créé par un adulte
 * - tous : déverrouillage biométrique par passkey (WebAuthn) après la première connexion
 */
export const auth = betterAuth({
  baseURL: appUrl,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "parent", input: false },
      locale: { type: "string", required: false, defaultValue: "fr" },
    },
  },
  plugins: [
    username(),
    passkey({ rpName: "Bonbox", rpID: new URL(appUrl).hostname, origin: appUrl }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
