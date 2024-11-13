import React from 'react';
import { X, CreditCard, Wallet, DollarSign, Printer } from 'lucide-react';
import { useSalesStore } from '../../store/salesStore';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Sale } from '../../types';
import { generateReceipt } from '../../utils/receiptGenerator';

interface PaymentModalProps {
  onClose: () => void;
}

export default function PaymentModal({ onClose }: PaymentModalProps) {
  const { cart, clearCart, addSale } = useSalesStore();
  const { user } = useAuthStore();
  const { store, receipt: receiptSettings, paymentMethods } = useSettingsStore();
  const [selectedMethod, setSelectedMethod] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showPrintOption, setShowPrintOption] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<Sale | null>(null);

  const enabledPaymentMethods = paymentMethods.filter(method => method.enabled);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!selectedMethod || !user) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart.map(({ productId, quantity, price, name }) => ({
        productId,
        quantity,
        price,
        name,
      })),
      total,
      employeeId: user.id,
      employeeName: user.name,
      timestamp: new Date().toISOString(),
      paymentMethod: selectedMethod,
    };

    addSale(sale);
    setCurrentSale(sale);
    setShowPrintOption(true);
    setIsProcessing(false);
  };

  const handlePrintReceipt = () => {
    if (!currentSale) return;
    const receiptContent = generateReceipt(currentSale, store, receiptSettings);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleFinish = () => {
    clearCart();
    onClose();
  };

  if (showPrintOption) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-1">Transaction ID: {currentSale?.id}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePrintReceipt}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Printer className="h-5 w-5" />
              Print Receipt
            </button>

            <button
              onClick={handleFinish}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-lg font-bold text-gray-900">
            Total: ${total.toFixed(2)}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {enabledPaymentMethods.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMethod(id)}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                    selectedMethod === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {id === 'cash' && <DollarSign className="h-6 w-6 text-gray-600" />}
                  {id === 'credit' && <CreditCard className="h-6 w-6 text-gray-600" />}
                  {id === 'debit' && <CreditCard className="h-6 w-6 text-gray-600" />}
                  {(id === 'mobile' || id === 'crypto') && <Wallet className="h-6 w-6 text-gray-600" />}
                  <span className="text-sm font-medium text-gray-900">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}