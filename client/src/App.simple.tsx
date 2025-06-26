import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Jednoduchá React aplikácia pre pizzeriu
const pizzaData = [
  {
    id: 1,
    name: "Margherita",
    price: 6.50,
    description: "Klasická talianska pizza s paradajkovým základom, mozzarellou a bazalkou",
    category: "Klasická",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Quattro Formaggi",
    price: 8.90,
    description: "Pizza so štyrmi druhmi syra - mozzarella, gorgonzola, parmezán a ementál",
    category: "Špeciálna",
    image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Prosciutto e Funghi",
    price: 7.90,
    description: "Pizza so šunkou a hubami na paradajkovom základe s mozzarellou",
    category: "Klasická",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    name: "Diavola",
    price: 7.90,
    description: "Pikantná pizza s klobásou, čili papričkami a mozzarellou",
    category: "Pikantná",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

// Reprezentácia položky v košíku
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

// Hlavný komponent aplikácie
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pizza/:id" element={<PizzaDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Komponent pre navigačný panel
function Header() {
  const [cartCount, setCartCount] = useState(0);
  
  // Sledovanie zmien v košíku
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    setCartCount(count);
    
    // Event listener pre zmeny v košíku
    const handleCartChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCount = updatedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      setCartCount(updatedCount);
    };
    
    window.addEventListener('cartUpdated', handleCartChange);
    return () => window.removeEventListener('cartUpdated', handleCartChange);
  }, []);
  
  return (
    <header className="header py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">Pizza Donáška</a>
        <nav className="flex space-x-6 items-center">
          <a href="/" className="text-white hover:text-gray-200">Domov</a>
          <a href="/#menu" className="text-white hover:text-gray-200">Menu</a>
          <a href="/cart" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-gray-900 font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
        </nav>
      </div>
    </header>
  );
}

// Komponent pre úvodnú stránku s pizzami
function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Vitajte v našej pizzerii</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pripravujeme pre vás tie najchutnejšie pizze z kvalitných surovín. 
            Každá pizza je pripravená s láskou a pečená v tradičnej peci.
          </p>
        </div>

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
              alt="Pizza hero" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Rozvoz v celom meste</h2>
            <p className="text-gray-600 mb-6">
              Doručíme vám čerstvú a horúcu pizzu kam potrebujete. 
              Pri objednávke 2 a viac pizz je dovoz zadarmo!
            </p>
            <a href="#menu" className="btn-primary self-start">Objednať teraz</a>
          </div>
        </div>
      </section>

      <section id="menu" className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Naše menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pizzaData.map(pizza => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Komponent pre kartu pizze
function PizzaCard({ pizza }: { pizza: any }) {
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: CartItem) => item.id === pizza.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${pizza.name} pridaná do košíka!`);
  }
  
  return (
    <div className="pizza-card bg-white">
      <img 
        src={pizza.image} 
        alt={pizza.name} 
        className="w-full pizza-img"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl">{pizza.name}</h3>
          <span className="font-bold">{pizza.price.toFixed(2)} €</span>
        </div>
        <div className="mb-2">
          <span className="category-badge">{pizza.category}</span>
        </div>
        <p className="text-gray-600 mb-4 text-sm">{pizza.description}</p>
        <div className="flex justify-between">
          <a href={`/pizza/${pizza.id}`} className="text-blue-600 hover:underline text-sm">
            Detail
          </a>
          <button 
            onClick={addToCart}
            className="btn-primary text-sm"
          >
            Pridať do košíka
          </button>
        </div>
      </div>
    </div>
  );
}

// Detail pizze
function PizzaDetailPage() {
  const [pizza, setPizza] = useState<any>(null);
  
  useEffect(() => {
    const id = parseInt(window.location.pathname.split('/').pop() || '1');
    const foundPizza = pizzaData.find(p => p.id === id);
    setPizza(foundPizza);
  }, []);
  
  if (!pizza) {
    return <div className="container mx-auto py-8 px-4 text-center">Načítavam pizzu...</div>;
  }
  
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: CartItem) => item.id === pizza.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${pizza.name} pridaná do košíka!`);
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={pizza.image} 
              alt={pizza.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4">{pizza.name}</h1>
            <div className="mb-4">
              <span className="category-badge">{pizza.category}</span>
            </div>
            <p className="text-gray-600 mb-6">{pizza.description}</p>
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold">{pizza.price.toFixed(2)} €</span>
              <button 
                onClick={addToCart}
                className="btn-primary"
              >
                Pridať do košíka
              </button>
            </div>
            <a href="/" className="text-blue-600 hover:underline">
              &larr; Späť na menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stránka s košíkom
function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);
  
  function updateQuantity(id: number, newQuantity: number) {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
  
  function removeItem(id: number) {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
  
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 0 : 1.50;
  const finalPrice = totalPrice + deliveryFee;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Váš košík</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">Váš košík je prázdny.</p>
          <a href="/" className="btn-primary inline-block">Vrátiť sa do menu</a>
        </div>
      ) : (
        <div className="md:flex md:space-x-6">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">Pizza</th>
                    <th className="text-center p-4">Cena</th>
                    <th className="text-center p-4">Množstvo</th>
                    <th className="text-right p-4">Spolu</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="p-4">{item.name}</td>
                      <td className="p-4 text-center">{item.price.toFixed(2)} €</td>
                      <td className="p-4">
                        <div className="flex justify-center items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">{(item.price * item.quantity).toFixed(2)} €</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Súhrn objednávky</h2>
              <div className="flex justify-between mb-2">
                <span>Medzisúčet:</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Doprava:</span>
                <span>{deliveryFee > 0 ? `${deliveryFee.toFixed(2)} €` : 'Zadarmo'}</span>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Celkom:</span>
                  <span>{finalPrice.toFixed(2)} €</span>
                </div>
              </div>
              <a href="/checkout" className="btn-primary block text-center">
                Pokračovať k pokladni
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stránka pre dokončenie objednávky
function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Púchov',
    street: '',
    houseNumber: '',
    note: '',
    pickup: false
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    
    if (cart.length === 0) {
      window.location.href = '/';
    }
  }, []);
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }
  
  function validateForm() {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Zadajte vaše meno';
    
    const phoneRegex = /^(0|\+421)\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Zadajte platné telefónne číslo (napr. 0915 123 456 alebo +421915123456)';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Zadajte platnú e-mailovú adresu';
    }
    
    if (!formData.pickup) {
      if (!formData.street.trim()) newErrors.street = 'Zadajte ulicu';
      if (!formData.houseNumber.trim()) newErrors.houseNumber = 'Zadajte číslo domu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulácia odoslania objednávky
      alert('Vaša objednávka bola úspešne odoslaná!');
      
      // Vymazanie košíka
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Presmerovanie na úvodnú stránku
      window.location.href = '/';
    }
  }
  
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = formData.pickup ? 0 : (cartItems.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 0 : 1.50);
  const finalPrice = totalPrice + deliveryFee;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dokončenie objednávky</h1>
      
      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Dodacie údaje</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2">
                  <input 
                    type="checkbox" 
                    name="pickup" 
                    checked={formData.pickup}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Vyzdvihnem si osobne na prevádzke
                </label>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">Meno a priezvisko *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Telefón *</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0915 123 456"
                    className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">E-mail (voliteľný)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              {!formData.pickup && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Mesto</label>
                    <select 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="Púchov">Púchov</option>
                      <option value="Streženice">Streženice</option>
                      <option value="Dolné Kočkovce">Dolné Kočkovce</option>
                      <option value="Horné Kočkovce">Horné Kočkovce</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Ulica *</label>
                      <input 
                        type="text" 
                        name="street" 
                        value={formData.street}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Číslo domu *</label>
                      <input 
                        type="text" 
                        name="houseNumber" 
                        value={formData.houseNumber}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${errors.houseNumber ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
                    </div>
                  </div>
                </>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-1">Poznámka k objednávke</label>
                <textarea 
                  name="note" 
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="btn-primary w-full py-3"
              >
                Dokončiť objednávku
              </button>
            </form>
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Vaša objednávka</h2>
            
            <div className="border-b pb-4 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mb-2">
              <span>Medzisúčet:</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Doprava:</span>
              <span>{formData.pickup ? 'Osobný odber' : (deliveryFee > 0 ? `${deliveryFee.toFixed(2)} €` : 'Zadarmo')}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Celkom:</span>
                <span>{finalPrice.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Päta stránky
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4">Pizza Donáška</h3>
            <p className="mb-2">Námestie 1, Púchov</p>
            <p className="mb-2">Telefón: 0915 123 456</p>
            <p>Email: info@pizzadonaska.sk</p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4">Otváracie hodiny</h3>
            <p className="mb-2">Pondelok - Piatok: 10:00 - 22:00</p>
            <p className="mb-2">Sobota: 11:00 - 23:00</p>
            <p>Nedeľa: 12:00 - 22:00</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Sledujte nás</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="hover:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          &copy; {new Date().getFullYear()} Pizza Donáška. Všetky práva vyhradené.
        </div>
      </div>
    </footer>
  );
}

export default App;