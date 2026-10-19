import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Connexion Postgres via node-postgres :
 * - en local : la base Docker (voir docker-compose.yml)
 * - en production : Neon (chaîne « pooled » avec sslmode=require)
 *
 * Pendant `next build`, DATABASE_URL peut être absente : le pool est créé
 * paresseusement et ne se connecte qu'à la première requête.
 */
const globalForDb = globalThis as unknown as { bonboxPool?: Pool };

const pool =
  globalForDb.bonboxPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL ?? "postgresql://bonbox:bonbox@localhost:5432/bonbox",
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.bonboxPool = pool;

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
