import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Pizza, Euro, Truck, AlertCircle, Edit3 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import EditCartItem from './EditCartItem';

interface OrderSummaryProps {
  showControls?: boolean;
}

const OrderSummary = ({ showControls = true }: OrderSummaryProps) => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal, 
    getDeliveryFee,
    getTotal,
    customerInfo
  } = useCartStore();
  
  const [editingItem, setEditingItem] = useState<{ item: any; index: number } | null>(null);
  
  // Funkcia na získanie minimálnej hodnoty objednávky pre danú lokalitu
  const getMinimumOrderValue = useMemo(() => {
    // Ak nemáme informácie o zákazníkovi alebo je vybratý osobný odber, nevyžadujeme minimum
    if (!customerInfo || customerInfo.deliveryType === 'PICKUP') {
      return 0;
    }

    // Pre lokality, ktoré vyžadujú vyššiu minimálnu hodnotu objednávky
    if ((customerInfo.city === 'Púchov' && customerInfo.cityPart === 'Čertov') || 
        customerInfo.cityPart === 'Hoštiná' ||
        (customerInfo.city === 'Lazy pod Makytou' && customerInfo.cityPart === 'Čertov')) {
      return 20; // 20€ pre vzdialenejšie lokality
    }
    
    // Pre obec Púchov a všetky jej časti (okrem Čertov)
    if (customerInfo.city === 'Púchov') {
      return 15; // 15€ pre mesto Púchov
    }
    
    return 0; // Pre ostatné lokality nemáme minimum
  }, [customerInfo]);
  
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
            Späť na naše menu
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
              <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border border-neutral-100 shadow-sm bg-neutral-50 flex items-center justify-center">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={`Pizza ${item.name}`} 
                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-300" 
                    loading="lazy"
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
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-neutral-800 truncate" id={`cart-item-${index}-name`}>{item.name}</h4>
                      {showControls && (
                        <button
                          onClick={() => setEditingItem({ item, index })}
                          className="p-1 text-neutral-400 hover:text-primary rounded transition-colors"
                          title="Upraviť pizzu"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-primary font-semibold ml-2 whitespace-nowrap" aria-label={`Cena: ${(item.price * item.quantity).toFixed(2)}€`}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs">
                    <Pizza className="h-3 w-3 mr-1 text-neutral-500" aria-hidden="true" />
                    <span>
                      {item.size === 'REGULAR' ? 'Klasická' : 
                       item.size === 'CREAM' ? 'Smotanový základ' :
                       item.size === 'GLUTEN_FREE' ? 'Bezlepková' :
                       item.size === 'VEGAN' ? 'Vegánska mozzarella' : 'Hrubé cesto'}
                    </span>
                  </div>
                </div>
                
                {/* Display extra ingredients */}
                {item.extras && item.extras.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-500" id={`extras-heading-${index}`}>
                      <span className="font-medium">Extra prísady:</span> {item.extras.map((extra, i) => (
                        <span key={`${extra.category}-${extra.id}-${i}`} className="text-neutral-600">
                          {extra.name}{extra.amount && <span className="text-neutral-400"> ({extra.amount})</span>}{i < item.extras.length - 1 ? ', ' : ''}
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
            <span className="font-medium" aria-labelledby="subtotal-label">
              {getSubtotal().toFixed(2)}€
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-neutral-600 flex items-center" id="delivery-label">
              <Truck className="w-4 h-4 mr-2 text-neutral-500" aria-hidden="true" />
              <span>Doprava</span>
            </span>
            {getDeliveryFee() > 0 ? (
              <span className="font-medium" aria-labelledby="delivery-label">
                {getDeliveryFee().toFixed(2)}€
              </span>
            ) : (
              <span className="font-medium text-green-600" aria-labelledby="delivery-label">Zadarmo</span>
            )}
          </div>
        
          {/* Total */}
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold flex items-center" id="total-label">
                <Euro className="w-5 h-5 mr-2 text-primary" aria-hidden="true" />
                <span>Celková suma</span>
              </span>
              <span className="text-xl font-bold text-primary" aria-labelledby="total-label">
                {getTotal().toFixed(2)}€
              </span>
            </div>
            
            {/* Zobrazenie upozornenia o minimálnej hodnote objednávky */}
            {customerInfo && customerInfo.deliveryType === 'DELIVERY' && getMinimumOrderValue > 0 && getTotal() < getMinimumOrderValue && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Nedostatočná hodnota objednávky</p>
                    <p className="text-sm text-amber-700">
                      {(() => {
                        if ((customerInfo.city === 'Púchov' && customerInfo.cityPart === 'Čertov') || customerInfo.cityPart === 'Hoštiná') {
                          return `Pre časť obce ${customerInfo.cityPart} je minimálna hodnota objednávky ${getMinimumOrderValue}€`;
                        } else if (customerInfo.city === 'Lazy pod Makytou' && customerInfo.cityPart === 'Čertov') {
                          return `Pre oblasť Čertov (obec Lazy pod Makytou) je minimálna hodnota objednávky ${getMinimumOrderValue}€`;
                        } else if (customerInfo.city === 'Púchov') {
                          return `Pre obec Púchov je minimálna hodnota objednávky ${getMinimumOrderValue}€`;
                        }
                        return '';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Checkout button for mobile */}
            {showControls ? (
              <div className="mt-4 sm:hidden">
                <Link 
                  to="/checkout" 
                  className="w-full flex justify-center items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Pokračovať v objednávke
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <Link 
                  to="/" 
                  className="w-full flex justify-center items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => {
                    // Scroll to menu section when navigating back
                    setTimeout(() => {
                      const menuSection = document.getElementById('menu-section');
                      if (menuSection) {
                        menuSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                >
                  Pokračovať v objednávke
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit modal */}
      {editingItem && (
        <EditCartItem
          item={editingItem.item}
          itemIndex={editingItem.index}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default OrderSummary;