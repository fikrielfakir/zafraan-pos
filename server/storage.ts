import type {
  Role, InsertRole,
  User, InsertUser,
  Branch, InsertBranch,
  Terminal, InsertTerminal,
  Table, InsertTable,
  MenuCategory, InsertMenuCategory,
  MenuItem, InsertMenuItem,
  Modifier, InsertModifier,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Payment, InsertPayment,
  PaymentType, InsertPaymentType,
  Printer, InsertPrinter,
  Setting, InsertSetting,
  Shift, InsertShift,
  AuditLog, InsertAuditLog,
  OfflineQueueItem, InsertOfflineQueueItem
} from "@shared/schema";

export interface IStorage {
  // Roles
  getRoles(): Promise<Role[]>;
  getRole(id: number): Promise<Role | null>;
  createRole(role: InsertRole): Promise<Role>;
  
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByPin(pin: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | null>;
  
  // Branches
  getBranches(): Promise<Branch[]>;
  getBranch(id: number): Promise<Branch | null>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  updateBranch(id: number, branch: Partial<InsertBranch>): Promise<Branch | null>;
  
  // Terminals
  getTerminals(): Promise<Terminal[]>;
  getTerminal(id: number): Promise<Terminal | null>;
  getTerminalByCode(code: string): Promise<Terminal | null>;
  createTerminal(terminal: InsertTerminal): Promise<Terminal>;
  updateTerminal(id: number, terminal: Partial<InsertTerminal>): Promise<Terminal | null>;
  
  // Tables
  getTables(branchId?: number): Promise<Table[]>;
  getTable(id: number): Promise<Table | null>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: number, table: Partial<InsertTable>): Promise<Table | null>;
  
  // Menu Categories
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuCategory(id: number): Promise<MenuCategory | null>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  updateMenuCategory(id: number, category: Partial<InsertMenuCategory>): Promise<MenuCategory | null>;
  
  // Menu Items
  getMenuItems(categoryId?: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | null>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | null>;
  
  // Modifiers
  getModifiers(menuItemId?: number): Promise<Modifier[]>;
  getModifier(id: number): Promise<Modifier | null>;
  createModifier(modifier: InsertModifier): Promise<Modifier>;
  
  // Orders
  getOrders(filters?: { branchId?: number; status?: string; date?: Date }): Promise<Order[]>;
  getOrder(id: number): Promise<Order | null>;
  getOrdersByTable(tableId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | null>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  updateOrderItem(id: number, item: Partial<InsertOrderItem>): Promise<OrderItem | null>;
  
  // Payments
  getPayments(orderId?: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Payment Types
  getPaymentTypes(): Promise<PaymentType[]>;
  createPaymentType(type: InsertPaymentType): Promise<PaymentType>;
  
  // Printers
  getPrinters(terminalId?: number): Promise<Printer[]>;
  getPrinter(id: number): Promise<Printer | null>;
  createPrinter(printer: InsertPrinter): Promise<Printer>;
  updatePrinter(id: number, printer: Partial<InsertPrinter>): Promise<Printer | null>;
  
  // Settings
  getSettings(category?: string): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | null>;
  upsertSetting(setting: InsertSetting): Promise<Setting>;
  
  // Shifts
  getShifts(filters?: { userId?: number; status?: string }): Promise<Shift[]>;
  getCurrentShift(userId: number): Promise<Shift | null>;
  createShift(shift: InsertShift): Promise<Shift>;
  updateShift(id: number, shift: Partial<InsertShift>): Promise<Shift | null>;
  
  // Audit Logs
  getAuditLogs(filters?: { userId?: number; entityType?: string }): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // Offline Queue
  getOfflineQueue(terminalId: number): Promise<OfflineQueueItem[]>;
  createOfflineQueueItem(item: InsertOfflineQueueItem): Promise<OfflineQueueItem>;
  updateOfflineQueueItem(id: number, item: Partial<InsertOfflineQueueItem>): Promise<OfflineQueueItem | null>;
}

export class MemStorage implements IStorage {
  private roles: Role[] = [
    { id: 1, name: "Admin", permissions: ["*"] },
    { id: 2, name: "Manager", permissions: ["view_reports", "manage_menu", "manage_users", "manage_orders"] },
    { id: 3, name: "Waiter", permissions: ["create_orders", "view_orders", "manage_tables"] },
    { id: 4, name: "Kitchen", permissions: ["view_orders", "update_order_status"] },
  ];
  
  private users: User[] = [
    { id: 1, username: "admin", password: "$2b$10$abcdefghijklmnop", pin: "1234", roleId: 1, branchId: 1, active: true, createdAt: new Date() },
    { id: 2, username: "manager", password: "$2b$10$abcdefghijklmnop", pin: "5678", roleId: 2, branchId: 1, active: true, createdAt: new Date() },
  ];
  
  private branches: Branch[] = [
    { id: 1, name: "Main Branch", address: "123 Main St", phone: "+212600000000", active: true },
  ];
  
  private terminals: Terminal[] = [
    { id: 1, name: "POS Terminal 1", code: "TERM001", branchId: 1, type: "pos", active: true, settings: {} },
  ];
  
  private tables: Table[] = [
    { id: 1, branchId: 1, number: 1, name: "Table 1", capacity: 4, status: "available", position: { x: 0, y: 0 } },
    { id: 2, branchId: 1, number: 2, name: "Table 2", capacity: 4, status: "available", position: { x: 100, y: 0 } },
    { id: 3, branchId: 1, number: 3, name: "Table 3", capacity: 2, status: "available", position: { x: 200, y: 0 } },
    { id: 4, branchId: 1, number: 4, name: "Table 4", capacity: 6, status: "available", position: { x: 0, y: 100 } },
  ];
  
  private menuCategories: MenuCategory[] = [
    { id: 1, name: "Bread", nameAr: "خبز", nameFr: "Pain", displayOrder: 1, image: null, active: true },
    { id: 2, name: "Drinks", nameAr: "مشروبات", nameFr: "Boissons", displayOrder: 2, image: null, active: true },
    { id: 3, name: "Dishes", nameAr: "أطباق", nameFr: "Plats", displayOrder: 3, image: null, active: true },
    { id: 4, name: "Sweets", nameAr: "حلويات", nameFr: "Desserts", displayOrder: 4, image: null, active: true },
  ];
  
  private menuItems: MenuItem[] = [
    { id: 1, categoryId: 1, name: "Msemen", nameAr: "مسمن", nameFr: "Msemen", description: "Traditional flatbread", descriptionAr: "خبز تقليدي", descriptionFr: "Pain traditionnel", price: 15, image: null, available: true, displayOrder: 1 },
    { id: 2, categoryId: 1, name: "Baghrir", nameAr: "بغرير", nameFr: "Baghrir", description: "Moroccan pancakes", descriptionAr: "فطائر مغربية", descriptionFr: "Crêpes marocaines", price: 20, image: null, available: true, displayOrder: 2 },
    { id: 3, categoryId: 2, name: "Mint Tea", nameAr: "شاي بالنعناع", nameFr: "Thé à la menthe", description: "Traditional mint tea", descriptionAr: "شاي مغربي تقليدي", descriptionFr: "Thé traditionnel", price: 10, image: null, available: true, displayOrder: 1 },
    { id: 4, categoryId: 2, name: "Coffee", nameAr: "قهوة", nameFr: "Café", description: "Moroccan coffee", descriptionAr: "قهوة مغربية", descriptionFr: "Café marocain", price: 15, image: null, available: true, displayOrder: 2 },
  ];
  
  private modifiers: Modifier[] = [
    { id: 1, name: "Extra Honey", nameAr: "عسل إضافي", nameFr: "Miel supplémentaire", price: 5, menuItemId: 1, active: true },
    { id: 2, name: "Extra Butter", nameAr: "زبدة إضافية", nameFr: "Beurre supplémentaire", price: 3, menuItemId: 1, active: true },
    { id: 3, name: "Extra Sugar", nameAr: "سكر إضافي", nameFr: "Sucre supplémentaire", price: 0, menuItemId: 3, active: true },
  ];
  
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private payments: Payment[] = [];
  
  private paymentTypes: PaymentType[] = [
    { id: 1, name: "Cash", nameAr: "نقدا", nameFr: "Espèces", active: true },
    { id: 2, name: "Card", nameAr: "بطاقة", nameFr: "Carte", active: true },
    { id: 3, name: "Mobile Payment", nameAr: "دفع عبر الهاتف", nameFr: "Paiement mobile", active: true },
  ];
  
  private printers: Printer[] = [];
  
  private settings: Setting[] = [
    { id: 1, key: "brandName", value: "Café POS", category: "branding", description: "Business name" },
    { id: 2, key: "currency", value: "DH", category: "general", description: "Currency symbol" },
    { id: 3, key: "taxRate", value: 0.2, category: "financial", description: "Tax rate (20%)" },
    { id: 4, key: "defaultLanguage", value: "en", category: "general", description: "Default language" },
  ];
  
  private shifts: Shift[] = [];
  private auditLogs: AuditLog[] = [];
  private offlineQueue: OfflineQueueItem[] = [];
  
  private nextId = {
    roles: 5,
    users: 3,
    branches: 2,
    terminals: 2,
    tables: 5,
    menuCategories: 5,
    menuItems: 5,
    modifiers: 4,
    orders: 1,
    orderItems: 1,
    payments: 1,
    paymentTypes: 4,
    printers: 1,
    settings: 5,
    shifts: 1,
    auditLogs: 1,
    offlineQueue: 1,
  };

  // Roles
  async getRoles(): Promise<Role[]> {
    return this.roles;
  }

  async getRole(id: number): Promise<Role | null> {
    return this.roles.find(r => r.id === id) || null;
  }

  async createRole(role: InsertRole): Promise<Role> {
    const newRole: Role = { id: this.nextId.roles++, ...role };
    this.roles.push(newRole);
    return newRole;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find(u => u.username === username) || null;
  }

  async getUserByPin(pin: string): Promise<User | null> {
    return this.users.find(u => u.pin === pin) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { ...user, id: this.nextId.users++, createdAt: new Date() };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  // Branches
  async getBranches(): Promise<Branch[]> {
    return this.branches;
  }

  async getBranch(id: number): Promise<Branch | null> {
    return this.branches.find(b => b.id === id) || null;
  }

  async createBranch(branch: InsertBranch): Promise<Branch> {
    const newBranch: Branch = { id: this.nextId.branches++, ...branch };
    this.branches.push(newBranch);
    return newBranch;
  }

  async updateBranch(id: number, updates: Partial<InsertBranch>): Promise<Branch | null> {
    const index = this.branches.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.branches[index] = { ...this.branches[index], ...updates };
    return this.branches[index];
  }

  // Terminals
  async getTerminals(): Promise<Terminal[]> {
    return this.terminals;
  }

  async getTerminal(id: number): Promise<Terminal | null> {
    return this.terminals.find(t => t.id === id) || null;
  }

  async getTerminalByCode(code: string): Promise<Terminal | null> {
    return this.terminals.find(t => t.code === code) || null;
  }

  async createTerminal(terminal: InsertTerminal): Promise<Terminal> {
    const newTerminal: Terminal = { id: this.nextId.terminals++, ...terminal };
    this.terminals.push(newTerminal);
    return newTerminal;
  }

  async updateTerminal(id: number, updates: Partial<InsertTerminal>): Promise<Terminal | null> {
    const index = this.terminals.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.terminals[index] = { ...this.terminals[index], ...updates };
    return this.terminals[index];
  }

  // Tables
  async getTables(branchId?: number): Promise<Table[]> {
    if (branchId) {
      return this.tables.filter(t => t.branchId === branchId);
    }
    return this.tables;
  }

  async getTable(id: number): Promise<Table | null> {
    return this.tables.find(t => t.id === id) || null;
  }

  async createTable(table: InsertTable): Promise<Table> {
    const newTable: Table = { id: this.nextId.tables++, ...table };
    this.tables.push(newTable);
    return newTable;
  }

  async updateTable(id: number, updates: Partial<InsertTable>): Promise<Table | null> {
    const index = this.tables.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.tables[index] = { ...this.tables[index], ...updates };
    return this.tables[index];
  }

  // Menu Categories
  async getMenuCategories(): Promise<MenuCategory[]> {
    return this.menuCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getMenuCategory(id: number): Promise<MenuCategory | null> {
    return this.menuCategories.find(c => c.id === id) || null;
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const newCategory: MenuCategory = { id: this.nextId.menuCategories++, ...category };
    this.menuCategories.push(newCategory);
    return newCategory;
  }

  async updateMenuCategory(id: number, updates: Partial<InsertMenuCategory>): Promise<MenuCategory | null> {
    const index = this.menuCategories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.menuCategories[index] = { ...this.menuCategories[index], ...updates };
    return this.menuCategories[index];
  }

  // Menu Items
  async getMenuItems(categoryId?: number): Promise<MenuItem[]> {
    if (categoryId) {
      return this.menuItems.filter(i => i.categoryId === categoryId);
    }
    return this.menuItems.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getMenuItem(id: number): Promise<MenuItem | null> {
    return this.menuItems.find(i => i.id === id) || null;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const newItem: MenuItem = { ...item, id: this.nextId.menuItems++ };
    this.menuItems.push(newItem);
    return newItem;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | null> {
    const index = this.menuItems.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.menuItems[index] = { ...this.menuItems[index], ...updates };
    return this.menuItems[index];
  }

  // Modifiers
  async getModifiers(menuItemId?: number): Promise<Modifier[]> {
    if (menuItemId) {
      return this.modifiers.filter(m => m.menuItemId === menuItemId);
    }
    return this.modifiers;
  }

  async getModifier(id: number): Promise<Modifier | null> {
    return this.modifiers.find(m => m.id === id) || null;
  }

  async createModifier(modifier: InsertModifier): Promise<Modifier> {
    const newModifier: Modifier = { id: this.nextId.modifiers++, ...modifier };
    this.modifiers.push(newModifier);
    return newModifier;
  }

  // Orders
  async getOrders(filters?: { branchId?: number; status?: string; date?: Date }): Promise<Order[]> {
    let filtered = [...this.orders];
    if (filters?.branchId) {
      filtered = filtered.filter(o => o.branchId === filters.branchId);
    }
    if (filters?.status) {
      filtered = filtered.filter(o => o.status === filters.status);
    }
    if (filters?.date) {
      const date = new Date(filters.date);
      filtered = filtered.filter(o => o.createdAt.toDateString() === date.toDateString());
    }
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: number): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  async getOrdersByTable(tableId: number): Promise<Order[]> {
    return this.orders.filter(o => o.tableId === tableId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.nextId.orders++,
      orderNumber: `ORD${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | null> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    this.orders[index] = { ...this.orders[index], ...updates, updatedAt: new Date() };
    return this.orders[index];
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.filter(i => i.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const newItem: OrderItem = { ...item, id: this.nextId.orderItems++ };
    this.orderItems.push(newItem);
    return newItem;
  }

  async updateOrderItem(id: number, updates: Partial<InsertOrderItem>): Promise<OrderItem | null> {
    const index = this.orderItems.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.orderItems[index] = { ...this.orderItems[index], ...updates };
    return this.orderItems[index];
  }

  // Payments
  async getPayments(orderId?: number): Promise<Payment[]> {
    if (orderId) {
      return this.payments.filter(p => p.orderId === orderId);
    }
    return this.payments;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const newPayment: Payment = { ...payment, id: this.nextId.payments++, createdAt: new Date() };
    this.payments.push(newPayment);
    return newPayment;
  }

  // Payment Types
  async getPaymentTypes(): Promise<PaymentType[]> {
    return this.paymentTypes.filter(pt => pt.active);
  }

  async createPaymentType(type: InsertPaymentType): Promise<PaymentType> {
    const newType: PaymentType = { ...type, id: this.nextId.paymentTypes++ };
    this.paymentTypes.push(newType);
    return newType;
  }

  // Printers
  async getPrinters(terminalId?: number): Promise<Printer[]> {
    if (terminalId) {
      return this.printers.filter(p => p.terminalId === terminalId);
    }
    return this.printers;
  }

  async getPrinter(id: number): Promise<Printer | null> {
    return this.printers.find(p => p.id === id) || null;
  }

  async createPrinter(printer: InsertPrinter): Promise<Printer> {
    const newPrinter: Printer = { ...printer, id: this.nextId.printers++ };
    this.printers.push(newPrinter);
    return newPrinter;
  }

  async updatePrinter(id: number, updates: Partial<InsertPrinter>): Promise<Printer | null> {
    const index = this.printers.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.printers[index] = { ...this.printers[index], ...updates };
    return this.printers[index];
  }

  // Settings
  async getSettings(category?: string): Promise<Setting[]> {
    if (category) {
      return this.settings.filter(s => s.category === category);
    }
    return this.settings;
  }

  async getSetting(key: string): Promise<Setting | null> {
    return this.settings.find(s => s.key === key) || null;
  }

  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const index = this.settings.findIndex(s => s.key === setting.key);
    if (index !== -1) {
      this.settings[index] = { ...this.settings[index], ...setting };
      return this.settings[index];
    }
    const newSetting: Setting = { ...setting, id: this.nextId.settings++ };
    this.settings.push(newSetting);
    return newSetting;
  }

  // Shifts
  async getShifts(filters?: { userId?: number; status?: string }): Promise<Shift[]> {
    let filtered = [...this.shifts];
    if (filters?.userId) {
      filtered = filtered.filter(s => s.userId === filters.userId);
    }
    if (filters?.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    return filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async getCurrentShift(userId: number): Promise<Shift | null> {
    return this.shifts.find(s => s.userId === userId && s.status === "open") || null;
  }

  async createShift(shift: InsertShift): Promise<Shift> {
    const newShift: Shift = { ...shift, id: this.nextId.shifts++, startTime: new Date() };
    this.shifts.push(newShift);
    return newShift;
  }

  async updateShift(id: number, updates: Partial<InsertShift>): Promise<Shift | null> {
    const index = this.shifts.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.shifts[index] = { ...this.shifts[index], ...updates };
    return this.shifts[index];
  }

  // Audit Logs
  async getAuditLogs(filters?: { userId?: number; entityType?: string }): Promise<AuditLog[]> {
    let filtered = [...this.auditLogs];
    if (filters?.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }
    if (filters?.entityType) {
      filtered = filtered.filter(l => l.entityType === filters.entityType);
    }
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const newLog: AuditLog = { ...log, id: this.nextId.auditLogs++, createdAt: new Date() };
    this.auditLogs.push(newLog);
    return newLog;
  }

  // Offline Queue
  async getOfflineQueue(terminalId: number): Promise<OfflineQueueItem[]> {
    return this.offlineQueue.filter(q => q.terminalId === terminalId && q.status === "pending");
  }

  async createOfflineQueueItem(item: InsertOfflineQueueItem): Promise<OfflineQueueItem> {
    const newItem: OfflineQueueItem = { ...item, id: this.nextId.offlineQueue++, createdAt: new Date(), processedAt: null };
    this.offlineQueue.push(newItem);
    return newItem;
  }

  async updateOfflineQueueItem(id: number, updates: Partial<InsertOfflineQueueItem>): Promise<OfflineQueueItem | null> {
    const index = this.offlineQueue.findIndex(q => q.id === id);
    if (index === -1) return null;
    this.offlineQueue[index] = { ...this.offlineQueue[index], ...updates };
    return this.offlineQueue[index];
  }
}

export const storage = new MemStorage();
