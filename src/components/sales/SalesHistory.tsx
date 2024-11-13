import React from 'react';
import { useSalesStore } from '../../store/salesStore';
import { useInventoryStore } from '../../store/inventoryStore';

export default function SalesHistory() {
  const { sales } = useSalesStore();
  const { products } = useInventoryStore();

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {sales.map((sale) => (
          <div key={sale.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Order #{sale.id}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(sale.timestamp).toLocaleString()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${sale.total.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              {sale.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between text-sm text-gray-500"
                >
                  <span>{getProductName(item.productId)}</span>
                  <span>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sales.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No sales history available
          </div>
        )}
      </div>
    </div>
  );
}