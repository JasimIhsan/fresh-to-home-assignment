"use client";

import { MOCK_PRODUCTS } from "@/mock/products";
import { Order, OrderStatus, Product } from "@/types";

const PRODUCTS_STORAGE_KEY = "fth_products";
const ORDERS_STORAGE_KEY = "fth_orders";

// Initial seed products
const INITIAL_PRODUCTS: Product[] = MOCK_PRODUCTS;

// Initial seed orders
const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9821",
    userId: "demo-user",
    userEmail: "kunde@beispiel.de",
    customerName: "Max Mustermann",
    phone: "+49 170 1234567",
    items: [
      { product: INITIAL_PRODUCTS[0], weightKg: 1.5 },
      { product: INITIAL_PRODUCTS[1], weightKg: 0.8 },
    ],
    totalAmount: 63.95,
    status: "processing",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    address: "Friedrichstraße 42, 10117 Berlin",
    deliverySlot: "Morgen 08:00 - 12:00",
    paymentMethod: "Kreditkarte",
  },
  {
    id: "ORD-9820",
    userId: "demo-user",
    userEmail: "kunde@beispiel.de",
    customerName: "Max Mustermann",
    phone: "+49 170 1234567",
    items: [{ product: INITIAL_PRODUCTS[3], weightKg: 1.0 }],
    totalAmount: 32.0,
    status: "delivered",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    address: "Friedrichstraße 42, 10117 Berlin",
    deliverySlot: "Gestern 16:00 - 20:00",
    paymentMethod: "PayPal",
  },
];

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return INITIAL_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(INITIAL_PRODUCTS)
      );
      return INITIAL_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(raw);
    // Merge any newly introduced mock products or missing admin fields if they don't already exist
    let updated = false;
    const seedMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
    const existingIds = new Set(parsed.map((p) => p.id));

    const merged = parsed.map((item) => {
      const seed = seedMap.get(item.id);
      if (seed) {
        let itemUpdated = false;
        const mergedItem = { ...item };
        if (!mergedItem.sku && seed.sku) {
          mergedItem.sku = seed.sku;
          itemUpdated = true;
        }
        if (!mergedItem.barcode && seed.barcode) {
          mergedItem.barcode = seed.barcode;
          itemUpdated = true;
        }
        if (!mergedItem.tags && seed.tags) {
          mergedItem.tags = seed.tags;
          itemUpdated = true;
        }
        if (
          mergedItem.reservedStockKg === undefined &&
          seed.reservedStockKg !== undefined
        ) {
          mergedItem.reservedStockKg = seed.reservedStockKg;
          itemUpdated = true;
        }
        if (
          mergedItem.reorderPointKg === undefined &&
          seed.reorderPointKg !== undefined
        ) {
          mergedItem.reorderPointKg = seed.reorderPointKg;
          itemUpdated = true;
        }
        if (
          mergedItem.wholesaleCostPerKg === undefined &&
          seed.wholesaleCostPerKg !== undefined
        ) {
          mergedItem.wholesaleCostPerKg = seed.wholesaleCostPerKg;
          itemUpdated = true;
        }
        if (!mergedItem.status) {
          mergedItem.status =
            seed.status || (mergedItem.isAvailable ? "active" : "draft");
          itemUpdated = true;
        }
        if (!mergedItem.visibility) {
          mergedItem.visibility =
            seed.visibility || (mergedItem.isAvailable ? "public" : "hidden");
          itemUpdated = true;
        }
        if (!mergedItem.createdAt && seed.createdAt) {
          mergedItem.createdAt = seed.createdAt;
          itemUpdated = true;
        }
        if (!mergedItem.updatedAt && seed.updatedAt) {
          mergedItem.updatedAt = seed.updatedAt;
          itemUpdated = true;
        }
        if (!mergedItem.createdBy && seed.createdBy) {
          mergedItem.createdBy = seed.createdBy;
          itemUpdated = true;
        }
        if (!mergedItem.updatedBy && seed.updatedBy) {
          mergedItem.updatedBy = seed.updatedBy;
          itemUpdated = true;
        }
        if (!mergedItem.galleryImages && seed.galleryImages) {
          mergedItem.galleryImages = seed.galleryImages;
          itemUpdated = true;
        }
        if (itemUpdated) updated = true;
        return mergedItem;
      }
      return item;
    });

    for (const seedProduct of INITIAL_PRODUCTS) {
      if (!existingIds.has(seedProduct.id)) {
        merged.push(seedProduct);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function getProductById(id: string): Product | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.id === id);
}

export function saveProduct(product: Product): void {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index > -1) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  saveProducts(products);
}

export function deleteProduct(id: string): void {
  const products = getStoredProducts();
  const updated = products.filter((p) => p.id !== id);
  saveProducts(updated);
}

export function updateProductStock(
  id: string,
  newStockKg: number
): Product | undefined {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === id);
  if (product) {
    product.stockKg = Math.max(0, newStockKg);
    product.updatedAt = new Date().toISOString();
    saveProducts(products);
  }
  return product;
}

export function updateProductStatus(
  id: string,
  status: Product["status"]
): Product | undefined {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === id);
  if (product) {
    product.status = status;
    product.isAvailable = status === "active";
    product.updatedAt = new Date().toISOString();
    saveProducts(products);
  }
  return product;
}

export function getStoredOrders(userId?: string): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    let orders: Order[] = [];
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      orders = INITIAL_ORDERS;
    } else {
      orders = JSON.parse(raw);
    }
    if (userId) {
      return orders.filter(
        (o) =>
          o.userId === userId ||
          o.userEmail?.toLowerCase() === userId.toLowerCase()
      );
    }
    return orders;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function getOrderById(id: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find((o) => o.id === id);
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  const orders = getStoredOrders();
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Order | undefined {
  const orders = getStoredOrders();
  const target = orders.find((o) => o.id === orderId);
  if (target) {
    target.status = status;
    saveOrders(orders);
  }
  return target;
}
