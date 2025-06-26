import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PizzaDetail from './pages/PizzaDetail';
import Checkout from './pages/Checkout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Home />} />
      <Route path="/pizza/:id" element={<PizzaDetail />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}