import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Eye,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import RecentActivity from './RecentActivity';
import dashboardService from '../../services/dashboardService';

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return then.toLocaleDateString();
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    pendingPayments: 0,
    todaySales: 0,
    todayRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await dashboardService.getDashboardStats();
        setStats(statsResponse.data);
        
        // Fetch recent activities
        const activitiesResponse = await dashboardService.getRecentActivities(6);
        setRecentActivities(activitiesResponse.data.activities || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      name: 'Add Product',
      href: '/inventory/products/new',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'New Sale',
      href: '/sales/new',
      icon: ShoppingCart,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Add Customer',
      href: '/customers/new',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: 'Record Payment',
      href: '/payments/new',
      icon: CreditCard,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-lg font-bold text-white">SH</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with Sanjay Hardware today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          color="bg-blue-500"
          link="/inventory/products"
          linkText="View Products"
        />
        <DashboardCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          color="bg-green-500"
          link="/customers"
          linkText="View Customers"
        />
        <DashboardCard
          title="Total Sales"
          value={stats.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="bg-purple-500"
          link="/sales"
          linkText="View Sales"
        />
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
          link="/sales"
          linkText="View Revenue"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Sales"
          value={stats.todaySales.toLocaleString()}
          icon={TrendingUp}
          color="bg-indigo-500"
          link="/sales"
          linkText="View Today"
        />
        <DashboardCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-indigo-500"
          link="/sales"
          linkText="View Today"
        />
        <DashboardCard
          title="Low Stock Items"
          value={stats.lowStockProducts.toLocaleString()}
          icon={AlertTriangle}
          color="bg-red-500"
          link="/inventory/products?stockStatus=low"
          linkText="View Items"
        />
        <DashboardCard
          title="Pending Payments"
          value={`₹${stats.pendingPayments.toLocaleString()}`}
          icon={CreditCard}
          color="bg-orange-500"
          link="/payments?status=pending"
          linkText="View Payments"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className={`flex flex-col items-center justify-center p-4 rounded-lg text-white transition-colors duration-200 ${action.color}`}
            >
              <action.icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Sales"
          type="sales"
          data={recentActivities
            .filter(activity => activity.type === 'sale')
            .slice(0, 3)
            .map(activity => ({
              id: activity.id,
              description: `Sale #${activity.invoiceNumber}`,
              amount: `₹${activity.amount.toLocaleString()}`,
              customer: activity.customer,
              time: formatTimeAgo(activity.date),
            }))}
        />

        <RecentActivity
          title="Recent Payments"
          type="payments"
          data={recentActivities
            .filter(activity => activity.type === 'payment')
            .slice(0, 3)
            .map(activity => ({
              id: activity.id,
              description: `Payment #${activity.receiptNumber}`,
              amount: `₹${activity.amount.toLocaleString()}`,
              customer: activity.customer,
              time: formatTimeAgo(activity.date),
            }))}
        />
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Low Stock Alert
              </h3>
              <p className="text-sm text-red-700">
                {stats.lowStockProducts} products are running low on stock.{' '}
                <Link
                  to="/inventory/products?stockStatus=low"
                  className="font-medium underline hover:text-red-800"
                >
                  View items
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {stats.pendingPayments > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-orange-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800">
                Pending Payments
              </h3>
              <p className="text-sm text-orange-700">
                ₹{stats.pendingPayments.toLocaleString()} in pending payments.{' '}
                <Link
                  to="/payments?status=pending"
                  className="font-medium underline hover:text-orange-800"
                >
                  View payments
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
