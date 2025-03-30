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
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Pizza className="w-8 h-8 mr-2 text-primary" />
              <h1 className="font-accent text-2xl font-bold text-primary">Pizzeria Janíček</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 font-medium ${location.pathname === '/' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}
            >
              Domov
            </Link>
            <Link 
              to="/menu" 
              className={`px-3 py-2 font-medium ${location.pathname === '/menu' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}
            >
              Menu
            </Link>
            <Link 
              to="/checkout" 
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <Link 
              to="/checkout" 
              className="mr-2 flex items-center p-2 text-primary"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/' 
                ? 'text-primary bg-neutral-100' 
                : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Domov
          </Link>
          <Link 
            to="/menu" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/menu' 
                ? 'text-primary bg-neutral-100' 
                : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Menu
          </Link>
          <Link 
            to="/checkout" 
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Košík
            {cartItemCount > 0 && (
              <span className="ml-1 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
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
