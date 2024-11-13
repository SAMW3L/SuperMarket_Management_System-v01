export interface User {
  id: string;
  username: string;
  role: 'admin' | 'employee';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  expiryDate: string;
  category: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  salary: number;
  department: string;
  totalTransactions?: number;
  totalRevenue?: number;
  averageTransaction?: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  employeeId: string;
  employeeName: string;
  timestamp: string;
  paymentMethod: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Settings {
  store: {
    name: string;
    address: string;
    phone: string;
    taxId: string;
  };
  notifications: {
    lowStockAlerts: boolean;
    salesReports: boolean;
    employeeUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    passwordRequirements: 'strong' | 'medium' | 'basic';
    sessionTimeout: '15m' | '30m' | '1h' | '4h';
  };
  receipt: {
    showLogo: boolean;
    footerMessage: string;
    printOrderId: boolean;
    logo: string | null;
  };
  paymentMethods: PaymentMethod[];
}