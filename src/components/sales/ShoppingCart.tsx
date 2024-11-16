import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useSalesStore } from '../../store/salesStore';

export default function ShoppingCart() {
  const { cart, updateCartItem, removeFromCart } = useSalesStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {cart.map((item) => (
          <div key={item.productId} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">
                Tsh.{item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-gray-600">{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1 text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {cart.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Your cart is empty
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
            Tsh.{total.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}