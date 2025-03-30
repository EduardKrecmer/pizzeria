import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PizzaCard from '../components/PizzaCard';
import CategoryFilter from '../components/CategoryFilter';
import { usePizzaStore } from '../store/pizzaStore';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorNotification from '../components/ErrorNotification';
import { Link } from 'react-router-dom';

const Home = () => {
  const { fetchPizzas, fetchExtras, filteredPizzas, isLoading, error } = usePizzaStore();
  const [showError, setShowError] = useState(false);
  const [visiblePizzas, setVisiblePizzas] = useState(6);
  
  useEffect(() => {
    fetchPizzas();
    fetchExtras();
  }, [fetchPizzas, fetchExtras]);
  
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);
  
  const loadMorePizzas = () => {
    setVisiblePizzas(prev => Math.min(prev + 6, filteredPizzas.length));
  };
  
  return (
    <div className="py-8">
      {/* Hero section */}
      <div className="relative bg-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-neutral-900 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16">
              <div className="text-center lg:text-left pb-12 md:pb-16">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Poctivá pizza</span>
                  <span className="block text-primary mt-1">z domácich surovín</span>
                </h1>
                <p className="mt-3 text-base text-neutral-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Vychutnajte si pravú taliansku pizzu priamo u vás doma. Používame iba najkvalitnejšie bio suroviny od lokálnych dodávateľov.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/menu" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10">
                      Objednať teraz
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a href="#menu-section" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-neutral-100 md:py-4 md:text-lg md:px-10">
                      Pozrieť menu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80" alt="Čerstvá pizza z pece" />
        </div>
      </div>

      {/* Menu section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-4">Naše menu</h2>
          <CategoryFilter />
        </div>

        {/* Pizza menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPizzas.slice(0, visiblePizzas).map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>

        {/* Load more button */}
        {visiblePizzas < filteredPizzas.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={loadMorePizzas}
              className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition duration-200 flex items-center"
            >
              Načítať viac
              <ChevronDown className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {isLoading && <LoadingOverlay />}
      {showError && <ErrorNotification message={error || 'Nastala chyba pri načítaní dát'} onClose={() => setShowError(false)} />}
    </div>
  );
};

export default Home;
