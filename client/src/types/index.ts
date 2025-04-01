export type PizzaSize = 'S' | 'M' | 'L';

export interface SizeOption {
  size: PizzaSize;
  label: string;
  priceModifier: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: PizzaSize;
  quantity: number;
  ingredients: string[];
  extras: Extra[];
  image: string;
}

export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  ingredients: string[];
  weight?: string | null;
  allergens?: string | null;
}

export interface Extra {
  id: number;
  name: string;
  price: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  notes: string;
}

export interface OrderSummary {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
}

export interface Order {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
}
