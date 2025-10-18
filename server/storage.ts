import type { MenuItem, InsertMenuItem, Order, InsertOrder } from "@shared/schema";

export interface IStorage {
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | null>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | null>;
  
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | null>;
  getOrdersByTable(tableId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | null>;
}

export class MemStorage implements IStorage {
  private menuItems: MenuItem[] = [
    { id: 1, name: "Msemen", description: "Traditional Moroccan flatbread", price: 15, category: "bread", image: "/src/assets/msemen.jpg", available: true },
    { id: 2, name: "Baghrir", description: "Moroccan pancakes with honey", price: 20, category: "bread", image: "/src/assets/baghrir.jpg", available: true },
    { id: 3, name: "Harcha", description: "Semolina bread", price: 12, category: "bread", image: "/src/assets/harcha.jpg", available: true },
    { id: 4, name: "Mint Tea", description: "Traditional Moroccan mint tea", price: 10, category: "drinks", image: "/src/assets/mint-tea.jpg", available: true },
    { id: 5, name: "Coffee", description: "Moroccan coffee", price: 15, category: "drinks", image: "/src/assets/coffee.jpg", available: true },
    { id: 6, name: "Orange Juice", description: "Fresh orange juice", price: 18, category: "drinks", image: "/src/assets/orange-juice.jpg", available: true },
    { id: 7, name: "Bissara", description: "Traditional fava bean soup", price: 25, category: "dishes", image: "/src/assets/bissara.jpg", available: true },
    { id: 8, name: "Avocado Smoothie", description: "Creamy avocado smoothie", price: 22, category: "drinks", image: "/src/assets/avocado-smoothie.jpg", available: true },
    { id: 9, name: "Chebakia", description: "Honey-coated sesame cookies", price: 18, category: "sweets", image: "/src/assets/chebakia.jpg", available: true },
    { id: 10, name: "Baklava", description: "Sweet pastry with nuts", price: 20, category: "sweets", image: "/src/assets/baklava.jpg", available: true },
  ];
  private orders: Order[] = [];
  private nextMenuItemId = 11;
  private nextOrderId = 1;

  async getMenuItems(): Promise<MenuItem[]> {
    return this.menuItems;
  }

  async getMenuItem(id: number): Promise<MenuItem | null> {
    return this.menuItems.find(item => item.id === id) || null;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const newItem: MenuItem = { ...item, id: this.nextMenuItemId++, available: item.available ?? true };
    this.menuItems.push(newItem);
    return newItem;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | null> {
    const index = this.menuItems.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.menuItems[index] = { ...this.menuItems[index], ...updates };
    return this.menuItems[index];
  }

  async getOrders(): Promise<Order[]> {
    return this.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: number): Promise<Order | null> {
    return this.orders.find(order => order.id === id) || null;
  }

  async getOrdersByTable(tableId: string): Promise<Order[]> {
    return this.orders.filter(order => order.tableId === tableId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = { 
      ...order, 
      id: this.nextOrderId++,
      createdAt: new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | null> {
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return null;
    this.orders[index].status = status;
    return this.orders[index];
  }
}

export const storage = new MemStorage();
