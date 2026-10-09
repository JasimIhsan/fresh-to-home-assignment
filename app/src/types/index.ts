export type ProductStatus = "draft" | "active" | "archived";

export interface Product {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  imageUrl: string;
  isAvailable: boolean;
  category: string;
  stockKg?: number;
  origin?: string;
  unit?: string;
  sku?: string;
  barcode?: string;
  tags?: string[];
  reservedStockKg?: number;
  reorderPointKg?: number;
  wholesaleCostPerKg?: number;
  status?: ProductStatus;
  visibility?: "public" | "hidden";
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  galleryImages?: string[];
}

export interface CartItem {
  product: Product;
  weightKg: number;
}

export type OrderStatus =
  "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  customerName?: string;
  phone?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
  deliverySlot?: string;
  paymentMethod?: string;
  notes?: string;
}

// Network Information API interfaces for browser typing
export interface NetworkInformation extends EventTarget {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number;
  downlink?: number;
  saveData?: boolean;
  onchange?: EventListener;
}

export interface NavigatorWithNetwork extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  standalone?: boolean;
}

// PWA BeforeInstallPromptEvent interface
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
