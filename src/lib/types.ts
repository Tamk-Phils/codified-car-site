export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  price: number;
  sale_price: number | null;
  down_payment: number | null;
  description: string;
  mileage: string | null;
  transmission: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  fuel_type: string | null;
  trim: string | null;
  title_status: string | null;
  body_type: string | null;
  make: string | null;
  year: number | null;
  images: string[];
  is_hot_deal: boolean;
  is_sold: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  keywords: string[];
  meta_title: string | null;
  meta_description: string | null;
  author: string;
  read_minutes: number;
  is_published: boolean;
  published_at: string;
};

export type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  body: string;
  sort_order: number;
};

export type OrderRow = {
  id: string;
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  payment_method: string;
  notes: string;
  total: number;
  status: string;
  created_at: string;
  order_items?: {
    id: string;
    vehicle_name: string;
    vehicle_slug: string;
    unit_price: number;
    quantity: number;
    image: string | null;
  }[];
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};
