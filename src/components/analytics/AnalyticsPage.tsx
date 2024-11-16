import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { useSalesStore } from '../../store/salesStore';
import { useInventoryStore } from '../../store/inventoryStore';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const { sales } = useSalesStore();
  const { products } = useInventoryStore();

  // Calculate total sales and profit
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = totalSales * 0.25; // Assuming 25% profit margin

  // Calculate sales by category
  const salesByCategory = products.reduce((acc, product) => {
    const productSales = sales.flatMap(sale => 
      sale.items.filter(item => item.productId === product.id)
    );
    const totalAmount = productSales.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    acc[product.category] = (acc[product.category] || 0) + totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(salesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare monthly sales data
  const monthlySales = sales.reduce((acc, sale) => {
    const month = new Date(sale.timestamp).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const salesData = Object.entries(monthlySales).map(([month, sales]) => ({
    month,
    sales,
    profit: sales * 0.25,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <select 
            className="border border-gray-300 rounded-md text-sm p-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`Tsh.${totalSales.toFixed(2)}`}
          change="+14.5%"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Total Profit"
          value={`Tsh.${totalProfit.toFixed(2)}`}
          change="+8.2%"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Active Products"
          value={products.length.toString()}
          change="+2.3%"
          icon={Package}
          color="yellow"
        />
        <StatCard
          title="Total Orders"
          value={sales.length.toString()}
          change="+4.7%"
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales & Profit Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Trend Analysis</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Sales"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <span
              className={`text-sm ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}