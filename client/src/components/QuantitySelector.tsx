import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantitySelector = ({
  quantity,
  onChange,
  minQuantity = 1,
  maxQuantity = 10
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
      <button 
        onClick={handleDecrease}
        className="px-3 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition duration-200 disabled:opacity-50"
        disabled={quantity <= minQuantity}
        aria-label="Znížiť množstvo"
      >
        <Minus className="w-5 h-5" />
      </button>
      <input 
        type="number" 
        min={minQuantity} 
        max={maxQuantity} 
        value={quantity} 
        onChange={handleInputChange}
        className="w-12 py-2 text-center border-x border-neutral-300 focus:outline-none"
        aria-label="Množstvo"
      />
      <button 
        onClick={handleIncrease}
        className="px-3 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition duration-200 disabled:opacity-50"
        disabled={quantity >= maxQuantity}
        aria-label="Zvýšiť množstvo"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
