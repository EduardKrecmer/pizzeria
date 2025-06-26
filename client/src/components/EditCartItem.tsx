import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { CartItem, Extra, PizzaSize } from '../types';
import { useCartStore } from '../store/cartStore';
import { usePizzaStore } from '../store/pizzaStore';

interface EditCartItemProps {
  item: CartItem;
  itemIndex: number;
  onClose: () => void;
}

const SIZES: Record<PizzaSize, { label: string; price: number }> = {
  'REGULAR': { label: 'Klasické cesto', price: 0 },
  'CREAM': { label: 'Smotanový základ', price: 0 },
  'GLUTEN_FREE': { label: 'Bezlepkové cesto', price: 1.50 },
  'VEGAN': { label: 'Vegánska mozzarella', price: 2.00 },
  'THICK': { label: 'Hrubé cesto', price: 1.00 }
};

export const EditCartItem: React.FC<EditCartItemProps> = ({ item, itemIndex, onClose }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  const { extras } = usePizzaStore();
  
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(item.size);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(item.extras || []);
  const [quantity, setQuantity] = useState(item.quantity);

  // Nájdenie pôvodnej pizze na základe uložených údajov
  const originalPizza = item.pizza || {
    id: item.id,
    name: item.name,
    description: '',
    price: parseFloat(item.price.toString()) - SIZES[item.size].price - (item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0),
    image: item.image,
    tags: [],
    ingredients: []
  };

  const handleExtraToggle = (extra: Extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id && e.category === extra.category);
      if (exists) {
        return prev.filter(e => !(e.id === extra.id && e.category === extra.category));
      } else {
        return [...prev, extra];
      }
    });
  };

  const calculateNewPrice = () => {
    const basePrice = originalPizza.price;
    const sizePrice = SIZES[selectedSize].price;
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    return basePrice + sizePrice + extrasPrice;
  };

  const handleSave = () => {
    // Odstránime starú položku
    removeFromCart(itemIndex);
    
    // Pridáme novú položku s aktualizovanými údajmi
    const { addToCart } = useCartStore.getState();
    addToCart(
      originalPizza,
      selectedSize,
      quantity,
      [], // selectedIngredients - nemáme implementované
      selectedExtras
    );
    
    onClose();
  };

  const categorizedExtras = extras.reduce((acc, extra) => {
    const category = extra.category || 'Ostatné';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(extra);
    return acc;
  }, {} as Record<string, Extra[]>);

  // Type guards pre bezpečný prístup k properties
  const getExtraKey = (extra: Extra) => `${extra.category || 'unknown'}-${extra.id || 0}`;
  const isExtraSelected = (extra: Extra) => selectedExtras.some(selected => 
    selected.id === extra.id && selected.category === extra.category
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">Upraviť pizzu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pizza info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.pizza-icon-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'pizza-icon-fallback w-12 h-12 text-primary';
                      fallback.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><circle cx="12" cy="12" r="10" fill="#e5e7eb"/><circle cx="12" cy="12" r="8" fill="#f59e0b"/><circle cx="8" cy="10" r="1" fill="#dc2626"/><circle cx="16" cy="10" r="1" fill="#dc2626"/><circle cx="10" cy="14" r="1" fill="#059669"/><circle cx="14" cy="14" r="1" fill="#059669"/></svg>`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="w-12 h-12 text-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <circle cx="12" cy="12" r="10" fill="#e5e7eb"/>
                    <circle cx="12" cy="12" r="8" fill="#f59e0b"/>
                    <circle cx="8" cy="10" r="1" fill="#dc2626"/>
                    <circle cx="16" cy="10" r="1" fill="#dc2626"/>
                    <circle cx="10" cy="14" r="1" fill="#059669"/>
                    <circle cx="14" cy="14" r="1" fill="#059669"/>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-neutral-600">Aktuálna cena: {calculateNewPrice().toFixed(2)}€</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Množstvo</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Size selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3">Typ cesta</label>
            <div className="space-y-2">
              {Object.entries(SIZES).map(([size, { label, price }]) => (
                <label
                  key={size}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSize === size
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={(e) => setSelectedSize(e.target.value as PizzaSize)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="font-medium">{label}</span>
                  </div>
                  {price > 0 && (
                    <span className="text-sm text-neutral-600">+{price.toFixed(2)}€</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3">Extra prísady</label>
            <div className="space-y-4">
              {Object.entries(categorizedExtras).map(([category, categoryExtras]) => (
                <div key={category}>
                  <h4 className="font-medium text-neutral-800 mb-2">{category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categoryExtras.map((extra) => {
                      const isSelected = selectedExtras.some(e => e.id === extra.id && e.category === extra.category);
                      return (
                        <label
                          key={`${extra.category}-${extra.id}`}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleExtraToggle(extra)}
                              className="w-4 h-4 text-primary"
                            />
                            <div>
                              <span className="font-medium text-sm">{extra.name}</span>
                              <span className="text-xs text-neutral-500 ml-1">({extra.amount})</span>
                            </div>
                          </div>
                          <span className="text-sm text-neutral-600">+{extra.price.toFixed(2)}€</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Zrušiť
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Uložiť zmeny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCartItem;