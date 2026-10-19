import {
  pgTable, pgEnum, text, timestamp, boolean, integer, uuid, uniqueIndex, index, primaryKey,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Authentification (tables attendues par Better Auth)                 */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // Les enfants n'ont pas d'email : on génère une adresse technique non routable.
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role").default("parent"), // "parent" | "child" | "teacher"
  locale: text("locale").default("fr"), // "fr" | "en"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Clés biométriques (WebAuthn) : une par appareil. */
export const passkey = pgTable("passkey", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credential_id").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"),
  aaguid: text("aaguid"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Domaine Bonbox                                                      */
/* ------------------------------------------------------------------ */

export const rarity = pgEnum("rarity", ["rare", "epic", "legendary"]);
export const groupKind = pgEnum("group_kind", ["family", "class"]);
export const itemType = pgEnum("item_type", ["skin", "hat", "accessory", "background", "emote", "album_card"]);
export const boxSource = pgEnum("box_source", ["gift_rarity", "gift_item", "shop_direct", "shop_mystery", "coupon"]);
export const approvalStatus = pgEnum("approval_status", ["pending", "approved", "rejected", "cancelled", "completed"]);

/** Famille (MVP) ou classe (V2). */
export const group = pgTable("group", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: groupKind("kind").notNull(),
  name: text("name").notNull(),
  leaderboardHidden: boolean("leaderboard_hidden").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const groupMember = pgTable("group_member", {
  groupId: uuid("group_id").notNull().references(() => group.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  roleInGroup: text("role_in_group").notNull(), // "parent" | "teacher" | "child"
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.groupId, t.userId] })]);

/** Réglages propres à un enfant (fixés par ses parents). */
export const childSettings = pgTable("child_settings", {
  childId: text("child_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  friendCode: text("friend_code").notNull().unique(),
  leaderboardHidden: boolean("leaderboard_hidden").notNull().default(false),
});

/**
 * Journal des bons points : ajouts uniquement, jamais de retrait ni d'annulation.
 * Les dépenses en boutique sont des lignes négatives avec giver_id nul et shop_box_id renseigné.
 * Le solde de la cagnotte = somme des montants.
 */
export const pointLedger = pgTable("point_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: text("child_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  giverId: text("giver_id").references(() => user.id, { onDelete: "set null" }),
  groupId: uuid("group_id").references(() => group.id, { onDelete: "set null" }),
  amount: integer("amount").notNull(),
  reason: text("reason"),
  shopBoxId: uuid("shop_box_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("point_ledger_child_idx").on(t.childId)]);

export const series = pgTable("series", {
  id: text("id").primaryKey(), // slug, ex. "dinosaures"
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  completionBonus: integer("completion_bonus").notNull().default(0),
});

/** Catalogue officiel des objets numériques. */
export const item = pgTable("item", {
  id: text("id").primaryKey(), // slug, ex. "hat-pirate"
  type: itemType("type").notNull(),
  rarity: rarity("rarity").notNull(),
  seriesId: text("series_id").references(() => series.id),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  assetPath: text("asset_path").notNull(),
  inShop: boolean("in_shop").notNull().default(true),
});

/** Liste réutilisable de coupons réels d'un parent. */
export const couponTemplate = pgTable("coupon_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: text("parent_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  emoji: text("emoji"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Boîte reçue ou achetée. Son contenu est décidé à la création, côté serveur :
 * l'animation d'ouverture ne fait que révéler un résultat déjà enregistré.
 */
export const box = pgTable("box", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: text("child_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rarity: rarity("rarity").notNull(),
  source: boxSource("source").notNull(),
  giverId: text("giver_id").references(() => user.id, { onDelete: "set null" }),
  itemId: text("item_id").references(() => item.id),
  couponTemplateId: uuid("coupon_template_id").references(() => couponTemplate.id, { onDelete: "set null" }),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  openedAt: timestamp("opened_at"),
}, (t) => [index("box_child_idx").on(t.childId)]);

/** Coupon réel remis à un enfant (toujours via une boîte jaune). */
export const coupon = pgTable("coupon", {
  id: uuid("id").primaryKey().defaultRandom(),
  boxId: uuid("box_id").notNull().references(() => box.id, { onDelete: "cascade" }),
  childId: text("child_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(), // copie figée du modèle au moment de l'envoi
  description: text("description"),
  emoji: text("emoji"),
  usedAt: timestamp("used_at"),
});

/** Objets possédés, doublons inclus (ils servent aux échanges). */
export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: text("child_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  itemId: text("item_id").notNull().references(() => item.id),
  fromBoxId: uuid("from_box_id").references(() => box.id, { onDelete: "set null" }),
  locked: boolean("locked").notNull().default(false), // équipé ou proposé dans un échange
  acquiredAt: timestamp("acquired_at").notNull().defaultNow(),
}, (t) => [index("inventory_child_idx").on(t.childId)]);

/** Objets équipés sur l'avatar : un par emplacement. */
export const avatarLoadout = pgTable("avatar_loadout", {
  childId: text("child_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  slot: itemType("slot").notNull(),
  inventoryId: uuid("inventory_id").notNull().references(() => inventory.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.childId, t.slot] })]);

/** Amitié entre deux enfants, validée par un parent de chacun. child_a < child_b. */
export const friendship = pgTable("friendship", {
  id: uuid("id").primaryKey().defaultRandom(),
  childA: text("child_a").notNull().references(() => user.id, { onDelete: "cascade" }),
  childB: text("child_b").notNull().references(() => user.id, { onDelete: "cascade" }),
  requestedBy: text("requested_by").notNull().references(() => user.id),
  approvedByParentA: text("approved_by_parent_a").references(() => user.id),
  approvedByParentB: text("approved_by_parent_b").references(() => user.id),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("friendship_pair_idx").on(t.childA, t.childB)]);

/** Échange un objet contre un objet de même rareté, validé par un parent de chaque enfant. */
export const trade = pgTable("trade", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromChild: text("from_child").notNull().references(() => user.id, { onDelete: "cascade" }),
  toChild: text("to_child").notNull().references(() => user.id, { onDelete: "cascade" }),
  offeredInventoryId: uuid("offered_inventory_id").notNull().references(() => inventory.id),
  requestedInventoryId: uuid("requested_inventory_id").notNull().references(() => inventory.id),
  acceptedByRecipient: boolean("accepted_by_recipient").notNull().default(false),
  approvedByParentFrom: text("approved_by_parent_from").references(() => user.id),
  approvedByParentTo: text("approved_by_parent_to").references(() => user.id),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
