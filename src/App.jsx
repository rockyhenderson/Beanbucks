import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useMediaQuery, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// Components
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import DevToolsPanel from "./components/DevToolsPanel";
import ActiveOrderWidget from "./components/ActiveOrderWidget";
import Toast from "./components/Toast";

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
import ConfirmOrder from "./pages/ConfirmOrder";
import BaristaSecurePortal from "./pages/portal/BaristaSecurePortal";
import ConfirmSuccess from "./pages/ConfirmSuccess";

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
  const [globalToast, setGlobalToast] = useState(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPortalRoute = location.pathname.startsWith("/portal");
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
  useEffect(() => {
    window.showGlobalToast = ({ type, title, message }) => {
      setGlobalToast({ type, title, message });

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setGlobalToast(null);
      }, 4000);
    };
  }, []);

  const shouldShowUI = !isPortalRoute;

  return isAdminRoute && isDesktop ? (
    <div style={{ display: "flex" }}>
      {shouldShowUI && (
        <AdminNavbar
          cartItemCount={cartItemCount}
          setCartItemCount={setCartItemCount}
        />
      )}

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Regular Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItemCount={cartItemCount}
                setCartItemCount={setCartItemCount}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/order/:type"
            element={
              <OrderCategory
                cartItemCount={cartItemCount}
                setCartItemCount={setCartItemCount}
              />
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/store" element={<Store />} />
          <Route path="/rewards" element={<Reward />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/portal/barista" element={<BaristaSecurePortal />} />
          <Route path="/order-success" element={<ConfirmSuccess />} />

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
        {shouldShowUI && <Footer />}
        {shouldShowUI && <DevToolsPanel />}
        {!isAdminRoute &&
          !isPortalRoute &&
          sessionStorage.getItem("activeOrder") && <ActiveOrderWidget />}
      </div>
    </div>
  ) : (
    <>
      {shouldShowUI &&
        (isAdminRoute ? (
          <AdminNavbar />
        ) : (
          <Navbar
            cartItemCount={cartItemCount}
            setCartItemCount={setCartItemCount}
          />
        ))}
      <Routes>
        {/* Regular Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItemCount={cartItemCount}
              setCartItemCount={setCartItemCount}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/portal/barista" element={<BaristaSecurePortal />} />
        <Route
          path="/order/:type"
          element={
            <OrderCategory
              cartItemCount={cartItemCount}
              setCartItemCount={setCartItemCount}
            />
          }
        />
        <Route path="/order-success" element={<ConfirmSuccess />} />
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
      {shouldShowUI && <Footer />}
      {shouldShowUI && <DevToolsPanel />}
      {!isAdminRoute &&
        !isPortalRoute &&
        sessionStorage.getItem("activeOrder") && <ActiveOrderWidget />}
      {globalToast && (
        <Box
          sx={{
            position: "fixed",
            top: "1.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <Toast
            type={globalToast.type}
            title={globalToast.title}
            message={globalToast.message}
            onClose={() => setGlobalToast(null)}
          />
        </Box>
      )}
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
