import React, { useRef, useState } from 'react';
import {
  Store,
  Bell,
  Shield,
  Printer,
  Mail,
  CreditCard,
  Users,
  Globe,
  Upload,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

// const SUPPORTED_LANGUAGES = [
//   { code: 'en', name: 'English' },
//   { code: 'es', name: 'Spanish' },
//   { code: 'fr', name: 'French' },
//   { code: 'de', name: 'German' },
//   { code: 'zh', name: 'Chinese' },
// ];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', enabled: true },
  { id: 'credit', name: 'Credit Card', enabled: true },
  { id: 'debit', name: 'Debit Card', enabled: true },
  { id: 'mobile', name: 'Mobile Payment', enabled: false },
  { id: 'crypto', name: 'Cryptocurrency', enabled: false },
];

const USER_PERMISSIONS = [
  { role: 'admin', permissions: ['all'] },
  { role: 'manager', permissions: ['view', 'create', 'edit'] },
  { role: 'cashier', permissions: ['view', 'create'] },
  { role: 'stock', permissions: ['view', 'edit-inventory'] },
];

export default function SettingsPage() {
  const {
    store,
    notifications,
    security,
    receipt,
    updateStoreInfo,
    updateNotifications,
    updateSecurity,
    updateReceipt,
  } = useSettingsStore();

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);
  const [permissions, setPermissions] = useState(USER_PERMISSIONS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        updateReceipt({ logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // In a real application,save all settings to the backend
    alert('Settings saved successfully!');
  };

  const settingsSections = [
    {
      title: 'SuperMarket Information',
      icon: Store,
      settings: [
        {
          label: 'Store Name',
          value: store.name,
          onChange: (value: string) => updateStoreInfo({ name: value }),
        },
        {
          label: 'Address',
          value: store.address,
          onChange: (value: string) => updateStoreInfo({ address: value }),
        },
        {
          label: 'Phone',
          value: store.phone,
          onChange: (value: string) => updateStoreInfo({ phone: value }),
        },
        {
          label: 'Tax ID',
          value: store.taxId,
          onChange: (value: string) => updateStoreInfo({ taxId: value }),
        },
      ],
    },

    //RECEIPT SETTINGS
    {
      title: 'Receipt Settings',
      icon: Printer,
      settings: [
        {
          label: 'Store Logo on Receipt',
          type: 'toggle',
          value: receipt.showLogo,
          onChange: (value: boolean) => updateReceipt({ showLogo: value }),
        },
        {
          label: 'Receipt Footer Message',
          value: receipt.footerMessage,
          onChange: (value: string) =>
            updateReceipt({ footerMessage: value }),
        },
        {
          label: 'Print Order ID',
          type: 'toggle',
          value: receipt.printOrderId,
          onChange: (value: boolean) =>
            updateReceipt({ printOrderId: value }),
        },
      ],
    },

    // ... other existing sections ...
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Existing Settings Sections */}
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <section.icon className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {section.settings.map((setting) => (
                <div
                  key={setting.label}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                  {setting.type === 'toggle' ? (
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        setting.value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          setting.value ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  ) : setting.type === 'select' ? (
                    <select
                      value={setting.value}
                      onChange={(e) => setting.onChange(e.target.value)}
                      className="mt-1 block w-48 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      {setting.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={setting.value}
                      onChange={(e) => setting.onChange(e.target.value)}
                      className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logo Upload Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Store Logo</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center">
              {logo ? (
                <div className="relative">
                  <img
                    src={logo}
                    alt="Store Logo"
                    className="h-32 w-32 object-contain"
                  />
                  <button
                    onClick={() => setLogo(null)}
                    className="absolute top-0 right-0 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Language Settings
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Language & Region</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">System Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div> */}

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{method.name}</span>
                  <button
                    onClick={() => {
                      setPaymentMethods(methods =>
                        methods.map(m =>
                          m.id === method.id ? { ...m, enabled: !m.enabled } : m
                        )
                      );
                    }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      method.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        method.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Receipt settings */}


        {/* User Permissions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">User Permissions</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {permissions.map((role) => (
                <div key={role.role} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 capitalize">{role.role}</h3>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}