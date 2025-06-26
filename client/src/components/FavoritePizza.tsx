import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, ShoppingCart, Pizza as PizzaIcon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { usePizzaStore } from '../store/pizzaStore';
import { Pizza, Extra, PizzaSize } from '../types';

interface FavoritePizzaItem {
  id: string;
  name: string;
  basePizza: Pizza;
  selectedSize: PizzaSize;
  selectedExtras: Extra[];
  totalPrice: number;
  createdAt: string;
}

interface FavoritePizzaProps {
  className?: string;
}

const STORAGE_KEY = 'pizzeria_favorite_pizzas';

const FavoritePizza: React.FC<FavoritePizzaProps> = ({ className = '' }) => {
  const [favorites, setFavorites] = useState<FavoritePizzaItem[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { addToCart } = useCartStore();
  const { pizzas } = usePizzaStore();

  // Načítanie obľúbených pizzí pri spustení komponenty
  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Chyba pri načítavaní obľúbených pizzí:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Uloženie obľúbených do localStorage
  const saveFavoritesToStorage = (newFavorites: FavoritePizzaItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  // Výpočet ceny pizze
  const calculatePizzaPrice = (basePizza: Pizza, size: PizzaSize, extras: Extra[]): number => {
    const priceString = typeof basePizza.price === 'string' ? basePizza.price : basePizza.price.toString();
    let basePrice = parseFloat(priceString.replace('€', '').replace(',', '.').trim());
    
    // Príplatky za typ cesta
    switch (size) {
      case 'GLUTEN_FREE':
        basePrice += 1.5;
        break;
      case 'VEGAN':
        basePrice += 1.0;
        break;
      default:
        break;
    }
    
    // Príplatky za extra prísady
    const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0);
    
    return basePrice + extrasPrice;
  };

  // Pridanie novej obľúbenej pizze
  const addToFavorites = (
    customName: string,
    basePizza: Pizza,
    selectedSize: PizzaSize,
    selectedExtras: Extra[]
  ) => {
    const newFavorite: FavoritePizzaItem = {
      id: Date.now().toString(),
      name: customName || `${basePizza.name} (obľúbená)`,
      basePizza,
      selectedSize,
      selectedExtras,
      totalPrice: calculatePizzaPrice(basePizza, selectedSize, selectedExtras),
      createdAt: new Date().toISOString()
    };

    const updatedFavorites = [...favorites, newFavorite];
    saveFavoritesToStorage(updatedFavorites);
  };

  // Odstránenie obľúbenej pizze
  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    saveFavoritesToStorage(updatedFavorites);
  };

  // Pridanie obľúbenej pizze do košíka
  const addFavoriteToCart = (favorite: FavoritePizzaItem) => {
    // Aktualizujeme cenu pre prípad, že sa ceny zmenili
    const currentPrice = calculatePizzaPrice(
      favorite.basePizza, 
      favorite.selectedSize, 
      favorite.selectedExtras
    );

    addToCart(
      favorite.basePizza,
      favorite.selectedSize,
      1,
      [],
      favorite.selectedExtras
    );
  };

  // Vymazanie všetkých obľúbených
  const clearAllFavorites = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFavorites([]);
  };

  // Získanie popisu typu cesta
  const getSizeDescription = (size: PizzaSize): string => {
    switch (size) {
      case 'REGULAR': return 'Klasická';
      case 'CREAM': return 'Smotanový základ';
      case 'GLUTEN_FREE': return 'Bezlepková';
      case 'VEGAN': return 'Vegánska mozzarella';
      default: return size;
    }
  };

  if (favorites.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-md border border-neutral-100 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="bg-neutral-50 p-4 rounded-full inline-block mb-4">
            <Heart className="h-12 w-12 text-neutral-300" />
          </div>
          <h3 className="text-xl font-heading font-bold mb-2">Žiadne obľúbené pizze</h3>
          <p className="text-neutral-500">
            Keď si vytvoríte obľúbenú kombináciu, zobrazí sa tu pre rýchle objednanie
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-bold text-[#4a5d23] flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Obľúbené pizze
            <span className="bg-[#4a5d23] text-white text-sm px-2 py-1 rounded-full">
              {favorites.length}
            </span>
          </h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-[#4a5d23] hover:text-[#3a4a1a] transition-colors"
            >
              {isExpanded ? 'Skryť' : 'Zobraziť všetky'}
            </button>
            
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="p-2 text-neutral-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                title="Vymazať všetky obľúbené"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {favorites.slice(0, isExpanded ? favorites.length : 2).map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center gap-4 p-4 bg-[#f5f9ee] rounded-lg border border-[#e0e8c9] hover:bg-[#eff5e3] transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#4a5d23] rounded-lg flex items-center justify-center">
                  <PizzaIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#4a5d23] truncate">{favorite.name}</h4>
                <p className="text-sm text-neutral-600">
                  {favorite.basePizza.name} • {getSizeDescription(favorite.selectedSize)}
                </p>
                
                {favorite.selectedExtras.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs text-neutral-500">
                      Extra: {favorite.selectedExtras.map(e => e.name).join(', ')}
                    </p>
                  </div>
                )}
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-[#4a5d23]">
                    {favorite.totalPrice.toFixed(2)}€
                  </span>
                  <span className="text-xs text-neutral-400">
                    uložené {new Date(favorite.createdAt).toLocaleDateString('sk-SK')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addFavoriteToCart(favorite)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4a5d23] text-white rounded-lg hover:bg-[#3a4a1a] transition-colors text-sm font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Do košíka
                </button>
                
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Odstrániť z obľúbených"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {!isExpanded && favorites.length > 2 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-[#4a5d23] hover:text-[#3a4a1a] transition-colors flex items-center gap-1 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Zobraziť ďalšie {favorites.length - 2} obľúbené
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook pre pridávanie do obľúbených (na použitie v iných komponentoch)
export const useFavoritePizza = () => {
  const [favorites, setFavorites] = useState<FavoritePizzaItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Chyba pri načítavaní obľúbených pizzí:', error);
      }
    }
  }, []);

  const addToFavorites = (
    customName: string,
    basePizza: Pizza,
    selectedSize: PizzaSize,
    selectedExtras: Extra[]
  ) => {
    const calculatePizzaPrice = (basePizza: Pizza, size: PizzaSize, extras: Extra[]): number => {
      const priceString = typeof basePizza.price === 'string' ? basePizza.price : basePizza.price.toString();
      let basePrice = parseFloat(priceString.replace('€', '').replace(',', '.').trim());
      
      switch (size) {
        case 'GLUTEN_FREE':
          basePrice += 1.5;
          break;
        case 'VEGAN':
          basePrice += 1.0;
          break;
        default:
          break;
      }
      
      const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0);
      return basePrice + extrasPrice;
    };

    const newFavorite: FavoritePizzaItem = {
      id: Date.now().toString(),
      name: customName || `${basePizza.name} (obľúbená)`,
      basePizza,
      selectedSize,
      selectedExtras,
      totalPrice: calculatePizzaPrice(basePizza, selectedSize, selectedExtras),
      createdAt: new Date().toISOString()
    };

    const updatedFavorites = [...favorites, newFavorite];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return { favorites, addToFavorites };
};

export default FavoritePizza;