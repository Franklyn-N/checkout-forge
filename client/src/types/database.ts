export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  status: 'active' | 'inactive' | 'draft';
  stock_quantity: number | null;
  category_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  checkout_page_id: string | null;
  customer_email: string;
  customer_name: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_method: string | null;
  affiliate_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  products?: Pick<Product, 'name'>;
  checkout_pages?: Pick<CheckoutPage, 'name'>;
}

export interface CheckoutPage {
  id: string;
  user_id: string;
  product_id: string;
  template_id: string | null;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  settings: Record<string, any> | null;
  custom_css: string | null;
  custom_js: string | null;
  created_at: string;
  updated_at: string;
  products?: Pick<Product, 'name'>;
  templates?: Pick<Template, 'name'>;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  preview_url: string | null;
  html_template: string;
  css_template: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Affiliate {
  id: string;
  user_id: string;
  name: string;
  email: string;
  commission_rate: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  total_sales: number;
  total_commission: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ABTest {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'running' | 'paused' | 'completed';
  start_date: string | null;
  end_date: string | null;
  variants: Record<string, any>;
  metrics: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Funnel {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive' | 'draft';
  steps: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}
