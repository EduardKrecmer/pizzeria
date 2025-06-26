import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Pre Replit prostredie používame štandardné store-y (nie vercel verzie)
// Vercel verzie importujeme len pri nasadení na Vercel
// import './store/pizzaStore.vercel';
// import './store/cartStore.vercel';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);