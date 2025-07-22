// src/db/schema.ts
import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Tabla users
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 150 }),
  name: varchar("name", { length: 200 }),
});

// Tabla user_tokens
export const user_tokens = mysqlTable(
  "user_tokens",
  {
    id: int("id").primaryKey().autoincrement(),
    user_id: int("user_id").notNull(),
    token: text("token").notNull(),
    expires_at: datetime("expires_at"),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      fk_user: index("fk_user_tokens_users_idx").on(table.user_id),
      // Las FK se configuran en migrations o en la DB directamente
    };
  }
);

// Tabla products
export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  price: int("price").notNull(),
  category_id: int("category_id")
    .notNull()
    .references(() => categories.id), // ✅ Agregado
});

export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
});

// Tabla permissions
export const permissions = mysqlTable(
  "permissions",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (table) => ({
    unique_name: uniqueIndex("name").on(table.name),
  })
);

// Tabla roles
export const roles = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 45 }).notNull(),
});

// Tabla role_permissions
export const role_permissions = mysqlTable(
  "role_permissions",
  {
    roles_id: int("roles_id").notNull(),
    permissions_id: int("permissions_id").notNull(),
  },
  (table) => ({
    idx_roles: index("fk_role_permissions_roles1_idx").on(table.roles_id),
    idx_permissions: index("fk_role_permissions_permissions1_idx").on(
      table.permissions_id
    ),
    primaryKey: primaryKey(table.roles_id, table.permissions_id),
  })
);

// Tabla stands
export const stands = mysqlTable(
  "stands",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 150 }).notNull(),
  },
  (table) => ({
    unique_name: uniqueIndex("name").on(table.name),
  })
);

// Tabla cashbox
export const cashbox = mysqlTable(
  "cashbox",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    stand_id: int("stand_id").notNull(),
  },
  (table) => ({
    unique_name: uniqueIndex("name").on(table.name),
    idx_stand: index("fk_cashbox_stands1_idx").on(table.stand_id),
  })
);

// Tabla sales
export const sales = mysqlTable(
  "sales",
  {
    id: int("id").primaryKey().autoincrement(),
    description: varchar("description", { length: 100 }),
    date: datetime("date"),
    cashbox_id: int("cashbox_id").notNull(),
    user_id: int("user_id").notNull(),
  },
  (table) => ({
    idx_cashbox: index("fk_sales_cashbox1_idx").on(table.cashbox_id),
    idx_user: index("fk_sales_users1_idx").on(table.user_id),
  })
);

// Tabla sales_details
export const sales_details = mysqlTable(
  "sales_details",
  {
    id: int("id").primaryKey().autoincrement(),
    sale_id: int("sale_id").notNull(),
    product_id: int("product_id").notNull(),
    amount: int("amount"),
  },
  (table) => ({
    idx_sale: index("fk_sales_details_sales1_idx").on(table.sale_id),
    idx_product: index("fk_sales_details_products1_idx").on(table.product_id),
  })
);
