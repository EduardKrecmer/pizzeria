import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface OrderSummaryProps {
  showControls?: boolean;
}

const OrderSummary = ({ showControls = true }: OrderSummaryProps) => {
  const { 
    items, 
    removeFromCart, 
    delivery, 
    discount, 
    getSubtotal, 
    getTotal,
    applyDiscountCode
  } = useCartStore();
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  
  const handleApplyDiscount = () => {
    if (discountCode.trim() === '') {
      setDiscountError('Zadajte zľavový kód');
      return;
    }
    
    const success = applyDiscountCode(discountCode);
    if (!success) {
      setDiscountError('Neplatný zľavový kód');
    } else {
      setDiscountError('');
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-heading font-bold mb-4">Zhrnutie objednávky</h3>
        <p className="text-neutral-500 text-center py-6">Váš košík je prázdny</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-4">Zhrnutie objednávky</h3>
        
        {/* Cart items */}
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-primary font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                </div>
                <p className="text-neutral-500 text-sm">{item.size} ({
                  item.size === 'S' ? '25cm' : item.size === 'M' ? '32cm' : '40cm'
                })</p>
                <div className="flex justify-between mt-1">
                  <div className="text-sm text-neutral-500">
                    <span>Množstvo: {item.quantity}</span>
                  </div>
                  {showControls && (
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-neutral-500 hover:text-neutral-700"
                      aria-label="Odstrániť položku"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price breakdown */}
        <div className="border-t border-neutral-200 pt-4 pb-2">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">Medzisúčet</span>
            <span className="font-medium">{getSubtotal().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">Doprava</span>
            <span className="font-medium">{delivery.toFixed(2)}€</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Zľava</span>
              <span className="font-medium text-green-600">-{discount.toFixed(2)}€</span>
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-lg font-bold">Celková suma</span>
            <span className="text-lg font-bold text-primary">{getTotal().toFixed(2)}€</span>
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Zľavový kód" 
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button 
                onClick={handleApplyDiscount}
                className="absolute right-2 top-2 px-3 py-1 bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200 transition duration-200 text-sm font-medium"
              >
                Použiť
              </button>
            </div>
            {discountError && (
              <p className="text-red-500 text-sm mt-1">{discountError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
