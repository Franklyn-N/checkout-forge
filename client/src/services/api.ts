import { supabase } from '../lib/supabase';
import type {
  Product,
  Order,
  CheckoutPage,
  Affiliate,
  ProductFilters,
  OrderFilters,
  CheckoutFilters,
  AffiliateFilters,
  CreateProductDto,
  UpdateProductDto,
  CreateOrderDto,
  UpdateOrderDto,
  CreateCheckoutDto,
  UpdateCheckoutDto,
  CreateAffiliateDto,
  UpdateAffiliateDto,
  DashboardStats,
  TopProduct,
} from '../types';

export const api = {
  products: {
    getAll: async (filters?: ProductFilters): Promise<Product[]> => {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },

    getById: async (id: string): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },

    create: async (product: CreateProductDto): Promise<Product> => {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (error) throw error;
      return data as Product;
    },

    update: async (id: string, product: UpdateProductDto): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
  },

  orders: {
    getAll: async (filters?: OrderFilters): Promise<Order[]> => {
      let query = supabase
        .from('orders')
        .select('*, products(name), checkout_pages(name)')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    },

    getById: async (id: string): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(name), checkout_pages(name)')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Order | null;
    },

    create: async (order: CreateOrderDto): Promise<Order> => {
      const { data, error } = await supabase.from('orders').insert(order).select().single();
      if (error) throw error;
      return data as Order;
    },

    update: async (id: string, order: UpdateOrderDto): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .update(order)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Order;
    },

    updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Order;
    },
  },

  checkouts: {
    getAll: async (filters?: CheckoutFilters): Promise<CheckoutPage[]> => {
      let query = supabase
        .from('checkout_pages')
        .select('*, products(name), templates(name)')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CheckoutPage[];
    },

    getById: async (id: string): Promise<CheckoutPage | null> => {
      const { data, error } = await supabase
        .from('checkout_pages')
        .select('*, products(name), templates(name)')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as CheckoutPage | null;
    },

    create: async (checkout: CreateCheckoutDto): Promise<CheckoutPage> => {
      const { data, error } = await supabase
        .from('checkout_pages')
        .insert(checkout)
        .select()
        .single();
      if (error) throw error;
      return data as CheckoutPage;
    },

    update: async (id: string, checkout: UpdateCheckoutDto): Promise<CheckoutPage> => {
      const { data, error } = await supabase
        .from('checkout_pages')
        .update(checkout)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as CheckoutPage;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('checkout_pages').delete().eq('id', id);
      if (error) throw error;
    },
  },

  affiliates: {
    getAll: async (filters?: AffiliateFilters): Promise<Affiliate[]> => {
      let query = supabase.from('affiliates').select('*').order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Affiliate[];
    },

    getById: async (id: string): Promise<Affiliate | null> => {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Affiliate | null;
    },

    create: async (affiliate: CreateAffiliateDto): Promise<Affiliate> => {
      const { data, error } = await supabase.from('affiliates').insert(affiliate).select().single();
      if (error) throw error;
      return data as Affiliate;
    },

    update: async (id: string, affiliate: UpdateAffiliateDto): Promise<Affiliate> => {
      const { data, error } = await supabase
        .from('affiliates')
        .update(affiliate)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Affiliate;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('affiliates').delete().eq('id', id);
      if (error) throw error;
    },
  },

  stats: {
    getDashboard: async (): Promise<DashboardStats> => {
      const [productsRes, ordersRes, checkoutsRes, affiliatesRes, testsRes, ordersDataRes] =
        await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase
            .from('checkout_pages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active'),
          supabase.from('affiliates').select('*', { count: 'exact', head: true }),
          supabase
            .from('ab_tests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'running'),
          supabase.from('orders').select('amount, status').eq('status', 'completed'),
        ]);

      const totalRevenue =
        ordersDataRes.data?.reduce((sum, order) => sum + Number(order.amount || 0), 0) || 0;

      return {
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue,
        totalAffiliates: affiliatesRes.count || 0,
        activeCheckouts: checkoutsRes.count || 0,
        runningTests: testsRes.count || 0,
      };
    },

    getRecentOrders: async (limit = 5): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(name), checkout_pages(name)')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Order[];
    },

    getTopProducts: async (limit = 5): Promise<TopProduct[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('product_id, products(name), amount')
        .eq('status', 'completed');

      if (error) throw error;

      const productMap = new Map<string, TopProduct>();
      data?.forEach((order) => {
        const productName = (order.products as any)?.name || 'Unknown';
        const current = productMap.get(productName) || { name: productName, orders: 0, revenue: 0 };
        productMap.set(productName, {
          name: productName,
          orders: current.orders + 1,
          revenue: current.revenue + Number(order.amount || 0),
        });
      });

      return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    },
  },
};
