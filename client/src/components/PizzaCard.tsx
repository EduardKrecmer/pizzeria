import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Pizza } from '../types';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard = ({ pizza }: PizzaCardProps) => {
  const { id, name, description, price, image, tags } = pizza;
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Zabrániť prechodu na detail pizza
    e.stopPropagation(); // Zastaviť bubbling
    
    setLoading(true);
    // Pridávame prednastavené možnosti - stredná veľkosť, všetky ingrediencie, žiadne extra
    setTimeout(() => {
      addToCart(pizza, 'M', 1, [...pizza.ingredients], []);
      setLoading(false);
    }, 300);
  };
  
  // Funkcia na skrátenie textu ak je príliš dlhý
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/pizza/${id}`} 
        className="flex flex-col h-full" 
        aria-labelledby={`pizza-${id}-title`}
      >
        <div className="relative overflow-hidden" style={{ paddingBottom: '60%' }}>
          <img 
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} 
            src={image} 
            alt={`Pizza ${name}`} 
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-white bg-opacity-90 text-primary font-bold px-2 py-1 rounded-md shadow-sm">
              {price.toFixed(2)}€
            </span>
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex flex-col mb-2">
            <h3 
              id={`pizza-${id}-title`} 
              className="text-xl font-heading font-bold text-neutral-800 group-hover:text-primary transition-colors duration-200"
            >
              {name}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1 mb-2" aria-label="Kategórie">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-neutral-600 mt-1 text-sm flex-grow">
            {truncateText(description, 100)}
          </p>
          
          <div className="mt-4">
            <button 
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm hover:shadow"
              aria-label={`Pridať ${name} do košíka`}
              aria-busy={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Pridať do košíka
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PizzaCard;
