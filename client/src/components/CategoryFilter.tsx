import { usePizzaStore } from '../store/pizzaStore';
import { Heart, Coffee, Salad, Pizza } from 'lucide-react';

const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = usePizzaStore();
  
  const categories = [
    { id: 'Všetky', label: 'Všetky', icon: <Pizza className="w-4 h-4" /> },
    { id: 'Obľúbené', label: 'Obľúbené', icon: <Heart className="w-4 h-4" /> },
    { id: 'Klasické', label: 'Klasické', icon: <Coffee className="w-4 h-4" /> },
    { id: 'Vegetariánske', label: 'Vegetariánske', icon: <Salad className="w-4 h-4" /> }
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
            className={`px-4 py-2 rounded-full font-medium flex items-center shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              activeCategory === id
                ? 'bg-primary text-white shadow-md scale-105 transform'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:scale-105 hover:shadow'
            }`}
            role="radio"
            aria-checked={activeCategory === id}
            aria-label={`Kategória: ${label}`}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
