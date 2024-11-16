import React from 'react';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Product } from '../../types';

interface ExcelUploadProps {
  onUpload: (products: Omit<Product, 'id'>[]) => void;
}

export default function ExcelUpload({ onUpload }: ExcelUploadProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];

        const products = data.map(row => ({
          name: row.name || '',
          category: row.category || '',
          price: parseFloat(row.price) || 0,
          stock: parseInt(row.stock) || 0,
          expiryDate: row.expiryDate || new Date().toISOString(),
        }));

        onUpload(products);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the format and try again.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Example Product',
        category: 'Groceries',
        price: '1000',
        stock: '50',
        expiryDate: '2024-12-31'
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'inventory-template.xlsx');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Import Products</h3>
        <button
          onClick={downloadTemplate}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <Download className="h-4 w-4 mr-1" />
          Download Template
        </button>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Drag and drop your Excel file here, or click to select
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Excel File Requirements:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>File must be in .xlsx or .xls format</li>
          <li>Required columns: name, category, price, stock, expiryDate</li>
          <li>name: Product name (text)</li>
          <li>category: Product category (text)</li>
          <li>price: Product price (number)</li>
          <li>stock: Available quantity (number)</li>
          <li>expiryDate: Expiry date (YYYY-MM-DD format)</li>
        </ul>
      </div>
    </div>
  );
}