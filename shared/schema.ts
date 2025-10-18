import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tables without foreign keys first
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  permissions: jsonb("permissions").notNull().default('[]'),
});

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  active: boolean("active").default(true).notNull(),
});

export const paymentTypes = pgTable("payment_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  nameFr: text("name_fr"),
  active: boolean("active").default(true).notNull(),
});

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  nameFr: text("name_fr"),
  displayOrder: integer("display_order").default(0),
  image: text("image"),
  active: boolean("active").default(true).notNull(),
});

// Tables with foreign keys
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  pin: text("pin"),
  roleId: integer("role_id").notNull(),
  branchId: integer("branch_id"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const terminals = pgTable("terminals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  branchId: integer("branch_id").notNull(),
  type: text("type").notNull().default("pos"),
  active: boolean("active").default(true).notNull(),
  settings: jsonb("settings").default('{}'),
});

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").notNull(),
  number: integer("number").notNull(),
  name: text("name").notNull(),
  capacity: integer("capacity").default(4),
  status: text("status").notNull().default("available"),
  position: jsonb("position").default('{"x": 0, "y": 0}'),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  nameFr: text("name_fr"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  descriptionFr: text("description_fr"),
  price: integer("price").notNull(),
  image: text("image"),
  available: boolean("available").default(true).notNull(),
  displayOrder: integer("display_order").default(0),
});

export const modifiers = pgTable("modifiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  nameFr: text("name_fr"),
  price: integer("price").notNull().default(0),
  menuItemId: integer("menu_item_id"),
  active: boolean("active").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  tableId: integer("table_id"),
  tableIdentifier: text("table_identifier"),
  branchId: integer("branch_id").notNull(),
  terminalId: integer("terminal_id"),
  userId: integer("user_id"),
  type: text("type").notNull().default("dine-in"),
  status: text("status").notNull().default("pending"),
  subtotal: integer("subtotal").notNull().default(0),
  taxAmount: integer("tax_amount").notNull().default(0),
  serviceCharge: integer("service_charge").notNull().default(0),
  discountAmount: integer("discount_amount").notNull().default(0),
  total: integer("total").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  modifiers: jsonb("modifiers").default('[]'),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  paymentTypeId: integer("payment_type_id").notNull(),
  amount: integer("amount").notNull(),
  tipAmount: integer("tip_amount").notNull().default(0),
  reference: text("reference"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const printers = pgTable("printers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  terminalId: integer("terminal_id"),
  connectionType: text("connection_type").notNull(),
  address: text("address"),
  model: text("model"),
  protocol: text("protocol").notNull().default("escpos"),
  settings: jsonb("settings").default('{}'),
  active: boolean("active").default(true).notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  category: text("category").notNull().default("general"),
  description: text("description"),
});

export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  terminalId: integer("terminal_id"),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  startingCash: integer("starting_cash").notNull().default(0),
  endingCash: integer("ending_cash"),
  expectedCash: integer("expected_cash"),
  notes: text("notes"),
  status: text("status").notNull().default("open"),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  changes: jsonb("changes"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const offlineQueue = pgTable("offline_queue", {
  id: serial("id").primaryKey(),
  terminalId: integer("terminal_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  data: jsonb("data").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

// Type exports
export type Role = typeof roles.$inferSelect;
export type User = typeof users.$inferSelect;
export type Branch = typeof branches.$inferSelect;
export type Terminal = typeof terminals.$inferSelect;
export type Table = typeof tables.$inferSelect;
export type MenuCategory = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Modifier = typeof modifiers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type PaymentType = typeof paymentTypes.$inferSelect;
export type Printer = typeof printers.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type Shift = typeof shifts.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type OfflineQueueItem = typeof offlineQueue.$inferSelect;

// Insert schemas
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBranchSchema = createInsertSchema(branches).omit({ id: true });
export const insertTerminalSchema = createInsertSchema(terminals).omit({ id: true });
export const insertTableSchema = createInsertSchema(tables).omit({ id: true });
export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertModifierSchema = createInsertSchema(modifiers).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export const insertPaymentTypeSchema = createInsertSchema(paymentTypes).omit({ id: true });
export const insertPrinterSchema = createInsertSchema(printers).omit({ id: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true });
export const insertShiftSchema = createInsertSchema(shifts).omit({ id: true, startTime: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertOfflineQueueItemSchema = createInsertSchema(offlineQueue).omit({ id: true, createdAt: true });

// Insert types
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type InsertTerminal = z.infer<typeof insertTerminalSchema>;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertModifier = z.infer<typeof insertModifierSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertPaymentType = z.infer<typeof insertPaymentTypeSchema>;
export type InsertPrinter = z.infer<typeof insertPrinterSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type InsertShift = z.infer<typeof insertShiftSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertOfflineQueueItem = z.infer<typeof insertOfflineQueueItemSchema>;
