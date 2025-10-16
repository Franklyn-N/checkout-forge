/*
  # CheckoutForge Database Schema

  1. New Tables
    - `products`
      - Product catalog with pricing and recurring billing support
      - Supports physical, digital, service, and subscription types
    - `checkout_pages`
      - Configurable checkout page instances linked to products
      - Stores template and customization settings
    - `orders`
      - Complete order records with customer and payment information
      - Links to products, checkouts, and affiliates
    - `funnels`
      - Multi-step sales funnel configurations
    - `funnel_steps`
      - Individual steps within funnels (main, upsell, downsell, thankyou)
    - `ab_tests`
      - A/B test configurations for checkout optimization
    - `ab_test_variants`
      - Individual variants within A/B tests with traffic allocation
    - `affiliates`
      - Affiliate partner information and commission rates
    - `commissions`
      - Individual commission records tied to orders and affiliates
    - `templates`
      - Checkout page templates with preview information
    - `checkout_visits`
      - Analytics tracking for checkout page visits

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
    - Public read access for templates and public checkout viewing
    - Secure admin operations for all management functions

  3. Indexes
    - Performance indexes on foreign keys and frequently queried fields
    - Composite indexes for reporting queries

  4. Important Notes
    - All timestamps use timestamptz for timezone awareness
    - UUIDs used for all primary keys with gen_random_uuid()
    - JSONB used for flexible metadata and configuration storage
    - Status enums for consistent state management
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('physical', 'digital', 'service', 'subscription')),
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  currency text NOT NULL DEFAULT 'USD',
  recurring_interval text CHECK (recurring_interval IN ('day', 'week', 'month', 'year')),
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'archived', 'draft')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('ecommerce', 'saas', 'digital_products', 'services', 'donations')),
  preview_url text,
  thumbnail_url text,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkout_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  template_id text NOT NULL REFERENCES templates(id),
  customization jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  commission_rate numeric(5, 2) NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 100),
  payment_method jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  total_clicks integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_revenue numeric(10, 2) DEFAULT 0,
  total_commissions numeric(10, 2) DEFAULT 0,
  pending_commissions numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id uuid NOT NULL REFERENCES checkout_pages(id),
  product_id uuid NOT NULL REFERENCES products(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  customer jsonb NOT NULL,
  billing_address jsonb,
  shipping_address jsonb,
  payment_method jsonb,
  affiliate_code text,
  affiliate_id uuid REFERENCES affiliates(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  rate numeric(5, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('main', 'upsell', 'downsell', 'thankyou')),
  checkout_id uuid NOT NULL REFERENCES checkout_pages(id),
  step_order integer NOT NULL,
  conditions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_test_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ab_test_id uuid NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  name text NOT NULL,
  checkout_id uuid NOT NULL REFERENCES checkout_pages(id),
  traffic_allocation numeric(5, 2) NOT NULL CHECK (traffic_allocation >= 0 AND traffic_allocation <= 100),
  visits integer DEFAULT 0,
  orders integer DEFAULT 0,
  revenue numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkout_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id uuid NOT NULL REFERENCES checkout_pages(id) ON DELETE CASCADE,
  ab_test_id uuid REFERENCES ab_tests(id),
  variant_id uuid REFERENCES ab_test_variants(id),
  visitor_id text,
  ip_address text,
  user_agent text,
  referrer text,
  converted boolean DEFAULT false,
  order_id uuid REFERENCES orders(id),
  visited_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_checkout_pages_product_id ON checkout_pages(product_id);
CREATE INDEX IF NOT EXISTS idx_checkout_pages_status ON checkout_pages(status);
CREATE INDEX IF NOT EXISTS idx_orders_checkout_id ON orders(checkout_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_id ON orders(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_funnel_id ON funnel_steps(funnel_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_ab_test_id ON ab_test_variants(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_checkout_visits_checkout_id ON checkout_visits(checkout_id);
CREATE INDEX IF NOT EXISTS idx_checkout_visits_ab_test_id ON checkout_visits(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_checkout_visits_visited_at ON checkout_visits(visited_at);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active templates"
  ON templates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage templates"
  ON templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view checkout pages"
  ON checkout_pages FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage checkout pages"
  ON checkout_pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage affiliates"
  ON affiliates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage commissions"
  ON commissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage funnels"
  ON funnels FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage funnel steps"
  ON funnel_steps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage ab tests"
  ON ab_tests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage ab test variants"
  ON ab_test_variants FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can record checkout visits"
  ON checkout_visits FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view checkout visits"
  ON checkout_visits FOR SELECT
  TO authenticated
  USING (true);
