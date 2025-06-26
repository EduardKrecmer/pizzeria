import { create } from 'zustand';
import { Pizza, Extra } from '../types';

interface PizzaStore {
  pizzas: Pizza[];
  filteredPizzas: Pizza[];
  isLoading: boolean;
  error: string | null;
  extras: Extra[];
  activeCategory: string;
  searchTerm: string;
  
  fetchPizzas: () => Promise<void>;
  fetchExtras: () => Promise<void>;
  getPizzaById: (id: number) => Pizza | undefined;
  setActiveCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  filterPizzas: () => void;
}

export const usePizzaStore = create<PizzaStore>((set, get) => ({
  pizzas: [],
  filteredPizzas: [],
  isLoading: false,
  error: null,
  extras: [],
  activeCategory: 'Všetky',
  searchTerm: '',
  
  fetchPizzas: async () => {
    set({ isLoading: true, error: null });
    try {
      // Vždy používame relatívnu cestu - každé nasadenie má používať svoje vlastné API
      const apiEndpoint = '/api/pizzas';
      
      console.log('Načítavam pizze z relatívnej cesty:', apiEndpoint);
      
      // Pridanie absolute URL pre Replit
      const url = typeof window !== 'undefined' 
        ? `${window.location.origin}${apiEndpoint}`
        : apiEndpoint;
        
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pizzas: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('Načítané pizze:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('API returned invalid data format: expected an array of pizzas');
      }
      
      // Normalizujeme dáta - zabezpečíme, že každá pizza má všetky potrebné vlastnosti
      const normalizedData = data.map(pizza => {
        // Extrahujeme číselnú hodnotu z cenovej reťazec (napr. "6.50 €" -> 6.5)
        let priceValue = 0;
        if (typeof pizza.price === 'string') {
          const match = pizza.price.match(/(\d+[.,]\d+)/);
          if (match) {
            // Prekonvertujeme čiarku na bodku a prevedieme na číslo
            priceValue = parseFloat(match[0].replace(',', '.'));
          }
        } else if (typeof pizza.price === 'number') {
          priceValue = pizza.price;
        }

        // Príprava názvu obrázku na základe názvu pizze alebo ID
        const normalizedName = pizza.name?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-') || '';

        // Skúsime najprv použiť statický obrázok, ak neexistuje, použijeme placeholder
        const imagePath = `/images/pizzas/pizza-placeholder.jpg`;
        
        // Generujeme popis z ingrediencií, ak nie je explicitne uvedený
        const description = pizza.description || 
          `Tradičná ${pizza.name?.toLowerCase() || ''} pizza s ${pizza.ingredients || 'lahodnými ingredienciami'}.`;
          
        return {
          id: pizza.id || 0,
          name: pizza.name || 'Neznáma pizza',
          description: description,
          price: priceValue,
          image: pizza.image || imagePath,
          tags: Array.isArray(pizza.tags) ? pizza.tags : [],
          ingredients: typeof pizza.ingredients === 'string' ? pizza.ingredients.split(', ') : [],
          weight: pizza.weight || null,
          allergens: pizza.allergens || null
        };
      });
      
      set({ 
        pizzas: normalizedData,
        isLoading: false 
      });
      
      // Po načítaní pizze aplikujeme filtre
      get().filterPizzas();
    } catch (error) {
      console.error('Error fetching pizzas:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false,
        pizzas: [] // Nastavíme prázdne pole, aby sme predišli chybám pri filtrovaní
      });
    }
  },
  
  fetchExtras: async () => {
    try {
      // Vždy používame relatívnu cestu - každé nasadenie má používať svoje vlastné API
      const apiEndpoint = '/api/extras';
      
      console.log('Načítavam extra položky z relatívnej cesty:', apiEndpoint);
      
      // Pridanie absolute URL pre Replit
      const url = typeof window !== 'undefined' 
        ? `${window.location.origin}${apiEndpoint}`
        : apiEndpoint;
        
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch extras: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('Načítané extra položky:', data);
      
      // API vracia objekt s kategóriami, nie pole
      if (typeof data !== 'object') {
        throw new Error('API returned invalid data format for extras');
      }
      
      // Extras sú objekt s kategóriami, kde každá kategória obsahuje pole položiek
      // Pripravíme ich na formát, ktorý očakáva naša aplikácia
      let normalizedExtras: Extra[] = [];
      
      // Prechádzame všetky kategórie a ich položky
      Object.entries(data).forEach((entry) => {
        const category = entry[0];
        const items = entry[1];
        
        if (Array.isArray(items)) {
          // Pridáme každú položku do normalizovaného zoznamu s jej kategóriou
          items.forEach((item: any, index) => {
            normalizedExtras.push({
              id: index + 1, // Generujeme ID pre každú položku
              name: item.nazov || 'Neznáma príloha',
              price: typeof item.cena === 'number' ? item.cena : 0,
              amount: item.mnozstvo || '',
              category: category // Pridáme kategóriu pre ľahšie filtrovanie
            });
          });
        }
      });
      
      console.log('Normalizované extra položky:', normalizedExtras);
      set({ extras: normalizedExtras });
    } catch (error) {
      console.error('Error fetching extras:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        extras: [] // Nastavíme prázdne pole, aby sme predišli chybám
      });
    }
  },
  
  getPizzaById: (id: number) => {
    return get().pizzas.find(pizza => pizza.id === id);
  },
  
  setActiveCategory: (category: string) => {
    set({ activeCategory: category });
    get().filterPizzas();
    // Po zmene kategórie môžeme resetovať počet viditeľných pizz v Home.tsx pomocou eventu
    document.dispatchEvent(new CustomEvent('resetVisiblePizzas'));
  },
  
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    get().filterPizzas();
    // Po zmene vyhľadávania môžeme resetovať počet viditeľných pizz v Home.tsx pomocou eventu
    document.dispatchEvent(new CustomEvent('resetVisiblePizzas'));
  },
  
  filterPizzas: () => {
    const { pizzas, activeCategory, searchTerm } = get();
    let filtered = [...pizzas];
    
    // Najprv filtrujeme podľa kategórie
    if (activeCategory !== 'Všetky') {
      if (activeCategory === 'Obľúbené') {
        // ID pizz, ktoré sú označené ako obľúbené
        const favoriteIds = [1, 2, 4, 7]; // Syrová, Šunková, Salámová a Hawai
        filtered = filtered.filter(pizza => favoriteIds.includes(pizza.id));
      } else {
        filtered = filtered.filter(pizza => 
          pizza.tags && Array.isArray(pizza.tags) && pizza.tags.includes(activeCategory)
        );
      }
    }
    
    // Potom filtrujeme podľa vyhľadávania, ak je zadané
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(pizza => {
        const nameMatch = pizza.name && pizza.name.toLowerCase().includes(term);
        const descMatch = pizza.description && pizza.description.toLowerCase().includes(term);
        const ingMatch = pizza.ingredients && Array.isArray(pizza.ingredients) && 
          pizza.ingredients.some(ing => ing && ing.toLowerCase().includes(term));
        
        return nameMatch || descMatch || ingMatch;
      });
    }
    
    set({ filteredPizzas: filtered });
  }
}));
