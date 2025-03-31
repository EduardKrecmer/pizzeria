import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Pizza, CircleDollarSign, Truck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      <div className="bg-white rounded-xl shadow-md p-6 border border-neutral-100" role="region" aria-label="Zhrnutie objednávky">
        <div className="text-center py-8">
          <div className="bg-neutral-50 p-4 rounded-full inline-block mb-4">
            <ShoppingBag className="h-12 w-12 text-neutral-300" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-heading font-bold mb-2" id="order-summary-title">Váš košík je prázdny</h3>
          <p className="text-neutral-500 mb-6">Pridajte si nejakú pizzu do košíka</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Späť na menu
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100" role="region" aria-labelledby="order-summary-title">
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-6 flex items-center" id="order-summary-title">
          <ShoppingBag className="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
          Zhrnutie objednávky
        </h3>
        
        {/* Cart items */}
        <div className="space-y-5 mb-6" role="list" aria-label="Položky v košíku">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-4 pb-4 border-b border-neutral-100 last:border-0" 
              role="listitem"
            >
              <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border border-neutral-100 shadow-sm">
                <img 
                  src={item.image} 
                  alt={`Pizza ${item.name}`} 
                  className="h-full w-full object-cover transition-transform hover:scale-105 duration-300" 
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className="font-medium text-neutral-800 truncate" id={`cart-item-${index}-name`}>{item.name}</h4>
                  <p className="text-primary font-semibold ml-2 whitespace-nowrap" aria-label={`Cena: ${(item.price * item.quantity).toFixed(2)}€`}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs">
                    <Pizza className="h-3 w-3 mr-1 text-neutral-500" aria-hidden="true" />
                    <span aria-label={`Veľkosť: ${item.size}, ${
                      item.size === 'S' ? '25 centimetrov' : item.size === 'M' ? '32 centimetrov' : '40 centimetrov'
                    }`}>
                      {item.size} ({
                        item.size === 'S' ? '25cm' : item.size === 'M' ? '32cm' : '40cm'
                      })
                    </span>
                  </div>
                </div>
                
                {/* Display extra ingredients */}
                {item.extras.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-500" id={`extras-heading-${index}`}>
                      <span className="font-medium">Extra prísady:</span> {item.extras.map((extra, i) => (
                        <span key={i} className="text-neutral-600">
                          {extra.name}{i < item.extras.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  {showControls ? (
                    <div className="flex items-center" role="group" aria-label={`Zmeniť množstvo pre ${item.name}`}>
                      <button 
                        onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-l-md hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:opacity-50"
                        aria-label={`Znížiť množstvo pre ${item.name}`}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center border-t border-b border-neutral-200 text-sm font-medium text-neutral-700 bg-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-r-md hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                        aria-label={`Zvýšiť množstvo pre ${item.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-600 font-medium bg-neutral-50 px-2 py-1 rounded-md">
                      <span aria-label={`Množstvo: ${item.quantity}`}>{item.quantity}×</span>
                    </div>
                  )}
                  
                  {showControls && (
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="p-2 text-neutral-400 hover:text-red-500 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={`Odstrániť položku ${item.name} z košíka`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Price breakdown */}
        <div className="bg-neutral-50 -mx-6 px-6 py-5 rounded-b-xl" aria-label="Cenový prehľad">
          <div className="flex justify-between items-center mb-3">
            <span className="text-neutral-600 flex items-center" id="subtotal-label">
              <Pizza className="w-4 h-4 mr-2 text-neutral-500" aria-hidden="true" />
              <span>Medzisúčet</span>
            </span>
            <span className="font-medium" aria-labelledby="subtotal-label">{getSubtotal().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-neutral-600 flex items-center" id="delivery-label">
              <Truck className="w-4 h-4 mr-2 text-neutral-500" aria-hidden="true" />
              <span>Doprava</span>
            </span>
            <span className="font-medium" aria-labelledby="delivery-label">{delivery.toFixed(2)}€</span>
          </div>
        
          {/* Total */}
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold flex items-center" id="total-label">
                <CircleDollarSign className="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
                <span>Celková suma</span>
              </span>
              <span className="text-xl font-bold text-primary" aria-labelledby="total-label">
                {getTotal().toFixed(2)}€
              </span>
            </div>
            
            {/* Checkout button for mobile */}
            {showControls && (
              <div className="mt-4 sm:hidden">
                <Link 
                  to="/checkout" 
                  className="w-full flex justify-center items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Pokračovať k objednávke
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;