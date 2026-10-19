import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Pendant `next build`, DATABASE_URL peut être absente : on utilise une URL factice
// qui n'est jamais appelée. À l'exécution, elle doit pointer vers la base Neon.
const url = process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build";

export const db = drizzle(neon(url), { schema });
