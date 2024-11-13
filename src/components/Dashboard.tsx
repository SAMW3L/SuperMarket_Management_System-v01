import React from 'react';
import {
  TrendingUp,
  Package,
  AlertCircle,
  DollarSign,
  Users,
  ShoppingCart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 8390 },
  { name: 'Sun', sales: 4490 },
];

const inventoryData = [
  { category: 'Groceries', stock: 150 },
  { category: 'Beverages', stock: 80 },
  { category: 'Snacks', stock: 120 },
  { category: 'Dairy', stock: 60 },
  { category: 'Produce', stock: 90 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Today's Sales"
          value="$12,426"
          change="+14.5%"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Active Inventory"
          value="1,245"
          change="-2.3%"
          icon={Package}
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value="28"
          change="+4"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weekly Sales Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Inventory by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              icon={DollarSign}
              title="New Sale"
              description="Order #12345 processed"
              time="5 minutes ago"
            />
            <ActivityItem
              icon={Package}
              title="Stock Update"
              description="Added 50 units of Product XYZ"
              time="15 minutes ago"
            />
            <ActivityItem
              icon={Users}
              title="New Employee"
              description="John Doe added to the system"
              time="1 hour ago"
            />
            <ActivityItem
              icon={ShoppingCart}
              title="Inventory Alert"
              description="Low stock warning for Product ABC"
              time="2 hours ago"
            />
          </div>
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
  color: 'blue' | 'green' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
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

function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-blue-50 p-2 rounded-full">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  );
}