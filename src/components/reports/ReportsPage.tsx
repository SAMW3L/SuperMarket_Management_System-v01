import React, { useState } from 'react';
import { FileSpreadsheet, FileText, ChevronRight } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useSalesStore } from '../../store/salesStore';
import { useAuthStore } from '../../store/authStore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ReportsPage() {
  const { products } = useInventoryStore();
  const { employees } = useEmployeeStore();
  const { sales } = useSalesStore();
  const { user } = useAuthStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Calculate employee performance based on actual sales data
  const employeePerformance = employees.map(employee => {
    const employeeSales = sales.filter(sale => sale.employeeId === employee.id);
    const totalTransactions = employeeSales.length;
    const totalRevenue = employeeSales.reduce((sum, sale) => sum + sale.total, 0);
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Get detailed transaction data
    const transactionDetails = employeeSales.map(sale => ({
      date: new Date(sale.timestamp).toLocaleDateString(),
      orderId: sale.id,
      items: sale.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      total: sale.total,
    }));

    return {
      ...employee,
      totalTransactions,
      totalRevenue,
      averageTransaction,
      transactionDetails,
    };
  });

  // Filter performance data for current user if not admin
  const filteredPerformance = user?.role === 'admin' 
    ? employeePerformance 
    : employeePerformance.filter(emp => emp.id === user?.id);

  const reports = [
    {
      id: 'low-stock',
      title: 'Low Stock Items',
      description: 'Products with stock below threshold',
      color: 'bg-red-100 border-red-200',
      icon: 'text-red-600',
      getData: () => products.filter(p => p.stock < 10).map(p => ({
        Name: p.name,
        Category: p.category,
        'Current Stock': p.stock,
        Price: `Tsh.${p.price.toFixed(2)}`,
      })),
    },
    {
      id: 'expiring',
      title: 'Expiring Items',
      description: 'Products expiring within 30 days',
      color: 'bg-yellow-100 border-yellow-200',
      icon: 'text-yellow-600',
      getData: () => products.filter(p => {
        const expiryDate = new Date(p.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow;
      }).map(p => ({
        Name: p.name,
        Category: p.category,
        'Expiry Date': new Date(p.expiryDate).toLocaleDateString(),
        Stock: p.stock,
      })),
    },
    {
      id: 'employee',
      title: 'Employee Performance',
      description: 'Employee sales and transaction metrics',
      color: 'bg-blue-100 border-blue-200',
      icon: 'text-blue-600',
      getData: () => filteredPerformance.map(e => ({
        Name: e.name,
        Role: e.role,
        Department: e.department,
        'Total Transactions': e.totalTransactions,
        'Total Revenue': `Tsh.${e.totalRevenue.toFixed(2)}`,
        'Average Transaction': `Tsh.${e.averageTransaction.toFixed(2)}`,
        'Recent Transactions': e.transactionDetails.slice(0, 5).map(t => 
          `${t.date}: ${t.orderId} - Tsh.${t.total.toFixed(2)}`
        ).join('\n'),
      })),
    },
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Sales transactions within date range',
      color: 'bg-green-100 border-green-200',
      icon: 'text-green-600',
      getData: () => {
        const filteredSales = sales.filter(s => {
          const saleDate = new Date(s.timestamp);
          const isInRange = saleDate >= new Date(dateRange.start) && 
                          saleDate <= new Date(dateRange.end);
          return user?.role === 'admin' ? isInRange : isInRange && s.employeeId === user?.id;
        });

        return filteredSales.map(s => ({
          'Sale ID': s.id,
          'Employee': s.employeeName,
          'Date': new Date(s.timestamp).toLocaleDateString(),
          'Items': s.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
          'Total': `Tsh.${s.total.toFixed(2)}`,
          'Payment Method': s.paymentMethod,
        }));
      },
    },
  ];

  const exportToExcel = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const data = report.getData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, report.title);
    XLSX.writeFile(wb, `${report.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const data = report.getData();
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(report.title, 14, 15);
    
    // Add date range if applicable
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Create table
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item));
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`${report.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border rounded-md px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border rounded-md px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`${report.color} border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{report.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </div>
              <ChevronRight className={`h-6 w-6 ${report.icon}`} />
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {reports.find(r => r.id === selectedReport)?.title}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => exportToExcel(selectedReport)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </button>
              <button
                onClick={() => exportToPDF(selectedReport)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(reports.find(r => r.id === selectedReport)?.getData()[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports
                  .find(r => r.id === selectedReport)
                  ?.getData()
                  .map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
