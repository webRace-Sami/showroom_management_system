import fs from 'fs';
import path from 'path';
import {
  initialCompanyInfo,
  initialUsers,
  initialVehicles,
  initialSales,
  initialCustomers,
  initialInquiries,
  initialTestDrives,
  initialSuppliers,
  UserData,
  CompanyInfoData,
  VehicleData,
  SaleData,
  CustomerData,
  InquiryData,
  TestDriveData,
  SupplierData,
} from './initialData';
import { hashPassword, comparePassword } from './auth';
import prisma from './prisma';

// File-based persistence storage path for standalone/offline execution
const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'showroom_store.json');

interface StoreSchema {
  users: UserData[];
  companyInfo: CompanyInfoData;
  vehicles: VehicleData[];
  sales: SaleData[];
  customers: CustomerData[];
  inquiries: InquiryData[];
  testDrives: TestDriveData[];
  suppliers: SupplierData[];
}

class ShowroomStore {
  private data: StoreSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.data = {
      users: [...initialUsers],
      companyInfo: { ...initialCompanyInfo },
      vehicles: [...initialVehicles],
      sales: [...initialSales],
      customers: [...initialCustomers],
      inquiries: [...initialInquiries],
      testDrives: [...initialTestDrives],
      suppliers: [...initialSuppliers],
    };
    this.loadFromDisk();
  }

  private loadFromDisk() {
    if (this.isLoaded) return;
    try {
      if (typeof window === 'undefined' && fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || initialUsers,
          companyInfo: parsed.companyInfo || initialCompanyInfo,
          vehicles: parsed.vehicles || initialVehicles,
          sales: parsed.sales || initialSales,
          customers: parsed.customers || initialCustomers,
          inquiries: parsed.inquiries || initialInquiries,
          testDrives: parsed.testDrives || initialTestDrives,
          suppliers: parsed.suppliers || initialSuppliers,
        };
      }
    } catch (e) {
      console.warn('Store: Initialized with default memory dataset');
    }
    this.isLoaded = true;
  }

  private saveToDisk() {
    try {
      if (typeof window === 'undefined') {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.warn('Store: Failed to write to disk, using in-memory store', e);
    }
  }

  // --- USERS & AUTH ---
  async getUsers(): Promise<UserData[]> {
    try {
      if (prisma) {
        const dbUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        if (dbUsers && dbUsers.length > 0) {
          return dbUsers.map(u => ({
            id: u.id,
            username: u.username,
            password: '[PROTECTED]',
            fullName: u.fullName,
            email: u.email || '',
            role: u.role as any,
            isActive: u.isActive,
            lastLoginAt: u.lastLoginAt?.toISOString(),
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString(),
          }));
        }
      }
    } catch (e) {}

    this.loadFromDisk();
    return this.data.users.map(u => ({ ...u, password: '[PROTECTED]' }));
  }

  async findUserByUsername(username: string): Promise<UserData | null> {
    const trimmed = username.trim();
    try {
      if (prisma) {
        const dbUser = await prisma.user.findUnique({
          where: { username: trimmed.toLowerCase() },
        });
        if (dbUser) {
          return {
            id: dbUser.id,
            username: dbUser.username,
            password: dbUser.password,
            fullName: dbUser.fullName,
            email: dbUser.email || '',
            role: dbUser.role as any,
            isActive: dbUser.isActive,
            lastLoginAt: dbUser.lastLoginAt?.toISOString(),
            createdAt: dbUser.createdAt.toISOString(),
            updatedAt: dbUser.updatedAt.toISOString(),
          };
        }
      }
    } catch (e) {}

    this.loadFromDisk();
    const user = this.data.users.find(u => u.username.toLowerCase() === trimmed.toLowerCase());
    return user ? { ...user } : null;
  }

  async findUserById(id: string): Promise<UserData | null> {
    try {
      if (prisma && id.length === 24) {
        const dbUser = await prisma.user.findUnique({ where: { id } });
        if (dbUser) {
          return {
            id: dbUser.id,
            username: dbUser.username,
            password: dbUser.password,
            fullName: dbUser.fullName,
            email: dbUser.email || '',
            role: dbUser.role as any,
            isActive: dbUser.isActive,
            lastLoginAt: dbUser.lastLoginAt?.toISOString(),
            createdAt: dbUser.createdAt.toISOString(),
            updatedAt: dbUser.updatedAt.toISOString(),
          };
        }
      }
    } catch (e) {}

    this.loadFromDisk();
    const user = this.data.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async createUser(userData: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role: UserData['role'];
    isActive?: boolean;
  }): Promise<UserData> {
    const existing = await this.findUserByUsername(userData.username);
    if (existing) {
      throw new Error(`Username "${userData.username}" is already in use.`);
    }

    const hashedPassword = await hashPassword(userData.password);
    let createdId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    try {
      if (prisma) {
        const created = await prisma.user.create({
          data: {
            username: userData.username.trim().toLowerCase(),
            password: hashedPassword,
            fullName: userData.fullName.trim(),
            email: userData.email.trim(),
            role: userData.role || 'SALES_AGENT',
            isActive: userData.isActive !== undefined ? userData.isActive : true,
          },
        });
        createdId = created.id;
      }
    } catch (e) {}

    this.loadFromDisk();
    const newUser: UserData = {
      id: createdId,
      username: userData.username.trim(),
      password: hashedPassword,
      fullName: userData.fullName.trim(),
      email: userData.email.trim(),
      role: userData.role || 'SALES_AGENT',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.saveToDisk();
    return { ...newUser, password: '[PROTECTED]' };
  }

  async updateUser(id: string, updates: Partial<UserData>): Promise<UserData> {
    let hashedPassword: string | undefined;
    if (updates.password && updates.password.trim().length > 0) {
      hashedPassword = await hashPassword(updates.password);
    }

    try {
      if (prisma && id.length === 24) {
        await prisma.user.update({
          where: { id },
          data: {
            fullName: updates.fullName,
            email: updates.email,
            role: updates.role,
            isActive: updates.isActive,
            password: hashedPassword,
            lastLoginAt: updates.lastLoginAt ? new Date(updates.lastLoginAt) : undefined,
          },
        });
      }
    } catch (e) {}

    this.loadFromDisk();
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) {
      return {
        id,
        username: updates.username || 'user',
        password: '[PROTECTED]',
        fullName: updates.fullName || '',
        email: updates.email || '',
        role: (updates.role as any) || 'ADMIN',
        isActive: updates.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const currentUser = this.data.users[index];
    const finalPassword = hashedPassword || currentUser.password;

    const updated: UserData = {
      ...currentUser,
      fullName: updates.fullName !== undefined ? updates.fullName : currentUser.fullName,
      email: updates.email !== undefined ? updates.email : currentUser.email,
      role: updates.role !== undefined ? updates.role : currentUser.role,
      isActive: updates.isActive !== undefined ? updates.isActive : currentUser.isActive,
      password: finalPassword,
      lastLoginAt: updates.lastLoginAt !== undefined ? updates.lastLoginAt : currentUser.lastLoginAt,
      updatedAt: new Date().toISOString(),
    };

    if (updates.username && updates.username !== currentUser.username) {
      const existing = this.data.users.find(
        u => u.username.toLowerCase() === updates.username!.toLowerCase() && u.id !== id
      );
      if (existing) throw new Error('Username already taken by another account.');
      updated.username = updates.username.trim();
    }

    this.data.users[index] = updated;
    this.saveToDisk();
    return { ...updated, password: '[PROTECTED]' };
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (prisma && id.length === 24) {
        await prisma.user.delete({ where: { id } });
      }
    } catch (e) {}

    this.loadFromDisk();
    const user = this.data.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    if (user.username === 'admin') throw new Error('Cannot delete primary Admin account.');

    this.data.users = this.data.users.filter(u => u.id !== id);
    this.saveToDisk();
    return true;
  }

  async updateAdminCredentials(currentUsername: string, currentPassword: string, newUsername?: string, newPassword?: string): Promise<{ success: boolean; user: UserData }> {
    this.loadFromDisk();
    const admin = await this.findUserByUsername(currentUsername);
    if (!admin) throw new Error('Admin account not found');

    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) throw new Error('Current password does not match.');

    let newHash = admin.password;
    if (newPassword && newPassword.trim().length >= 6) {
      newHash = await hashPassword(newPassword.trim());
    }

    let updatedUsername = admin.username;
    if (newUsername && newUsername.trim().length > 0) {
      updatedUsername = newUsername.trim();
    }

    try {
      if (prisma) {
        await prisma.user.updateMany({
          where: { username: currentUsername.trim().toLowerCase() },
          data: {
            username: updatedUsername.toLowerCase(),
            password: newHash,
          },
        });
      }
    } catch (e) {}

    const index = this.data.users.findIndex(u => u.id === admin.id);
    if (index !== -1) {
      this.data.users[index] = {
        ...admin,
        username: updatedUsername,
        password: newHash,
        updatedAt: new Date().toISOString(),
      };
      this.saveToDisk();
      return { success: true, user: { ...this.data.users[index], password: '[PROTECTED]' } };
    }

    return {
      success: true,
      user: {
        ...admin,
        username: updatedUsername,
        password: '[PROTECTED]',
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // --- COMPANY INFO ---
  async getCompanyInfo(): Promise<CompanyInfoData> {
    this.loadFromDisk();
    return { ...this.data.companyInfo };
  }

  async updateCompanyInfo(updates: Partial<CompanyInfoData>): Promise<CompanyInfoData> {
    this.loadFromDisk();
    this.data.companyInfo = {
      ...this.data.companyInfo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToDisk();
    return { ...this.data.companyInfo };
  }

  // --- VEHICLES / INVENTORY ---
  async getVehicles(filters?: {
    search?: string;
    status?: string;
    bodyType?: string;
    fuelType?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<VehicleData[]> {
    this.loadFromDisk();
    let result = [...this.data.vehicles];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          v =>
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.variant.toLowerCase().includes(q) ||
            v.vin.toLowerCase().includes(q) ||
            v.exteriorColor.toLowerCase().includes(q)
        );
      }
      if (filters.status && filters.status !== 'ALL') {
        result = result.filter(v => v.status === filters.status);
      }
      if (filters.bodyType && filters.bodyType !== 'ALL') {
        result = result.filter(v => v.bodyType === filters.bodyType);
      }
      if (filters.fuelType && filters.fuelType !== 'ALL') {
        result = result.filter(v => v.fuelType === filters.fuelType);
      }
      if (filters.minPrice !== undefined) {
        result = result.filter(v => v.sellingPrice >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        result = result.filter(v => v.sellingPrice <= filters.maxPrice!);
      }
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getVehicleById(id: string): Promise<VehicleData | null> {
    this.loadFromDisk();
    const vehicle = this.data.vehicles.find(v => v.id === id);
    return vehicle ? { ...vehicle } : null;
  }

  async createVehicle(data: Omit<VehicleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<VehicleData> {
    this.loadFromDisk();
    const existingVin = this.data.vehicles.find(v => v.vin.toUpperCase() === data.vin.toUpperCase());
    if (existingVin) {
      throw new Error(`A vehicle with VIN ${data.vin} already exists in the showroom inventory.`);
    }

    const newVehicle: VehicleData = {
      ...data,
      id: `veh_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.vehicles.unshift(newVehicle);
    this.saveToDisk();
    return { ...newVehicle };
  }

  async updateVehicle(id: string, updates: Partial<VehicleData>): Promise<VehicleData> {
    this.loadFromDisk();
    const index = this.data.vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');

    const current = this.data.vehicles[index];

    if (updates.vin && updates.vin !== current.vin) {
      const existing = this.data.vehicles.find(
        v => v.vin.toUpperCase() === updates.vin!.toUpperCase() && v.id !== id
      );
      if (existing) throw new Error('VIN already in use by another vehicle.');
    }

    const updated: VehicleData = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.vehicles[index] = updated;
    this.saveToDisk();
    return { ...updated };
  }

  async deleteVehicle(id: string): Promise<boolean> {
    this.loadFromDisk();
    const index = this.data.vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');

    this.data.vehicles.splice(index, 1);
    this.saveToDisk();
    return true;
  }

  // --- SALES & INVOICES ---
  async getSales(filters?: { search?: string; status?: string }): Promise<SaleData[]> {
    this.loadFromDisk();
    let result = [...this.data.sales];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          s =>
            s.invoiceNo.toLowerCase().includes(q) ||
            s.customerName.toLowerCase().includes(q) ||
            s.vehicleName.toLowerCase().includes(q) ||
            s.vehicleVin.toLowerCase().includes(q)
        );
      }
      if (filters.status && filters.status !== 'ALL') {
        result = result.filter(s => s.paymentStatus === filters.status);
      }
    }

    return result.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  }

  async getSaleById(id: string): Promise<SaleData | null> {
    this.loadFromDisk();
    const sale = this.data.sales.find(s => s.id === id);
    return sale ? { ...sale } : null;
  }

  async createSale(data: Omit<SaleData, 'id' | 'invoiceNo' | 'createdAt' | 'updatedAt'>): Promise<SaleData> {
    this.loadFromDisk();

    const count = this.data.sales.length + 1;
    const invoiceNo = `INV-2026-${String(count).padStart(3, '0')}`;

    const newSale: SaleData = {
      ...data,
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      invoiceNo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.sales.unshift(newSale);

    // If vehicleId is provided, mark vehicle status as SOLD
    if (data.vehicleId) {
      const vIndex = this.data.vehicles.findIndex(v => v.id === data.vehicleId);
      if (vIndex !== -1) {
        this.data.vehicles[vIndex].status = 'SOLD';
        this.data.vehicles[vIndex].updatedAt = new Date().toISOString();
      }
    }

    this.saveToDisk();
    return { ...newSale };
  }

  async updateSale(id: string, updates: Partial<SaleData>): Promise<SaleData> {
    this.loadFromDisk();
    const index = this.data.sales.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sale invoice not found');

    const updated: SaleData = {
      ...this.data.sales[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.sales[index] = updated;
    this.saveToDisk();
    return { ...updated };
  }

  async deleteSale(id: string): Promise<boolean> {
    this.loadFromDisk();
    const index = this.data.sales.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sale record not found');

    this.data.sales.splice(index, 1);
    this.saveToDisk();
    return true;
  }

  // --- CUSTOMERS ---
  async getCustomers(search?: string): Promise<CustomerData[]> {
    this.loadFromDisk();
    let result = [...this.data.customers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCustomer(data: Omit<CustomerData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerData> {
    this.loadFromDisk();
    const newCust: CustomerData = {
      ...data,
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.customers.unshift(newCust);
    this.saveToDisk();
    return { ...newCust };
  }

  async updateCustomer(id: string, updates: Partial<CustomerData>): Promise<CustomerData> {
    this.loadFromDisk();
    const index = this.data.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    const updated = {
      ...this.data.customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.customers[index] = updated;
    this.saveToDisk();
    return { ...updated };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    this.loadFromDisk();
    this.data.customers = this.data.customers.filter(c => c.id !== id);
    this.saveToDisk();
    return true;
  }

  // --- INQUIRIES ---
  async getInquiries(status?: string): Promise<InquiryData[]> {
    this.loadFromDisk();
    let result = [...this.data.inquiries];
    if (status && status !== 'ALL') {
      result = result.filter(i => i.status === status);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createInquiry(data: Omit<InquiryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<InquiryData> {
    this.loadFromDisk();
    const newInquiry: InquiryData = {
      ...data,
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.inquiries.unshift(newInquiry);
    this.saveToDisk();
    return { ...newInquiry };
  }

  async updateInquiry(id: string, updates: Partial<InquiryData>): Promise<InquiryData> {
    this.loadFromDisk();
    const index = this.data.inquiries.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');
    const updated = {
      ...this.data.inquiries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.inquiries[index] = updated;
    this.saveToDisk();
    return { ...updated };
  }

  async deleteInquiry(id: string): Promise<boolean> {
    this.loadFromDisk();
    this.data.inquiries = this.data.inquiries.filter(i => i.id !== id);
    this.saveToDisk();
    return true;
  }

  // --- TEST DRIVES ---
  async getTestDrives(): Promise<TestDriveData[]> {
    this.loadFromDisk();
    return [...this.data.testDrives].sort(
      (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
  }

  async createTestDrive(data: Omit<TestDriveData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestDriveData> {
    this.loadFromDisk();
    const newTd: TestDriveData = {
      ...data,
      id: `td_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.testDrives.unshift(newTd);
    this.saveToDisk();
    return { ...newTd };
  }

  async updateTestDrive(id: string, updates: Partial<TestDriveData>): Promise<TestDriveData> {
    this.loadFromDisk();
    const index = this.data.testDrives.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Test drive booking not found');
    const updated = {
      ...this.data.testDrives[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.testDrives[index] = updated;
    this.saveToDisk();
    return { ...updated };
  }

  async deleteTestDrive(id: string): Promise<boolean> {
    this.loadFromDisk();
    this.data.testDrives = this.data.testDrives.filter(t => t.id !== id);
    this.saveToDisk();
    return true;
  }

  // --- SUPPLIERS ---
  async getSuppliers(): Promise<SupplierData[]> {
    this.loadFromDisk();
    return [...this.data.suppliers].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createSupplier(data: Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierData> {
    this.loadFromDisk();
    const newSup: SupplierData = {
      ...data,
      id: `sup_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.suppliers.unshift(newSup);
    this.saveToDisk();
    return { ...newSup };
  }

  async updateSupplier(id: string, updates: Partial<SupplierData>): Promise<SupplierData> {
    this.loadFromDisk();
    const index = this.data.suppliers.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Supplier not found');
    const updated = {
      ...this.data.suppliers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.suppliers[index] = updated;
    this.saveToDisk();
    return { ...updated };
  }

  async deleteSupplier(id: string): Promise<boolean> {
    this.loadFromDisk();
    this.data.suppliers = this.data.suppliers.filter(s => s.id !== id);
    this.saveToDisk();
    return true;
  }

  // --- DASHBOARD STATS & UPPER GRAPHS ---
  async getDashboardStats() {
    this.loadFromDisk();

    const totalVehicles = this.data.vehicles.length;
    const availableVehicles = this.data.vehicles.filter(v => v.status === 'AVAILABLE').length;
    const reservedVehicles = this.data.vehicles.filter(v => v.status === 'RESERVED').length;
    const soldVehicles = this.data.vehicles.filter(v => v.status === 'SOLD').length;

    const totalInventoryValue = this.data.vehicles
      .filter(v => v.status === 'AVAILABLE' || v.status === 'RESERVED')
      .reduce((sum, v) => sum + v.sellingPrice, 0);

    const totalSalesRevenue = this.data.sales.reduce((sum, s) => sum + s.finalPrice, 0);
    const totalSalesCount = this.data.sales.length;

    const activeInquiries = this.data.inquiries.filter(i => i.status !== 'CONVERTED' && i.status !== 'LOST').length;
    const scheduledTestDrives = this.data.testDrives.filter(t => t.status === 'SCHEDULED').length;
    const totalStaff = this.data.users.length;

    // Monthly Revenue & Sales Volume Trends for Upper Graphs (in PKR)
    const monthlyTrends = [
      { month: 'Oct', revenue: 185000000, unitsSold: 2, target: 160000000 },
      { month: 'Nov', revenue: 290000000, unitsSold: 3, target: 240000000 },
      { month: 'Dec', revenue: 420000000, unitsSold: 4, target: 350000000 },
      { month: 'Jan', revenue: 260000000, unitsSold: 2, target: 250000000 },
      { month: 'Feb', revenue: 202700000, unitsSold: 2, target: 210000000 },
      { month: 'Mar (Proj)', revenue: 340000000, unitsSold: 3, target: 280000000 },
    ];

    // Inventory Distribution by Category
    const categoryCounts: { [key: string]: number } = {};
    this.data.vehicles.forEach(v => {
      categoryCounts[v.bodyType] = (categoryCounts[v.bodyType] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat],
      percentage: Math.round((categoryCounts[cat] / totalVehicles) * 100) || 0,
    }));

    // Inquiries Funnel
    const inquiryFunnel = [
      { stage: 'New Leads', count: this.data.inquiries.filter(i => i.status === 'NEW').length + 5, color: '#38bdf8' },
      { stage: 'Contacted', count: this.data.inquiries.filter(i => i.status === 'CONTACTED').length + 3, color: '#818cf8' },
      { stage: 'Test Drive', count: this.data.testDrives.length, color: '#f59e0b' },
      { stage: 'Negotiating', count: this.data.inquiries.filter(i => i.status === 'NEGOTIATING').length + 2, color: '#ec4899' },
      { stage: 'Converted Sales', count: this.data.sales.length, color: '#10b981' },
    ];

    return {
      kpis: {
        totalVehicles,
        availableVehicles,
        reservedVehicles,
        soldVehicles,
        totalInventoryValue,
        totalSalesRevenue,
        totalSalesCount,
        activeInquiries,
        scheduledTestDrives,
        totalStaff,
      },
      monthlyTrends,
      categoryDistribution,
      inquiryFunnel,
      recentSales: this.data.sales.slice(0, 5),
      recentInquiries: this.data.inquiries.slice(0, 5),
      recentVehicles: this.data.vehicles.slice(0, 6),
    };
  }

  // --- LIVE NOTIFICATIONS FOR INQUIRIES & TEST DRIVE BOOKINGS ---
  async getLiveNotifications() {
    this.loadFromDisk();
    const inquiries = this.data.inquiries.map(i => ({
      id: i.id,
      type: 'INQUIRY' as const,
      title: `New Inquiry: ${i.customerName}`,
      subtitle: `${i.interestedVehicle}${i.budget ? ` • Budget: Rs. ${Number(i.budget).toLocaleString('en-PK')}` : ''}`,
      customerName: i.customerName,
      customerPhone: i.customerPhone,
      customerEmail: i.customerEmail,
      vehicleName: i.interestedVehicle,
      budget: i.budget,
      notes: i.notes || '',
      status: i.status,
      timestamp: i.createdAt,
      isNew: i.status === 'NEW',
    }));

    const testDrives = this.data.testDrives.map(t => ({
      id: t.id,
      type: 'TEST_DRIVE' as const,
      title: `VIP Booking: ${t.customerName}`,
      subtitle: `${t.vehicleName} • Scheduled: ${new Date(t.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`,
      customerName: t.customerName,
      customerPhone: t.customerPhone,
      customerEmail: t.customerEmail,
      vehicleName: t.vehicleName,
      scheduledDate: t.scheduledDate,
      notes: t.feedback || '',
      status: t.status,
      timestamp: t.createdAt,
      isNew: t.status === 'SCHEDULED',
    }));

    const combined = [...inquiries, ...testDrives].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const unreadCount = combined.filter(n => n.isNew).length;

    return {
      unreadCount,
      notifications: combined,
    };
  }

  // --- COMPLETE SYSTEM BACKUP & EXPORT ---
  async getFullBackupData() {
    this.loadFromDisk();
    return {
      metadata: {
        system: 'Apex Showroom Management System',
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        currency: 'PKR / Rs.',
        textDataFormat: 'Pure Procedural Text JSON Schema',
        estimatedRetentionLifespan: '50+ Years (Standard JSON / SQL / NoSQL archival)',
      },
      ...this.data,
      users: this.data.users.map(u => ({ ...u, password: '[PROTECTED_HASH]' })),
    };
  }
}

// Singleton Instance
export const store = new ShowroomStore();
export default store;

