import type { Express } from "express";
import { storage } from "./storage";
import { insertMenuItemSchema, insertOrderSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.get("/api/menu", async (req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.get("/api/menu/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.getMenuItem(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.patch("/api/menu/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateMenuItem(id, req.body);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  app.get("/api/orders", async (req, res) => {
    const orders = await storage.getOrders();
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
    const orders = await storage.getOrdersByTable(req.params.tableId);
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

  app.patch("/api/orders/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const order = await storage.updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });
}
