import { create } from 'zustand';
import { Settings } from '../types';

interface SettingsState extends Settings {
  updateStoreInfo: (info: Partial<Settings['store']>) => void;
  updateNotifications: (settings: Partial<Settings['notifications']>) => void;
  updateSecurity: (settings: Partial<Settings['security']>) => void;
  updateReceipt: (settings: Partial<Settings['receipt']>) => void;
  updatePaymentMethods: (methods: Settings['paymentMethods']) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  store: {
    name: 'SuperMarket Plus',
    address: '123 Market Street',
    phone: '(555) 123-4567',
    taxId: '12-3456789',
  },
  notifications: {
    lowStockAlerts: true,
    salesReports: true,
    employeeUpdates: false,
  },
  security: {
    twoFactorAuth: false,
    passwordRequirements: 'strong',
    sessionTimeout: '30m',
  },
  receipt: {
    showLogo: true,
    footerMessage: 'Thank you for shopping with us!',
    printOrderId: true,
    logo: null,
  },
  paymentMethods: [
    { id: 'cash', name: 'Cash', enabled: true },
    { id: 'credit', name: 'Credit Card', enabled: true },
    { id: 'debit', name: 'Debit Card', enabled: true },
    { id: 'mobile', name: 'Mobile Payment', enabled: false },
    { id: 'crypto', name: 'Cryptocurrency', enabled: false },
  ],
  updateStoreInfo: (info) =>
    set((state) => ({
      store: { ...state.store, ...info },
    })),
  updateNotifications: (settings) =>
    set((state) => ({
      notifications: { ...state.notifications, ...settings },
    })),
  updateSecurity: (settings) =>
    set((state) => ({
      security: { ...state.security, ...settings },
    })),
  updateReceipt: (settings) =>
    set((state) => ({
      receipt: { ...state.receipt, ...settings },
    })),
  updatePaymentMethods: (methods) =>
    set({ paymentMethods: methods }),
}));