import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface OrderSummaryProps {
  showControls?: boolean;
}

const OrderSummary = ({ showControls = true }: OrderSummaryProps) => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity,
    delivery, 
    getSubtotal, 
    getTotal
  } = useCartStore();
  
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
                  {showControls ? (
                    <div className="flex items-center" role="group" aria-label={`Zmeniť množstvo pre ${item.name}`}>
                      <button 
                        onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 text-sm bg-neutral-100 text-neutral-600 rounded-l-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                        aria-label={`Znížiť množstvo pre ${item.name}`}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="px-2 py-1 text-sm border-t border-b border-neutral-200 text-neutral-700">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-2 py-1 text-sm bg-neutral-100 text-neutral-600 rounded-r-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                        aria-label={`Zvýšiť množstvo pre ${item.name}`}
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-500">
                      <span aria-label={`Množstvo: ${item.quantity}`}>Množstvo: {item.quantity}</span>
                    </div>
                  )}
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
        </div>
        
        {/* Total */}
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-lg font-bold" id="total-label">Celková suma</span>
            <span className="text-lg font-bold text-primary" aria-labelledby="total-label">{getTotal().toFixed(2)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
