import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Regular Pages
import Home from './pages/Home';
import Order from './pages/Order';
import Rewards from './pages/Rewards';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

// Admin Page
import BeanAdmin from './pages/admin/BeanAdmin';

// Styles
import './global.css';

// Mapbox
import 'mapbox-gl/dist/mapbox-gl.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<BeanAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
