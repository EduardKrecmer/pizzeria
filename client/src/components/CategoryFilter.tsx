import { usePizzaStore } from '../store/pizzaStore';

const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = usePizzaStore();
  
  const categories = ['Všetky', 'Klasické', 'Špeciality', 'Vegetariánske', 'Pikantné'];
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
            activeCategory === category
              ? 'bg-primary text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
