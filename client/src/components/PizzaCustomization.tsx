import { useState, useEffect } from 'react';
import { Pizza, Extra, PizzaSize } from '../types';
import { usePizzaStore } from '../store/pizzaStore';

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
      <h3 className="text-lg font-semibold mb-3">Prispôsob si svoju pizzu</h3>
      
      {/* Size selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Veľkosť</h4>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleSizeClick('S')}
            className={`px-4 py-2 rounded-lg border border-primary font-medium transition-colors ${
              selectedSize === 'S' 
                ? 'bg-primary text-white' 
                : 'text-primary hover:bg-primary hover:text-white'
            }`}
          >
            S (25cm)
          </button>
          <button 
            onClick={() => handleSizeClick('M')}
            className={`px-4 py-2 rounded-lg border border-primary font-medium transition-colors ${
              selectedSize === 'M' 
                ? 'bg-primary text-white' 
                : 'text-primary hover:bg-primary hover:text-white'
            }`}
          >
            M (32cm)
          </button>
          <button 
            onClick={() => handleSizeClick('L')}
            className={`px-4 py-2 rounded-lg border border-primary font-medium transition-colors ${
              selectedSize === 'L' 
                ? 'bg-primary text-white' 
                : 'text-primary hover:bg-primary hover:text-white'
            }`}
          >
            L (40cm)
          </button>
        </div>
      </div>
      
      {/* Ingredients toggle */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Ingrediencie</h4>
        <div className="grid grid-cols-2 gap-2">
          {pizza.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center">
              <input 
                id={`ingredient-${index}`} 
                type="checkbox" 
                checked={selectedIngredients.includes(ingredient)} 
                onChange={() => handleIngredientToggle(ingredient)} 
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor={`ingredient-${index}`} className="ml-2 text-sm text-neutral-600">
                {ingredient}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Extra toppings */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Extra prísady</h4>
        <div className="flex flex-wrap gap-2">
          {extras.map((extra) => (
            <button 
              key={extra.id}
              onClick={() => handleExtraToggle(extra)}
              className={`ingredient-tag px-3 py-1 text-sm rounded-full transition-colors ${
                isExtraSelected(extra) 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {extra.name} (+{extra.price.toFixed(2)}€)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomization;
