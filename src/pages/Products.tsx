import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Menu,
  X,
  LogOut,
  Users,
  Zap,
  LayoutDashboard,
  ListOrdered,
  UserCheck,
  Target,
  GitBranch,
  Settings,
  Gift
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  pricing_type: string;
  price: number;
  has_trial: boolean;
  trial_type: string | null;
  trial_amount: number | null;
  created_at: string;
}

export default function Products() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getPricingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      one_time: 'One Time',
      recurring: 'Recurring',
      limited_subscription: 'Limited Subscription'
    };
    return labels[type] || type;
  };

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', current: false },
    { name: 'Products', icon: Package, href: '/dashboard/products', current: true },
    { name: 'Checkouts', icon: Settings, href: '/dashboard/checkouts', current: false },
    { name: 'Orders', icon: ListOrdered, href: '/dashboard/orders', current: false },
    { name: 'Affiliates', icon: UserCheck, href: '/dashboard/affiliates', current: false },
    { name: 'A/B Tests', icon: Target, href: '/dashboard/ab-tests', current: false },
    { name: 'Funnels', icon: GitBranch, href: '/dashboard/funnels', current: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading products...</p>
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
                <h1 className="text-3xl font-bold text-slate-900">Products</h1>
                <p className="text-slate-600 mt-1">Manage your product catalog</p>
              </div>
              <Link
                to="/products/create"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create Product
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products yet</h3>
                <p className="text-slate-600 mb-6">Get started by creating your first product</p>
                <Link
                  to="/products/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Product
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(product.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Price</span>
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Type</span>
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {getPricingTypeLabel(product.pricing_type)}
                        </span>
                      </div>
                    </div>

                    {product.has_trial && (
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600">
                          {product.trial_type === 'paid'
                            ? `Paid Trial (${formatCurrency(product.trial_amount || 0)})`
                            : 'Free Trial'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Delete Product</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
