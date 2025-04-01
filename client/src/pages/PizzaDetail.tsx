import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Home, ChevronRight } from 'lucide-react';
import { usePizzaStore } from '../store/pizzaStore';
import { useCartStore } from '../store/cartStore';
import PizzaCustomization from '../components/PizzaCustomization';
import QuantitySelector from '../components/QuantitySelector';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorNotification from '../components/ErrorNotification';
import { PizzaSize, Extra } from '../types';

const PizzaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { pizzas, getPizzaById, fetchPizzas, isLoading, error } = usePizzaStore();
  const addToCart = useCartStore(state => state.addToCart);
  
  const [pizza, setPizza] = useState(getPizzaById(Number(id)));
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // Size modifiers
  const SIZES: Record<PizzaSize, number> = {
    'S': -1.00,
    'M': 0,
    'L': 2.00
  };
  
  useEffect(() => {
    if (pizzas.length === 0) {
      fetchPizzas();
    }
  }, [pizzas, fetchPizzas]);
  
  useEffect(() => {
    const currentPizza = getPizzaById(Number(id));
    setPizza(currentPizza);
    
    if (currentPizza) {
      setSelectedIngredients([...currentPizza.ingredients]);
    }
  }, [id, pizzas, getPizzaById]);
  
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);
  
  if (!pizza && !isLoading) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Pizza nebola nájdená</h2>
        <p className="mb-6">Ľutujeme, požadovaná pizza nie je dostupná.</p>
        <Link 
          to="/menu"
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition duration-200"
        >
          Späť na menu
        </Link>
      </div>
    );
  }
  
  const handleSizeChange = (size: PizzaSize) => {
    setSelectedSize(size);
  };
  
  const handleIngredientToggle = (ingredient: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    } else {
      setSelectedIngredients(prev => prev.filter(item => item !== ingredient));
    }
  };
  
  const handleExtraToggle = (extra: Extra, isSelected: boolean) => {
    if (isSelected) {
      setSelectedExtras(prev => [...prev, extra]);
    } else {
      setSelectedExtras(prev => prev.filter(item => item.id !== extra.id));
    }
  };
  
  const handleAddToCart = () => {
    if (pizza) {
      setAdding(true);
      setTimeout(() => {
        addToCart(
          pizza,
          selectedSize,
          quantity,
          selectedIngredients,
          selectedExtras
        );
        setAdding(false);
        navigate('/checkout');
      }, 500);
    }
  };
  
  // Calculate current price with all extras and size modifiers
  const calculateCurrentPrice = () => {
    if (!pizza) return 0;
    
    // Base price with size adjustment
    const basePrice = pizza.price + SIZES[selectedSize];
    
    // Add extra toppings price
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    
    return basePrice + extrasPrice;
  };
  
  // Generate recommended pizzas (3 random pizzas excluding current one)
  const getRecommendedPizzas = () => {
    if (pizzas.length <= 1) return [];
    
    const otherPizzas = pizzas.filter(p => p.id !== Number(id));
    const shuffled = [...otherPizzas].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };
  
  const recommendedPizzas = getRecommendedPizzas();
  const currentPrice = calculateCurrentPrice();
  
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-neutral-600 hover:text-primary">
              <Home className="w-4 h-4 mr-1" />
              Domov
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-neutral-400" />
              <Link to="/menu" className="ml-1 text-neutral-600 hover:text-primary md:ml-2">Menu</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-neutral-400" />
              <span className="ml-1 text-neutral-500 md:ml-2 truncate max-w-[150px] sm:max-w-xs">{pizza?.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {pizza && (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Obrázok pizze */}
              <div className="md:w-2/5 relative">
                <div className="aspect-video md:aspect-auto md:h-full">
                  <img 
                    className="w-full h-full object-cover" 
                    src={pizza.image} 
                    alt={pizza.name}
                    loading="eager"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent md:hidden">
                  <div className="flex flex-wrap gap-1 justify-start">
                    {pizza.tags.map((tag, index) => (
                      <span key={index} className="inline-block bg-white/90 text-neutral-700 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Detail pizze */}
              <div className="p-6 md:w-3/5 md:px-8 flex flex-col">
                <div className="flex justify-between items-start border-b border-neutral-100 pb-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800">{pizza.name}</h2>
                    <div className="hidden md:flex flex-wrap gap-1 mt-2">
                      {pizza.tags.map((tag, index) => (
                        <span key={index} className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-primary">{currentPrice.toFixed(2)}€</span>
                    {currentPrice !== pizza.price && (
                      <div className="text-sm text-neutral-500">
                        Základná cena: {pizza.price.toFixed(2)}€
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Popis pizze */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Popis</h3>
                  <p className="text-neutral-600">{pizza.description}</p>
                  
                  {/* Info o gramáži a alergénoch */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-neutral-500">
                    {pizza.weight && (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Gramáž:</span> {pizza.weight}
                      </div>
                    )}
                    {pizza.allergens && (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Alergény:</span> {pizza.allergens}
                      </div>
                    )}
                  </div>
                </div>

                {/* Prispôsobenie */}
                <div className="flex-grow">
                  <PizzaCustomization 
                    pizza={pizza}
                    onSelectSize={handleSizeChange}
                    onToggleIngredient={handleIngredientToggle}
                    onToggleExtra={handleExtraToggle}
                    selectedSize={selectedSize}
                    selectedIngredients={selectedIngredients}
                    selectedExtras={selectedExtras}
                  />
                </div>

                {/* Quantity and add to cart */}
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-4">
                    <QuantitySelector quantity={quantity} onChange={setQuantity} />
                    <button 
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition duration-200 flex items-center justify-center"
                    >
                      {adding ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Pridať do košíka
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended pizzas */}
          {recommendedPizzas.length > 0 && (
            <div className="mt-12 border-t pt-8 border-neutral-100">
              <h3 className="text-xl font-heading text-neutral-600 mb-4">Mohlo by ti chutiť aj</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedPizzas.map((recPizza) => (
                  <div key={recPizza.id} className="pizza-card bg-white rounded-lg border border-neutral-100 overflow-hidden hover:shadow-sm transition-all">
                    <Link to={`/pizza/${recPizza.id}`} className="block">
                      <div className="flex md:flex-row flex-col h-full">
                        <div className="md:w-1/3 w-full">
                          <img 
                            className="h-24 md:h-full w-full object-cover" 
                            src={recPizza.image} 
                            alt={recPizza.name}
                            loading="lazy" 
                          />
                        </div>
                        <div className="p-3 md:w-2/3 w-full">
                          <div className="flex justify-between items-start">
                            <h3 className="text-base font-heading font-medium">{recPizza.name}</h3>
                            <span className="text-sm font-medium text-primary">{recPizza.price.toFixed(2)}€</span>
                          </div>
                          <p className="text-neutral-500 mt-1 text-xs line-clamp-2">{recPizza.description}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {isLoading && <LoadingOverlay />}
      {showError && <ErrorNotification message={error || 'Nastala chyba pri načítaní dát'} onClose={() => setShowError(false)} />}
    </div>
  );
};

export default PizzaDetail;
