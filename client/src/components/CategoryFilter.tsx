import { usePizzaStore } from '../store/pizzaStore';

const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = usePizzaStore();
  
  const categories = ['Všetky', 'Klasické', 'Špeciality', 'Vegetariánske', 'Pikantné', 'Sladké', 'Ryby', 'Prémiové'];
  
  return (
    <div 
      className="flex flex-wrap justify-center gap-2"
      role="region"
      aria-label="Filtrovanie pizze podľa kategórie"
    >
      <div className="sr-only" id="category-group-label">Vyberte kategóriu pizze</div>
      <div 
        role="radiogroup" 
        aria-labelledby="category-group-label"
        className="flex flex-wrap justify-center gap-2"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
            role="radio"
            aria-checked={activeCategory === category}
            aria-label={`Kategória: ${category}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
