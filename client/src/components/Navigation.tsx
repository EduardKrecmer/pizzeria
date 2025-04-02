import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pizza as PizzaIcon, ShoppingCart, X, Menu, Leaf } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore(state => state.items);
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Sledovanie scrollovania pre efekt na navigácii
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Zavrieť mobilné menu po zmene lokácie
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 safe-top ${
        isScrolled 
          ? 'bg-white/95 shadow-sm backdrop-blur-sm border-b border-border' 
          : 'bg-transparent'
      }`} 
      aria-label="Hlavná navigácia"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-shrink-0 flex items-center gap-2" 
              aria-label="Domovská stránka Pizzeria Janíček"
            >
              <div className="relative flex items-center justify-center">
                <PizzaIcon className="w-8 h-8 text-primary" aria-hidden="true" />
                <Leaf className="absolute w-3 h-3 text-accent-dark -right-0.5 -top-0.5" aria-hidden="true" />
              </div>
              <h1 className="font-accent text-2xl text-primary">Pizzeria <span className="text-secondary-dark">Janíček</span></h1>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Hlavné menu">
            <Link 
              to="/menu" 
              className={`px-3 py-2 font-medium transition duration-200 ease-in-out hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded-md ${
                location.pathname === '/menu' ? 'text-primary' : 'text-foreground/80'
              }`}
              aria-current={location.pathname === '/menu' ? 'page' : undefined}
            >
              Menu
            </Link>
            <Link 
              to="/checkout" 
              className="flex items-center gap-2 px-4 py-2 bg-primary/90 text-white rounded-md font-medium border border-primary hover:bg-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1"
              aria-label={`Košík s ${cartItemCount} položkami`}
              aria-current={location.pathname === '/checkout' ? 'page' : undefined}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium" aria-hidden="true">
                {cartItemCount}
              </span>
            </Link>
          </div>
          
          {/* Mobile controls */}
          <div className="md:hidden flex items-center">
            <Link 
              to="/checkout" 
              className="mr-3 flex items-center p-1.5 text-primary relative focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded-md"
              aria-label={`Košík s ${cartItemCount} položkami`}
              aria-current={location.pathname === '/checkout' ? 'page' : undefined}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium border border-white" aria-hidden="true">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
              aria-controls="mobile-menu"
              className="p-1.5 rounded-md text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        id="mobile-menu" 
        className={`${mobileMenuOpen ? 'max-h-60' : 'max-h-0'} md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-border`}
        role="navigation" 
        aria-label="Mobilné menu"
      >
        <div className="px-4 py-3 space-y-2">
          <Link 
            to="/menu" 
            className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${
              location.pathname === '/menu' 
                ? 'text-primary bg-primary/5' 
                : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={location.pathname === '/menu' ? 'page' : undefined}
          >
            Menu
          </Link>
          <Link 
            to="/checkout" 
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white bg-primary/90 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={`Košík s ${cartItemCount} položkami`}
            aria-current={location.pathname === '/checkout' ? 'page' : undefined}
          >
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
              Košík
            </div>
            {cartItemCount > 0 && (
              <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium" aria-hidden="true">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
