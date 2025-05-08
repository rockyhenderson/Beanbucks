
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useMediaQuery } from "@mui/material";

// Components
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import DevToolsPanel from "./components/DevToolsPanel";

// Pages
import Home from "./pages/Home";
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OrderCategory from "./pages/OrderCategory";
import ResetPassword from "./pages/ResetPassword";
import VerifyCode from "./pages/VerifyCode";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Reward from "./pages/Rewards";

// Admin Pages
import BeanAdmin from "./pages/admin/BeanAdmin";
import Quarry from "./pages/admin/Quarry";
import ManageMenu from "./pages/admin/ManageMenu";
import ManageUsers from "./pages/admin/Manageusers";
import BaristaPortal from "./pages/admin/BaristaPortal";
import ManageStores from "./pages/admin/ManageStores";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminStock from "./pages/admin/AdminStock";

// Styles
import "./global.css";
import "mapbox-gl/dist/mapbox-gl.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDesktop = useMediaQuery("(min-width:900px)");

  const getCartItemCount = () => {
    const stored = localStorage.getItem("beanbucks_cart");
    if (!stored) return 0;
    const parsed = JSON.parse(stored);
    const itemCount = parsed.reduce((sum, item) => sum + (item.qty || 1), 0);
    return itemCount;
  };


  const [cartItemCount, setCartItemCount] = useState(getCartItemCount());

  const updateCartItemCount = () => {
    setCartItemCount(getCartItemCount());
  };
  console.log("❌setCartItemCount in AppContent:", setCartItemCount);
  return isAdminRoute && isDesktop ? (
    <div style={{ display: "flex" }}>
      <AdminNavbar cartItemCount={cartItemCount} setCartItemCount={setCartItemCount} />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Regular Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/order/:type"
            element={<OrderCategory cartItemCount={cartItemCount} setCartItemCount={setCartItemCount} />}
          />          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart cartItemCount={cartItemCount} setCartItemCount={setCartItemCount} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/store" element={<Store />} />
          <Route path="/rewards" element={<Reward />} />


          {/* Admin Routes */}
          <Route path="/admin" element={<BeanAdmin />} />
          <Route path="/admin/managemenu" element={<ManageMenu />} />
          <Route path="/admin/manageusers" element={<ManageUsers />} />
          <Route path="/admin/baristaPortal" element={<BaristaPortal />} />
          <Route path="/admin/managestores" element={<ManageStores />} />
          <Route path="/admin/adminlogs" element={<AdminLogs />} />
          <Route path="/admin/adminstock" element={<AdminStock />} />
          <Route path="/quarry" element={<Quarry />} />
        </Routes>
        <Footer />
        <DevToolsPanel />
      </div>
    </div>
  ) : (
    <>
      {isAdminRoute ? (
        <AdminNavbar />
      ) : (
        <Navbar cartItemCount={cartItemCount} setCartItemCount={setCartItemCount} />


      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart cartItemCount={cartItemCount} setCartItemCount={setCartItemCount} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route
            path="/order/:type"
            element={<OrderCategory cartItemCount={cartItemCount} setCartItemCount={setCartItemCount} />}
          />    
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/store" element={<Store />} />
        <Route path="/rewards" element={<Reward />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<BeanAdmin />} />
        <Route path="/admin/managemenu" element={<ManageMenu />} />
        <Route path="/admin/manageusers" element={<ManageUsers />} />
        <Route path="/admin/baristaPortal" element={<BaristaPortal />} />
        <Route path="/admin/managestores" element={<ManageStores />} />
        <Route path="/admin/adminlogs" element={<AdminLogs />} />
        <Route path="/admin/adminstock" element={<AdminStock />} />
        <Route path="/quarry" element={<Quarry />} />
      </Routes>
      <Footer />
      <DevToolsPanel />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
