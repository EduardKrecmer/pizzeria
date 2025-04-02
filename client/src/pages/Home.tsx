import { useEffect, useState } from 'react';
import { ChevronDown, ArrowRight, Clock } from 'lucide-react';
import PizzaCard from '../components/PizzaCard';
import CategoryFilter from '../components/CategoryFilter';
import { usePizzaStore } from '../store/pizzaStore';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorNotification from '../components/ErrorNotification';
import OpeningHours from '../components/OpeningHours';
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
    <div>
      {/* Hero section - Bio minimalistická verzia */}
      <div className="relative bg-gradient-to-br from-green-50 via-green-100 to-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5 bg-repeat" 
             style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwODAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')" }}>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto lg:mx-0">
                <span className="bio-tag mb-4 inline-block">100% organické suroviny</span>
                
                <h1 className="text-4xl tracking-normal font-normal text-primary sm:text-5xl md:text-6xl">
                  <span className="block font-accent text-secondary-dark">Bio pizzeria</span>
                  <span className="block text-primary mt-1 font-medium">Poctivá pizza s láskou</span>
                </h1>
                
                <div className="eco-divider w-24 mt-4"></div>
                
                <p className="mt-6 text-base text-foreground/80 sm:text-lg sm:max-w-xl md:text-xl leading-relaxed">
                  Vychutnajte si pravú taliansku pizzu priamo u vás doma. Používame iba najkvalitnejšie <span className="text-primary font-medium">bio suroviny</span> od lokálnych dodávateľov a pečieme v tradičnej peci.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
                  <a href="#menu-section" 
                     className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg md:py-3.5 md:text-lg md:px-10"
                  >
                    Objednať teraz
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                  
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <OpeningHours />
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="bg-green-50 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="bg-primary w-2 h-2 rounded-full mr-2"></span>
                    Bio ingrediencie
                  </span>
                  <span className="bg-green-50 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="bg-primary w-2 h-2 rounded-full mr-2"></span>
                    Pec na drevo
                  </span>
                  <span className="bg-green-50 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="bg-primary w-2 h-2 rounded-full mr-2"></span>
                    Bez konzervantov
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalistický ilustračný element */}
        <div className="absolute right-0 bottom-0 opacity-20 lg:opacity-40 w-96 h-96 -mr-10 -mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-full h-full">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      </div>

      {/* Menu section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center mb-10">
          <div className="text-center mb-8">
            <span className="text-sm text-primary font-medium uppercase tracking-wider">Čerstvé a chutné</span>
            <h2 className="text-3xl font-medium text-foreground mt-2 relative inline-block">
              Naše menu
              <div className="eco-divider w-24 mx-auto mt-3"></div>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Všetky naše pizze sú pripravené z kvalitných bio surovín, bez konzervantov a umelých prísad.
            </p>
          </div>
          <div className="mt-6">
            <CategoryFilter />
          </div>
        </div>

        {/* Pizza menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {isLoading ? (
            // Placeholder skeleton loaders
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))
          ) : (
            // Actual pizza cards
            filteredPizzas.slice(0, visiblePizzas).map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))
          )}
        </div>

        {/* Load more button */}
        {!isLoading && visiblePizzas < filteredPizzas.length && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={loadMorePizzas}
              className="px-6 py-2.5 bg-white border-2 border-primary/20 text-primary rounded-md font-medium hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 shadow-sm"
            >
              Načítať viac
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showError && <ErrorNotification message={error || 'Nastala chyba pri načítaní dát'} onClose={() => setShowError(false)} />}
    </div>
  );
};

export default Home;