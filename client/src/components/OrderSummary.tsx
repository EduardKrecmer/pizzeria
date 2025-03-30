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
      <div className="bg-white rounded-xl shadow-lg p-6" role="region" aria-label="Zhrnutie objednávky">
        <h3 className="text-xl font-heading font-bold mb-4" id="order-summary-title">Zhrnutie objednávky</h3>
        <p className="text-neutral-500 text-center py-6">Váš košík je prázdny</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" role="region" aria-labelledby="order-summary-title">
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-4" id="order-summary-title">Zhrnutie objednávky</h3>
        
        {/* Cart items */}
        <div className="space-y-4 mb-6" role="list" aria-label="Položky v košíku">
          {items.map((item, index) => (
            <div key={index} className="flex items-start" role="listitem">
              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                <img 
                  src={item.image} 
                  alt={`Pizza ${item.name}`} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium" id={`cart-item-${index}-name`}>{item.name}</h4>
                  <p className="text-primary font-medium" aria-label={`Cena: ${(item.price * item.quantity).toFixed(2)}€`}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
                <p className="text-neutral-500 text-sm" aria-label={`Veľkosť: ${item.size}, ${
                  item.size === 'S' ? '25 centimetrov' : item.size === 'M' ? '32 centimetrov' : '40 centimetrov'
                }`}>
                  {item.size} ({
                    item.size === 'S' ? '25cm' : item.size === 'M' ? '32cm' : '40cm'
                  })
                </p>
                
                {/* Display extra ingredients */}
                {item.extras.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs text-neutral-500" id={`extras-heading-${index}`}>Extra prísady:</p>
                    <ul 
                      className="text-xs text-neutral-500 flex flex-wrap gap-x-2" 
                      aria-labelledby={`extras-heading-${index}`}
                    >
                      {item.extras.map((extra, i) => (
                        <li key={i}>
                          {extra.name} (+{extra.price.toFixed(2)}€){i < item.extras.length - 1 ? ',' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-between mt-1">
                  <div className="text-sm text-neutral-500">
                    <span aria-label={`Množstvo: ${item.quantity}`}>Množstvo: {item.quantity}</span>
                  </div>
                  {showControls && (
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-neutral-500 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                      aria-label={`Odstrániť položku ${item.name} z košíka`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price breakdown */}
        <div className="border-t border-neutral-200 pt-4 pb-2" aria-label="Cenový prehľad">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600" id="subtotal-label">Medzisúčet</span>
            <span className="font-medium" aria-labelledby="subtotal-label">{getSubtotal().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600" id="delivery-label">Doprava</span>
            <span className="font-medium" aria-labelledby="delivery-label">{delivery.toFixed(2)}€</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600" id="discount-label">Zľava</span>
              <span className="font-medium text-green-600" aria-labelledby="discount-label">-{discount.toFixed(2)}€</span>
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-lg font-bold" id="total-label">Celková suma</span>
            <span className="text-lg font-bold text-primary" aria-labelledby="total-label">{getTotal().toFixed(2)}€</span>
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4">
            <div className="relative">
              <label htmlFor="discount-code" className="sr-only">Zľavový kód</label>
              <input 
                id="discount-code"
                type="text" 
                placeholder="Zľavový kód" 
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                aria-describedby={discountError ? "discount-error" : undefined}
              />
              <button 
                onClick={handleApplyDiscount}
                className="absolute right-2 top-2 px-3 py-1 bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200 transition duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Použiť zľavový kód"
              >
                Použiť
              </button>
            </div>
            {discountError && (
              <p id="discount-error" className="text-red-500 text-sm mt-1" role="alert">{discountError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
