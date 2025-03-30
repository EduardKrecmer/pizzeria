import { create } from 'zustand';
import { Pizza, Extra } from '../types';

interface PizzaStore {
  pizzas: Pizza[];
  filteredPizzas: Pizza[];
  isLoading: boolean;
  error: string | null;
  extras: Extra[];
  activeCategory: string;
  
  fetchPizzas: () => Promise<void>;
  fetchExtras: () => Promise<void>;
  getPizzaById: (id: number) => Pizza | undefined;
  setActiveCategory: (category: string) => void;
}

export const usePizzaStore = create<PizzaStore>((set, get) => ({
  pizzas: [],
  filteredPizzas: [],
  isLoading: false,
  error: null,
  extras: [],
  activeCategory: 'Všetky',
  
  fetchPizzas: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/pizzas');
      if (!response.ok) {
        throw new Error('Failed to fetch pizzas');
      }
      const data = await response.json();
      set({ 
        pizzas: data, 
        filteredPizzas: data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  fetchExtras: async () => {
    try {
      const response = await fetch('/api/extras');
      if (!response.ok) {
        throw new Error('Failed to fetch extras');
      }
      const data = await response.json();
      set({ extras: data });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  },
  
  getPizzaById: (id: number) => {
    return get().pizzas.find(pizza => pizza.id === id);
  },
  
  setActiveCategory: (category: string) => {
    const { pizzas } = get();
    set({ activeCategory: category });
    
    if (category === 'Všetky') {
      set({ filteredPizzas: pizzas });
    } else if (category === 'Obľúbené') {
      // ID pizz, ktoré sú označené ako obľúbené
      const favoriteIds = [1, 2, 4, 7]; // Margherita, Diavola, Capricciosa a Hawai
      const filtered = pizzas.filter(pizza => favoriteIds.includes(pizza.id));
      set({ filteredPizzas: filtered });
    } else {
      const filtered = pizzas.filter(pizza => 
        pizza.tags.includes(category)
      );
      set({ filteredPizzas: filtered });
    }
  }
}));
