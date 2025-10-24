/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  Zap,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ListOrdered,
  UserCheck,
  GitBranch,
  Settings
} from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalAffiliates: number;
  activeCheckouts: number;
  runningTests: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalAffiliates: 0,
    activeCheckouts: 0,
    runningTests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, checkoutsRes, affiliatesRes, testsRes, ordersDataRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('checkout_pages').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('affiliates').select('*', { count: 'exact', head: true }),
        supabase.from('ab_tests').select('*', { count: 'exact', head: true }).eq('status', 'running'),
        supabase.from('orders').select('amount, status').eq('status', 'completed')
      ]);

      const totalRevenue = ordersDataRes.data?.reduce((sum, order) => sum + Number(order.amount || 0), 0) || 0;

      const recentOrdersRes = await supabase
        .from('orders')
        .select('*, products(name), checkout_pages(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const productStatsRes = await supabase
        .from('orders')
        .select('product_id, products(name), amount')
        .eq('status', 'completed');

      const productMap = new Map<string, { name: string; orders: number; revenue: number }>();
      productStatsRes.data?.forEach(order => {
        const productName = (order.products as any)?.name || 'Unknown';
        const current = productMap.get(productName) || { name: productName, orders: 0, revenue: 0 };
        productMap.set(productName, {
          name: productName,
          orders: current.orders + 1,
          revenue: current.revenue + Number(order.amount || 0)
        });
      });

      const topProductsList = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue: totalRevenue,
        totalAffiliates: affiliatesRes.count || 0,
        activeCheckouts: checkoutsRes.count || 0,
        runningTests: testsRes.count || 0
      });

      setRecentOrders(recentOrdersRes.data || []);
      setTopProducts(topProductsList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', current: true },
    { name: 'Products', icon: Package, href: '/dashboard/products', current: false },
    { name: 'Checkouts', icon: Settings, href: '/dashboard/checkouts', current: false },
    { name: 'Orders', icon: ListOrdered, href: '/dashboard/orders', current: false },
    { name: 'Affiliates', icon: UserCheck, href: '/dashboard/affiliates', current: false },
    { name: 'A/B Tests', icon: Target, href: '/dashboard/ab-tests', current: false },
    { name: 'Funnels', icon: GitBranch, href: '/dashboard/funnels', current: false },
  ];

  const handleCreateProduct = () => {
    navigate('/products/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="lg:flex">
        <div className={`fixed inset-0 z-50 bg-slate-900 lg:relative lg:flex lg:w-64 lg:flex-col ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">CheckoutForge</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-700 p-4">
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                  <p className="text-xs text-slate-400">Admin</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your store.</p>
              </div>
              <button
                onClick={handleCreateProduct}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition shadow-lg hover:shadow-xl"
              >
                <Package className="w-5 h-5" />
                Create Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Products</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalProducts}</div>
                <p className="text-sm text-slate-600">Active products</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Orders</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalOrders}</div>
                <p className="text-sm text-slate-600">Total orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Revenue</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-sm text-slate-600">Total revenue</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Affiliates</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalAffiliates}</div>
                <p className="text-sm text-slate-600">Active affiliates</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Checkouts</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.activeCheckouts}</div>
                <p className="text-sm text-slate-600">Active checkouts</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-pink-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">A/B Tests</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.runningTests}</div>
                <p className="text-sm text-slate-600">Running tests</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingCart className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
                </div>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </p>
                          <p className="text-xs text-slate-600 truncate">{order.products?.name || 'Product'}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-slate-900">{formatCurrency(order.amount)}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Top Products</h2>
                </div>
                <div className="space-y-4">
                  {topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                            <p className="text-xs text-slate-600">{product.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-slate-900">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No product data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
