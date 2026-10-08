import { Order } from '@/types';
import { MOCK_PRODUCTS } from './products';

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    userId: "user-1",
    items: [
      { product: MOCK_PRODUCTS[0], weightKg: 1.0 },
      { product: MOCK_PRODUCTS[1], weightKg: 0.5 }
    ],
    totalAmount: 42.15,
    status: 'processing',
    createdAt: new Date().toISOString(),
    address: "Musterstraße 1, 10115 Berlin"
  }
];
