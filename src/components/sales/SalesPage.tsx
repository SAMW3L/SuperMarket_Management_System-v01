import React from 'react';
import { CreditCard } from 'lucide-react';
import ProductSelection from './ProductSelection';
import ShoppingCart from './ShoppingCart';
import PaymentModal from './PaymentModal';
import SalesHistory from './SalesHistory';
import { useSalesStore } from '../../store/salesStore';

export default function SalesPage() {
  const { cart } = useSalesStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
        {cart.length > 0 && (
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed to Payment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductSelection />
        </div>
        <div className="space-y-6">
          <ShoppingCart />
          <SalesHistory />
        </div>
      </div>

      {isPaymentModalOpen && (
        <PaymentModal onClose={() => setIsPaymentModalOpen(false)} />
      )}
    </div>
  );
}