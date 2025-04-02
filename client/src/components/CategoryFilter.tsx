import { usePizzaStore } from '../store/pizzaStore';
import { Heart, Wheat, Leaf, Pizza } from 'lucide-react';

const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = usePizzaStore();
  
  const categories = [
    { id: 'Všetky', label: 'Všetky', icon: <Pizza className="w-4 h-4" /> },
    { id: 'Obľúbené', label: 'Obľúbené', icon: <Heart className="w-4 h-4" /> },
    { id: 'Klasické', label: 'Klasické', icon: <Wheat className="w-4 h-4" /> },
    { id: 'Vegetariánske', label: 'Vegetariánske', icon: <Leaf className="w-4 h-4" /> }
  ];
  
  return (
    <div 
      className="flex flex-wrap justify-center gap-2 py-2"
      role="region"
      aria-label="Filtrovanie pizze podľa kategórie"
    >
      <div className="sr-only" id="category-group-label">Vyberte kategóriu pizze</div>
      <div 
        role="radiogroup" 
        aria-labelledby="category-group-label"
        className="flex flex-wrap justify-center gap-3 w-full max-w-xl"
      >
        {categories.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`px-5 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${
              activeCategory === id
                ? 'bg-primary/90 border-primary text-white shadow-md'
                : 'bg-white border text-foreground/80 border-primary/10 hover:border-primary/30 hover:bg-primary/5'
            }`}
            role="radio"
            aria-checked={activeCategory === id}
            aria-label={`Kategória: ${label}`}
          >
            <span className={`mr-2 ${activeCategory === id ? 'text-white' : 'text-primary'}`}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
