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
      <Link to={`/pizza/${id}`} className="block">
        <img className="h-48 w-full object-cover" src={image} alt={name} />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-heading font-bold">{name}</h3>
            <span className="text-lg font-semibold text-primary">{price.toFixed(2)}€</span>
          </div>
          <p className="text-neutral-600 mt-2 text-sm">{description}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full"
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
          className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
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
