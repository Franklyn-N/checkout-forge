export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProductFilters {
  status?: 'active' | 'inactive' | 'draft';
  categoryId?: string;
  search?: string;
}

export interface OrderFilters {
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CheckoutFilters {
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  productId?: string;
}

export interface AffiliateFilters {
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalAffiliates: number;
  activeCheckouts: number;
  runningTests: number;
}

export interface TopProduct {
  name: string;
  orders: number;
  revenue: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image_url?: string;
  status?: 'active' | 'inactive' | 'draft';
  stock_quantity?: number;
  category_id?: string;
  metadata?: Record<string, any>;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface CreateOrderDto {
  product_id: string;
  checkout_page_id?: string;
  customer_email: string;
  customer_name?: string;
  amount: number;
  currency?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_method?: string;
  affiliate_id?: string;
  metadata?: Record<string, any>;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;

export interface CreateCheckoutDto {
  product_id: string;
  template_id?: string;
  name: string;
  slug: string;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  settings?: Record<string, any>;
  custom_css?: string;
  custom_js?: string;
}

export type UpdateCheckoutDto = Partial<CreateCheckoutDto>;

export interface CreateAffiliateDto {
  name: string;
  email: string;
  commission_rate: number;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  metadata?: Record<string, any>;
}

export type UpdateAffiliateDto = Partial<CreateAffiliateDto>;

export type ApiResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };
