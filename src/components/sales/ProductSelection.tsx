import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useSalesStore } from '../../store/salesStore';

export default function ProductSelection() {
  const { products } = useInventoryStore();
  const { addToCart } = useSalesStore();
  const [search, setSearch] = React.useState('');

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (productId: string, name: string, price: number) => {
    addToCart({
      productId,
      name,
      quantity: 1,
      price,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={() => handleAddToCart(product.id, product.name, product.price)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${
                product.stock === 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}