import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  available: boolean("available").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableId: text("table_id").notNull(),
  items: text("items").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
