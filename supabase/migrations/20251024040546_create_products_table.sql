/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for the product
      - `user_id` (uuid, foreign key) - References the user who created the product
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `pricing_type` (text) - Type of pricing: 'one_time', 'recurring', or 'limited_subscription'
      - `price` (numeric) - Product price
      - `has_trial` (boolean) - Whether the product offers a trial
      - `trial_type` (text) - Type of trial: 'free' or 'paid' (nullable)
      - `trial_amount` (numeric) - Amount for paid trial (nullable, only applicable if trial_type is 'paid')
      - `created_at` (timestamptz) - Timestamp when product was created
      - `updated_at` (timestamptz) - Timestamp when product was last updated

  2. Security
    - Enable RLS on `products` table
    - Add policy for users to view their own products
    - Add policy for users to insert their own products
    - Add policy for users to update their own products
    - Add policy for users to delete their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  pricing_type text NOT NULL CHECK (pricing_type IN ('one_time', 'recurring', 'limited_subscription')),
  price numeric(10, 2) NOT NULL DEFAULT 0,
  has_trial boolean NOT NULL DEFAULT false,
  trial_type text CHECK (trial_type IN ('free', 'paid')),
  trial_amount numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);