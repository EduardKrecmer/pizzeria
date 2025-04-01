import { useState, useEffect } from 'react';
import { Pizza, Extra, PizzaSize } from '../types';
import { usePizzaStore } from '../store/pizzaStore';
import { extraCategories, getAllExtras } from '../data/pizzaextras';

interface PizzaCustomizationProps {
  pizza: Pizza;
  onSelectSize: (size: PizzaSize) => void;
  onToggleIngredient: (ingredient: string, isSelected: boolean) => void;
  onToggleExtra: (extra: Extra, isSelected: boolean) => void;
  selectedSize: PizzaSize;
  selectedIngredients: string[];
  selectedExtras: Extra[];
}

const PizzaCustomization = ({
  pizza,
  onSelectSize,
  onToggleIngredient,
  onToggleExtra,
  selectedSize,
  selectedIngredients,
  selectedExtras
}: PizzaCustomizationProps) => {
  const { extras } = usePizzaStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(extraCategories[0]?.id || null);
  
  const handleSizeClick = (size: PizzaSize) => {
    onSelectSize(size);
  };

  const handleIngredientToggle = (ingredient: string) => {
    const isCurrentlySelected = selectedIngredients.includes(ingredient);
    onToggleIngredient(ingredient, !isCurrentlySelected);
  };

  const handleExtraToggle = (extra: Extra) => {
    const isSelected = selectedExtras.some(item => item.id === extra.id);
    onToggleExtra(extra, !isSelected);
  };

  const isExtraSelected = (extra: Extra) => {
    return selectedExtras.some(item => item.id === extra.id);
  };
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold" id="customization-heading">Prispôsob si svoju pizzu</h3>
      </div>
      
      {/* Size selection */}
      <div className="mb-6" role="radiogroup" aria-labelledby="size-heading">
        <h4 className="text-sm font-medium text-neutral-700 mb-2" id="size-heading">Veľkosť</h4>
        <div className="flex gap-2">
          <button 
            onClick={() => handleSizeClick('S')}
            className={`flex-1 px-3 py-2 rounded-md border text-center text-sm font-medium transition-colors ${
              selectedSize === 'S' 
                ? 'bg-primary text-white border-primary' 
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
            role="radio"
            aria-checked={selectedSize === 'S'}
            aria-label="Malá pizza - 25 centimetrov"
            tabIndex={selectedSize === 'S' ? 0 : -1}
          >
            S (25cm)
          </button>
          <button 
            onClick={() => handleSizeClick('M')}
            className={`flex-1 px-3 py-2 rounded-md border text-center text-sm font-medium transition-colors ${
              selectedSize === 'M' 
                ? 'bg-primary text-white border-primary' 
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
            role="radio"
            aria-checked={selectedSize === 'M'}
            aria-label="Stredná pizza - 32 centimetrov"
            tabIndex={selectedSize === 'M' ? 0 : -1}
          >
            M (32cm)
          </button>
          <button 
            onClick={() => handleSizeClick('L')}
            className={`flex-1 px-3 py-2 rounded-md border text-center text-sm font-medium transition-colors ${
              selectedSize === 'L' 
                ? 'bg-primary text-white border-primary' 
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
            role="radio"
            aria-checked={selectedSize === 'L'}
            aria-label="Veľká pizza - 40 centimetrov"
            tabIndex={selectedSize === 'L' ? 0 : -1}
          >
            L (40cm)
          </button>
        </div>
      </div>
      
      {/* Ingredients toggle */}
      <div className="mb-6 border border-neutral-100 rounded-lg p-4 bg-neutral-50/50">
        <h4 className="text-sm font-medium text-neutral-700 mb-3" id="ingredients-heading">Ingrediencie</h4>
        <fieldset aria-labelledby="ingredients-heading" className="border-0 p-0 m-0">
          <legend className="sr-only">Vyberte si ingrediencie pre vašu pizzu</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pizza.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center">
                <input 
                  id={`ingredient-${index}`} 
                  type="checkbox" 
                  checked={selectedIngredients.includes(ingredient)} 
                  onChange={() => handleIngredientToggle(ingredient)} 
                  className="w-4 h-4 accent-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Ingrediencia: ${ingredient}`}
                />
                <label htmlFor={`ingredient-${index}`} className="ml-2 text-sm text-neutral-600">
                  {ingredient}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      
      {/* Extra toppings */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 mb-3" id="extras-heading">Extra prísady</h4>
        
        {/* Kategórie extra prísad */}
        <div className="flex flex-wrap mb-3 border-b">
          {extraCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-2 text-sm font-medium transition-all ${
                activeCategory === category.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              aria-selected={activeCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Zobrazenie prísad podľa kategórie */}
        <div 
          className="flex flex-wrap gap-2 mb-2" 
          role="group" 
          aria-labelledby="extras-heading"
        >
          {extraCategories
            .find(category => category.id === activeCategory)?.items
            .map((extra) => (
              <button 
                key={extra.id}
                onClick={() => handleExtraToggle(extra)}
                className={`ingredient-tag px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  isExtraSelected(extra) 
                    ? 'bg-primary/10 text-primary border-primary/30 font-medium' 
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                }`}
                aria-pressed={isExtraSelected(extra)}
                aria-label={`Extra prísada: ${extra.name}, cena: ${extra.price.toFixed(2)}€${isExtraSelected(extra) ? ', vybraté' : ''}`}
              >
                {extra.name} (+{extra.price.toFixed(2)}€)
              </button>
            ))}
        </div>
        
        {/* Vybrané prísady */}
        {selectedExtras.length > 0 && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-md border border-neutral-100">
            <h5 className="text-xs font-medium text-neutral-500 mb-2">Vybrané prísady:</h5>
            <div className="flex flex-wrap gap-1">
              {selectedExtras.map(extra => (
                <div key={extra.id} 
                  className="px-2 py-1 text-xs rounded bg-white border border-neutral-200 flex items-center gap-1"
                >
                  <span>{extra.name}</span>
                  <button 
                    onClick={() => handleExtraToggle(extra)}
                    className="text-neutral-400 hover:text-neutral-700 font-bold"
                    aria-label={`Odstrániť prísadu ${extra.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaCustomization;
