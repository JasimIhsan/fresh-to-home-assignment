// Generated from the Supabase schema (supabase/migrations). Regenerate with
// `supabase gen types typescript` after schema changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type OrderRow = {
  address: string;
  created_at: string;
  customer_name: string;
  delivery_slot: string | null;
  id: number;
  items: Json;
  notes: string | null;
  payment_method: string | null;
  phone: string;
  status: string;
  total_amount: number;
  user_email: string | null;
  user_id: string;
};

type ProductRow = {
  barcode: string | null;
  category: string;
  created_at: string;
  created_by: string | null;
  description: string;
  gallery_images: string[];
  id: number;
  image_url: string;
  name: string;
  origin: string | null;
  price_per_kg: number;
  reorder_point_kg: number;
  reserved_stock_kg: number;
  sku: string | null;
  status: string;
  stock_kg: number;
  tags: string[];
  unit: string;
  updated_at: string;
  updated_by: string | null;
  visibility: string;
  wholesale_cost_per_kg: number | null;
};

export type UserRole = "customer" | "admin";

type ProfileRow = {
  created_at: string;
  email: string | null;
  full_name: string;
  id: number;
  role: UserRole;
  updated_at: string;
  user_id: string;
};

/** `id` columns are `generated always as identity`, so writes never set them. */
type Writable<Row extends { id: number }> = Partial<Omit<Row, "id">> & {
  id?: never;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      orders: {
        Row: OrderRow;
        Insert: Writable<OrderRow> &
          Pick<
            OrderRow,
            | "address"
            | "customer_name"
            | "items"
            | "phone"
            | "total_amount"
            | "user_id"
          >;
        Update: Writable<OrderRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Writable<ProductRow> &
          Pick<ProductRow, "category" | "name" | "price_per_kg">;
        Update: Writable<ProductRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Writable<ProfileRow> & Pick<ProfileRow, "user_id">;
        Update: Writable<ProfileRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
      place_order: {
        Args: {
          p_address: string;
          p_customer_name: string;
          p_delivery_slot: string;
          p_items: Json;
          p_notes: string;
          p_payment_method: string;
          p_phone: string;
        };
        Returns: OrderRow;
        SetofOptions: {
          from: "*";
          to: "orders";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: { user_role: UserRole };
    CompositeTypes: { [_ in never]: never };
  };
};

export type ProductRecord = ProductRow;
export type OrderRecord = OrderRow;
export type ProfileRecord = ProfileRow;
