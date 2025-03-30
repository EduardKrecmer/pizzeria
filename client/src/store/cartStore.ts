import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Pizza, Extra, PizzaSize, CustomerInfo, Order } from '../types';

interface CartStore {
  items: CartItem[];
  delivery: number;
  discount: number;
  discountCode: string | null;
  customerInfo: CustomerInfo | null;
  orderCompleted: boolean;
  orderError: string | null;
  
  addToCart: (pizza: Pizza, size: PizzaSize, quantity: number, selectedIngredients: string[], selectedExtras: Extra[]) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  applyDiscountCode: (code: string) => boolean;
  setCustomerInfo: (info: CustomerInfo) => void;
  placeOrder: () => Promise<void>;
  resetOrder: () => void;
}

const SIZES: Record<PizzaSize, number> = {
  'S': -1.00,
  'M': 0,
  'L': 2.00
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      delivery: 2.50,
      discount: 0,
      discountCode: null,
      customerInfo: null,
      orderCompleted: false,
      orderError: null,

      addToCart: (pizza, size, quantity, selectedIngredients, selectedExtras) => {
        const { items } = get();
        const basePrice = pizza.price;
        
        // Calculate price with size adjustment
        const adjustedPrice = basePrice + SIZES[size];
        
        // Calculate extras price
        const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
        
        // Final item price
        const itemPrice = adjustedPrice + extrasPrice;
        
        const newItem: CartItem = {
          id: pizza.id,
          name: pizza.name,
          price: itemPrice,
          size,
          quantity,
          ingredients: selectedIngredients,
          extras: selectedExtras,
          image: pizza.image
        };
        
        set({ items: [...items, newItem] });
      },
      
      removeFromCart: (index) => {
        const { items } = get();
        set({ items: items.filter((_, i) => i !== index) });
      },
      
      updateQuantity: (index, quantity) => {
        const { items } = get();
        const updatedItems = [...items];
        updatedItems[index].quantity = quantity;
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [], discount: 0, discountCode: null });
      },
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      
      getTotal: () => {
        const { delivery, discount } = get();
        const subtotal = get().getSubtotal();
        return subtotal + delivery - discount;
      },
      
      applyDiscountCode: (code) => {
        // Simple discount code logic
        if (code === 'PIZZA10') {
          set({ discount: 3.00, discountCode: code });
          return true;
        }
        return false;
      },
      
      setCustomerInfo: (info) => {
        set({ customerInfo: info });
      },
      
      placeOrder: async () => {
        const { items, customerInfo, getTotal } = get();
        
        if (!customerInfo || items.length === 0) {
          set({ orderError: 'Chýbajú údaje potrebné pre dokončenie objednávky' });
          return;
        }
        
        try {
          const order: Order = {
            customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            deliveryAddress: customerInfo.street,
            deliveryCity: customerInfo.city,
            deliveryPostalCode: customerInfo.postalCode,
            notes: customerInfo.notes,
            items: items,
            totalAmount: getTotal()
          };
          
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to place order');
          }
          
          set({ orderCompleted: true, orderError: null });
          get().clearCart();
        } catch (error) {
          set({ 
            orderError: error instanceof Error ? error.message : 'Nastala chyba pri spracovaní objednávky' 
          });
        }
      },
      
      resetOrder: () => {
        set({ orderCompleted: false, orderError: null });
      }
    }),
    {
      name: 'pizza-cart'
    }
  )
);
