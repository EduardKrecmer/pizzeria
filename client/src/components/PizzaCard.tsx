import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { Pizza } from '../types';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import LoadingOverlay from './LoadingOverlay';

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard = ({ pizza }: PizzaCardProps) => {
  const { id, name, description, price, image, tags } = pizza;
  const [loading, setLoading] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);
  
  const handleAddToCart = () => {
    setLoading(true);
    // Adding default options - medium size, all ingredients, no extras
    setTimeout(() => {
      addToCart(pizza, 'M', 1, [...pizza.ingredients], []);
      setLoading(false);
    }, 500);
  };
  
  return (
    <div className="pizza-card bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover">
      <Link 
        to={`/pizza/${id}`} 
        className="block" 
        aria-labelledby={`pizza-${id}-title`}
      >
        <img 
          className="h-48 w-full object-cover" 
          src={image} 
          alt={`Pizza ${name}`} 
        />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 id={`pizza-${id}-title`} className="text-xl font-heading font-bold">{name}</h3>
            <span className="text-lg font-semibold text-primary" aria-label={`Cena: ${price.toFixed(2)}€`}>{price.toFixed(2)}€</span>
          </div>
          <p className="text-neutral-600 mt-2 text-sm">{description}</p>
          <div className="flex flex-wrap gap-1 mt-3" aria-label="Kategórie">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full"
                role="listitem"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 pt-2">
        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`Pridať ${name} do košíka`}
          aria-busy={loading}
        >
          {loading ? (
            <div className="loading-spinner" aria-hidden="true"></div>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Pridať do košíka
            </>
          )}
        </button>
      </div>
      
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default PizzaCard;
