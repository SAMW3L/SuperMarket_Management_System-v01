import React, { useState } from 'react';
import { useSalesStore } from '../../store/salesStore';
import { useInventoryStore } from '../../store/inventoryStore';

export default function SalesHistory() {
  const { sales } = useSalesStore();
  const { products } = useInventoryStore();
  const [isVisible, setIsVisible] = useState(false); // State to toggle visibility of sales history
  const [selectedSale, setSelectedSale] = useState<any>(null); // State to store selected sale for printing

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  // Function to open modal with selected sale for printing
  const openReceiptModal = (sale: any) => {
    setSelectedSale(sale);
  };

  // Function to print the modal content
  const printReceipt = () => {
    const printContent = document.getElementById('receipt-content')!;
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write('<html><head><title>Sale Receipt</title>');
    printWindow.document.write('<style>body{font-family: Arial, sans-serif;}</style></head><body>');
    printWindow.document.write(printContent.innerHTML); // Get the receipt HTML from the modal
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print(); // Open print dialog
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
        {/* Button to toggle visibility */}
        <button
          onClick={toggleVisibility}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {isVisible ? 'Hide Sales History' : 'Show Sales History'}
        </button>
      </div>

      {/* Conditionally render sales data */}
      {isVisible && (
        <div className="divide-y divide-gray-200 mt-4">
          {sales.length > 0 ? (
            sales.map((sale) => (
              <div key={sale.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Sale #:{sale.id}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(sale.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Tsh.{sale.total.toFixed(2)}
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
                        {item.quantity} × Tsh.{item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Print button for each sale */}
                <button
                  onClick={() => openReceiptModal(sale)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Print
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No sales history available
            </div>
          )}
        </div>
      )}

      {/* Modal for Printing */}
      {selectedSale && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedSale(null)} // Close the modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h2 className="text-lg font-medium text-gray-900">Sale Receipt</h2>
            <div id="receipt-content" className="mt-4">
              <p><strong>Sale #:</strong> {selectedSale.id}</p>
              <p><strong>Date:</strong> {new Date(selectedSale.timestamp).toLocaleString()}</p>
              <table className="table-auto w-full mt-2">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Product</th>
                    <th className="border px-2 py-1">Quantity</th>
                    <th className="border px-2 py-1">Price</th>
                    <th className="border px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item: any) => (
                    <tr key={item.productId}>
                      <td className="border px-2 py-1">{getProductName(item.productId)}</td>
                      <td className="border px-2 py-1">{item.quantity}</td>
                      <td className="border px-2 py-1">Tsh.{item.price.toFixed(2)}</td>
                      <td className="border px-2 py-1">Tsh.{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4"><strong>Total: </strong>Tsh.{selectedSale.total.toFixed(2)}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedSale(null)} // Close the modal
                className="px-4 py-2 bg-gray-300 text-white rounded-lg"
              >
                Close
              </button>
              <button
                onClick={printReceipt} // Print the receipt
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
