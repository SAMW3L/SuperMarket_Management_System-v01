import React from 'react';
import { Plus } from 'lucide-react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ExcelUpload from './ExcelUpload';
import { Product } from '../../types';
import { useInventoryStore } from '../../store/inventoryStore';

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, bulkAddProducts } = useInventoryStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | undefined>();

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    addProduct(product);
    setIsFormOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, updatedProduct);
      setIsFormOpen(false);
      setSelectedProduct(undefined);
    }
  };

  const handleExcelUpload = (products: Omit<Product, 'id'>[]) => {
    bulkAddProducts(products);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={deleteProduct}
          />
        </div>
        <div className="lg:col-span-1">
          <ExcelUpload onUpload={handleExcelUpload} />
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(undefined);
          }}
        />
      )}
    </div>
  );
}