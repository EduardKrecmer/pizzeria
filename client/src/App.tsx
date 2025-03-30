import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import PizzaDetail from './pages/PizzaDetail';
import Checkout from './pages/Checkout';
import NotFound from './pages/not-found';
import { usePizzaStore } from './store/pizzaStore';

function App() {
  const { fetchPizzas, fetchExtras } = usePizzaStore();
  
  // Fetch initial data on app load
  useEffect(() => {
    fetchPizzas();
    fetchExtras();
  }, [fetchPizzas, fetchExtras]);
  
  return (
    <BrowserRouter>
      <Navigation />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Home />} />
          <Route path="/pizza/:id" element={<PizzaDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
