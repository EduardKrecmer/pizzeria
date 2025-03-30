import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pizza, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore(state => state.items);
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md" aria-label="Hlavná navigácia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" aria-label="Domovská stránka Pizzeria Janíček">
              <Pizza className="w-8 h-8 mr-2 text-primary" aria-hidden="true" />
              <h1 className="font-accent text-2xl font-bold text-primary">Pizzeria Janíček</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4" role="navigation" aria-label="Hlavné menu">
            <Link 
              to="/" 
              className={`px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md ${location.pathname === '/' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Domov
            </Link>
            <Link 
              to="/menu" 
              className={`px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md ${location.pathname === '/menu' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}
              aria-current={location.pathname === '/menu' ? 'page' : undefined}
            >
              Menu
            </Link>
            <Link 
              to="/checkout" 
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Košík s ${cartItemCount} položkami`}
              aria-current={location.pathname === '/checkout' ? 'page' : undefined}
            >
              <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
              <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" aria-hidden="true">
                {cartItemCount}
              </span>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <Link 
              to="/checkout" 
              className="mr-2 flex items-center p-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
              aria-label={`Košík s ${cartItemCount} položkami`}
              aria-current={location.pathname === '/checkout' ? 'page' : undefined}
            >
              <ShoppingCart className="w-6 h-6" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" aria-hidden="true">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
              aria-controls="mobile-menu"
              className="p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        id="mobile-menu" 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}
        role="navigation" 
        aria-label="Mobilné menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              location.pathname === '/' 
                ? 'text-primary bg-neutral-100' 
                : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            Domov
          </Link>
          <Link 
            to="/menu" 
            className={`block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              location.pathname === '/menu' 
                ? 'text-primary bg-neutral-100' 
                : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={location.pathname === '/menu' ? 'page' : undefined}
          >
            Menu
          </Link>
          <Link 
            to="/checkout" 
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={`Košík s ${cartItemCount} položkami`}
            aria-current={location.pathname === '/checkout' ? 'page' : undefined}
          >
            <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
            Košík
            {cartItemCount > 0 && (
              <span className="ml-1 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" aria-hidden="true">
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
