import type { Express } from "express";
import { storage } from "./storage";
import {
  insertUserSchema, insertRoleSchema, insertBranchSchema, insertTerminalSchema,
  insertTableSchema, insertMenuCategorySchema, insertMenuItemSchema, insertModifierSchema,
  insertOrderSchema, insertOrderItemSchema, insertPaymentSchema, insertPaymentTypeSchema,
  insertPrinterSchema, insertSettingSchema, insertShiftSchema, insertAuditLogSchema,
  insertOfflineQueueItemSchema
} from "@shared/schema";
import { z } from "zod";

// Simple auth middleware (placeholder - to be implemented properly)
function requireAuth(req: any, res: any, next: any) {
  // TODO: Implement JWT authentication
  next();
}

export function registerRoutes(app: Express) {
  // ===== AUTH ROUTES =====
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // TODO: Implement password hashing and comparison
      // For now, just return user data with a mock token
      res.json({ user, token: "mock-jwt-token", refreshToken: "mock-refresh-token" });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/pin-login", async (req, res) => {
    try {
      const { pin } = req.body;
      const user = await storage.getUserByPin(pin);
      if (!user) {
        return res.status(401).json({ message: "Invalid PIN" });
      }
      res.json({ user, token: "mock-jwt-token" });
    } catch (error) {
      res.status(500).json({ message: "PIN login failed" });
    }
  });

  // ===== ROLE ROUTES =====
  app.get("/api/roles", async (req, res) => {
    const roles = await storage.getRoles();
    res.json(roles);
  });

  app.post("/api/roles", async (req, res) => {
    try {
      const validatedData = insertRoleSchema.parse(req.body);
      const role = await storage.createRole(validatedData);
      res.json(role);
    } catch (error) {
      res.status(400).json({ message: "Invalid role data" });
    }
  });

  // ===== USER ROUTES =====
  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      // TODO: Hash password before storing
      const user = await storage.createUser(validatedData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.updateUser(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // ===== BRANCH ROUTES =====
  app.get("/api/branches", async (req, res) => {
    const branches = await storage.getBranches();
    res.json(branches);
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const validatedData = insertBranchSchema.parse(req.body);
      const branch = await storage.createBranch(validatedData);
      res.json(branch);
    } catch (error) {
      res.status(400).json({ message: "Invalid branch data" });
    }
  });

  // ===== TERMINAL ROUTES =====
  app.get("/api/terminals", async (req, res) => {
    const terminals = await storage.getTerminals();
    res.json(terminals);
  });

  app.post("/api/terminals", async (req, res) => {
    try {
      const validatedData = insertTerminalSchema.parse(req.body);
      const terminal = await storage.createTerminal(validatedData);
      res.json(terminal);
    } catch (error) {
      res.status(400).json({ message: "Invalid terminal data" });
    }
  });

  // ===== TABLE ROUTES =====
  app.get("/api/tables", async (req, res) => {
    const branchId = req.query.branchId ? parseInt(req.query.branchId as string) : undefined;
    const tables = await storage.getTables(branchId);
    res.json(tables);
  });

  app.get("/api/tables/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const table = await storage.getTable(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.json(table);
  });

  app.post("/api/tables", async (req, res) => {
    try {
      const validatedData = insertTableSchema.parse(req.body);
      const table = await storage.createTable(validatedData);
      res.json(table);
    } catch (error) {
      res.status(400).json({ message: "Invalid table data" });
    }
  });

  app.patch("/api/tables/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const table = await storage.updateTable(id, req.body);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.json(table);
  });

  // ===== MENU CATEGORY ROUTES =====
  app.get("/api/menu-categories", async (req, res) => {
    const categories = await storage.getMenuCategories();
    res.json(categories);
  });

  app.post("/api/menu-categories", async (req, res) => {
    try {
      const validatedData = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createMenuCategory(validatedData);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.patch("/api/menu-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await storage.updateMenuCategory(id, req.body);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  // ===== MENU ITEM ROUTES =====
  app.get("/api/menu-items", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const items = await storage.getMenuItems(categoryId);
    res.json(items);
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.getMenuItem(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.patch("/api/menu-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateMenuItem(id, req.body);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  // ===== MODIFIER ROUTES =====
  app.get("/api/modifiers", async (req, res) => {
    const menuItemId = req.query.menuItemId ? parseInt(req.query.menuItemId as string) : undefined;
    const modifiers = await storage.getModifiers(menuItemId);
    res.json(modifiers);
  });

  app.post("/api/modifiers", async (req, res) => {
    try {
      const validatedData = insertModifierSchema.parse(req.body);
      const modifier = await storage.createModifier(validatedData);
      res.json(modifier);
    } catch (error) {
      res.status(400).json({ message: "Invalid modifier data" });
    }
  });

  // ===== ORDER ROUTES =====
  app.get("/api/orders", async (req, res) => {
    const filters: any = {};
    if (req.query.branchId) filters.branchId = parseInt(req.query.branchId as string);
    if (req.query.status) filters.status = req.query.status;
    if (req.query.date) filters.date = new Date(req.query.date as string);
    const orders = await storage.getOrders(filters);
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  app.get("/api/orders/table/:tableId", async (req, res) => {
    const tableId = parseInt(req.params.tableId);
    const orders = await storage.getOrdersByTable(tableId);
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const order = await storage.updateOrder(id, req.body);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  // ===== ORDER ITEM ROUTES =====
  app.get("/api/order-items/:orderId", async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const items = await storage.getOrderItems(orderId);
    res.json(items);
  });

  app.post("/api/order-items", async (req, res) => {
    try {
      const validatedData = insertOrderItemSchema.parse(req.body);
      const item = await storage.createOrderItem(validatedData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid order item data" });
    }
  });

  app.patch("/api/order-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateOrderItem(id, req.body);
    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }
    res.json(item);
  });

  // ===== PAYMENT ROUTES =====
  app.get("/api/payments", async (req, res) => {
    const orderId = req.query.orderId ? parseInt(req.query.orderId as string) : undefined;
    const payments = await storage.getPayments(orderId);
    res.json(payments);
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });

  // ===== PAYMENT TYPE ROUTES =====
  app.get("/api/payment-types", async (req, res) => {
    const types = await storage.getPaymentTypes();
    res.json(types);
  });

  app.post("/api/payment-types", async (req, res) => {
    try {
      const validatedData = insertPaymentTypeSchema.parse(req.body);
      const type = await storage.createPaymentType(validatedData);
      res.json(type);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment type data" });
    }
  });

  // ===== PRINTER ROUTES =====
  app.get("/api/printers", async (req, res) => {
    const terminalId = req.query.terminalId ? parseInt(req.query.terminalId as string) : undefined;
    const printers = await storage.getPrinters(terminalId);
    res.json(printers);
  });

  app.post("/api/printers", async (req, res) => {
    try {
      const validatedData = insertPrinterSchema.parse(req.body);
      const printer = await storage.createPrinter(validatedData);
      res.json(printer);
    } catch (error) {
      res.status(400).json({ message: "Invalid printer data" });
    }
  });

  app.patch("/api/printers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const printer = await storage.updatePrinter(id, req.body);
    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }
    res.json(printer);
  });

  // ===== SETTINGS ROUTES =====
  app.get("/api/settings", async (req, res) => {
    const category = req.query.category as string | undefined;
    const settings = await storage.getSettings(category);
    res.json(settings);
  });

  app.get("/api/settings/:key", async (req, res) => {
    const setting = await storage.getSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.json(setting);
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingSchema.parse(req.body);
      const setting = await storage.upsertSetting(validatedData);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid setting data" });
    }
  });

  // ===== SHIFT ROUTES =====
  app.get("/api/shifts", async (req, res) => {
    const filters: any = {};
    if (req.query.userId) filters.userId = parseInt(req.query.userId as string);
    if (req.query.status) filters.status = req.query.status;
    const shifts = await storage.getShifts(filters);
    res.json(shifts);
  });

  app.get("/api/shifts/current/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const shift = await storage.getCurrentShift(userId);
    res.json(shift);
  });

  app.post("/api/shifts", async (req, res) => {
    try {
      const validatedData = insertShiftSchema.parse(req.body);
      const shift = await storage.createShift(validatedData);
      res.json(shift);
    } catch (error) {
      res.status(400).json({ message: "Invalid shift data" });
    }
  });

  app.patch("/api/shifts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const shift = await storage.updateShift(id, req.body);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.json(shift);
  });

  // ===== AUDIT LOG ROUTES =====
  app.get("/api/audit-logs", async (req, res) => {
    const filters: any = {};
    if (req.query.userId) filters.userId = parseInt(req.query.userId as string);
    if (req.query.entityType) filters.entityType = req.query.entityType;
    const logs = await storage.getAuditLogs(filters);
    res.json(logs);
  });

  app.post("/api/audit-logs", async (req, res) => {
    try {
      const validatedData = insertAuditLogSchema.parse(req.body);
      const log = await storage.createAuditLog(validatedData);
      res.json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid audit log data" });
    }
  });

  // ===== OFFLINE SYNC ROUTES =====
  app.get("/api/sync/offline/:terminalId", async (req, res) => {
    const terminalId = parseInt(req.params.terminalId);
    const queue = await storage.getOfflineQueue(terminalId);
    res.json(queue);
  });

  app.post("/api/sync/offline", async (req, res) => {
    try {
      const validatedData = insertOfflineQueueItemSchema.parse(req.body);
      const item = await storage.createOfflineQueueItem(validatedData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid sync data" });
    }
  });

  app.patch("/api/sync/offline/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateOfflineQueueItem(id, req.body);
    if (!item) {
      return res.status(404).json({ message: "Queue item not found" });
    }
    res.json(item);
  });

  // ===== REPORTS ROUTES =====
  app.get("/api/reports/daily", async (req, res) => {
    const branchId = req.query.branchId ? parseInt(req.query.branchId as string) : undefined;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    
    const orders = await storage.getOrders({ branchId, date, status: "completed" });
    
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    res.json({
      date: date.toISOString(),
      totalSales,
      totalOrders,
      avgOrderValue,
      orders
    });
  });

  app.get("/api/reports/items", async (req, res) => {
    const branchId = req.query.branchId ? parseInt(req.query.branchId as string) : undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null;
    
    // TODO: Implement item-level reporting by analyzing order items
    res.json({ message: "Item reports to be implemented" });
  });
}
