import { Link } from 'react-router-dom';
import { Plus, Loader2, Pizza as PizzaIcon, AlertCircle } from 'lucide-react';
import { Pizza } from '../types';
import { useCartStore } from '../store/cartStore';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AddToCartNotification from './AddToCartNotification';

interface PizzaCardProps {
  pizza: Pizza;
}

// Fallback obrázok
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300/f5f5f5/e0e0e0?text=Pizza';

const PizzaCard = ({ pizza }: PizzaCardProps) => {
  const { id, name, description, price, image, tags, weight } = pizza;
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    setLoading(true);
    setTimeout(() => {
      addToCart(pizza, 'M', 1, [...pizza.ingredients], []);
      setLoading(false);
      setShowNotification(true);
    }, 300);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoaded(true);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group bg-white rounded-lg border border-border hover:border-primary/20 shadow-sm hover:shadow transition-all duration-300 overflow-hidden flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
      >
        <Link 
          to={`/pizza/${id}`} 
          className="flex flex-col h-full" 
          aria-labelledby={`pizza-${id}-title`}
        >
          <div className="relative overflow-hidden" style={{ paddingBottom: '75%' }}>
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <PizzaIcon className="h-12 w-12 text-primary/30" aria-hidden="true" />
              </div>
            )}
            <img 
              ref={imageRef}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
              src={imageError ? FALLBACK_IMAGE : image} 
              alt={`Pizza ${name}`} 
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-white/90 text-primary font-medium text-sm px-2.5 py-1 rounded-md shadow-sm border border-primary/10">
                {price.toFixed(2)}€
              </span>
            </div>
            
            {/* Bio označenie pre bio pizzu */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bio-tag text-xs px-1.5 py-0.5">
                BIO
              </span>
            </div>
          </div>
          
          <div className="p-4 sm:p-5 flex-grow flex flex-col">
            <h3 
              id={`pizza-${id}-title`} 
              className="text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors duration-200"
            >
              {name}
            </h3>
            
            <div className="flex flex-wrap gap-1.5 mt-2 mb-3" aria-label="Kategórie">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-secondary/10 text-secondary-dark text-xs px-2 py-0.5 rounded-md"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="eco-divider w-12 my-2 opacity-70"></div>
            
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed flex-grow">
              {truncateText(description, 75)}
            </p>
            
            <motion.button 
              onClick={handleAddToCart}
              disabled={loading}
              className="mt-3 w-full px-4 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1"
              aria-label={`Pridať ${name} do košíka`}
              aria-busy={loading}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Pridať do košíka
                </>
              )}
            </motion.button>
          </div>
        </Link>
      </motion.div>
      <AddToCartNotification
        message={`${name} bola pridaná do košíka!`}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default PizzaCard;