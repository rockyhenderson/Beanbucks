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
import RequireRole from "./components/RequireRole";



// Components
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import DevToolsPanel from "./components/DevToolsPanel";
import ActiveOrderWidget from "./components/ActiveOrderWidget";
import Toast from "./components/Toast";
import CookieConsentModal from "./components/CookieConsentModal";


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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";


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


// Main application content container that handles global layout, routing, and shared logic
function AppContent() {
  // Toast state for showing global feedback messages from anywhere in the app
  const [globalToast, setGlobalToast] = useState(null);

  // Get current route to determine if we're on admin or portal views
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPortalRoute = location.pathname.startsWith("/portal");

  // Detect if the screen is large enough to render admin layout
  const isDesktop = useMediaQuery("(min-width:900px)");

  const [showCookieModal, setShowCookieModal] = useState(false);

  // Helper to read the cart from localStorage and count total items
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "true" && consent !== "false") {
      setShowCookieModal(true);
    }
  }, []);

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

  // Expose a global function to trigger toast notifications from anywhere (used by other components)
  useEffect(() => {
    window.showGlobalToast = ({ type, title, message }) => {
      setGlobalToast({ type, title, message });

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setGlobalToast(null);
      }, 4000);
    };
  }, []);

  // Check for a one-time toast stored in sessionStorage (used for redirect flows)
  useEffect(() => {
    const toastData = sessionStorage.getItem("redirectToast");
    if (toastData) {
      setGlobalToast(JSON.parse(toastData));
      sessionStorage.removeItem("redirectToast");
    }
  }, []);

  // Hide navigation and footer on special fullscreen views like the secure barista portal
  const shouldShowUI = !isPortalRoute;

  return isAdminRoute && isDesktop ? (
    // Layout for admin routes on desktop: sidebar + main view
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
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/cookies" element={<CookiePolicy />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <BeanAdmin />
              </RequireRole>
            }
          />
          <Route
            path="/admin/managemenu"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <ManageMenu />
              </RequireRole>
            }
          />
          <Route
            path="/admin/manageusers"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <ManageUsers />
              </RequireRole>
            }
          />
          <Route
            path="/admin/baristaPortal"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <BaristaPortal />
              </RequireRole>
            }
          />
          <Route
            path="/admin/managestores"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <ManageStores />
              </RequireRole>
            }
          />
          <Route
            path="/admin/adminlogs"
            element={
              <RequireRole allowedRoles={["manager"]}>
                <AdminLogs />
              </RequireRole>
            }
          />
          <Route
            path="/admin/adminstock"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <AdminStock />
              </RequireRole>
            }
          />
          <Route path="/quarry" element={<Quarry />} />
        </Routes>
        // Conditionally render footer (hidden on portal views)
        {shouldShowUI && <Footer />}
        {shouldShowUI && <DevToolsPanel />}

        // Show the persistent active order widget for users with ongoing orders
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
        <Route
          path="/portal/barista"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <BaristaSecurePortal />
            </RequireRole>
          }
        />
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
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <BeanAdmin />
            </RequireRole>
          }
        />
        <Route
          path="/admin/managemenu"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <ManageMenu />
            </RequireRole>
          }
        />
        <Route
          path="/admin/manageusers"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <ManageUsers />
            </RequireRole>
          }
        />
        <Route
          path="/admin/baristaPortal"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <BaristaPortal />
            </RequireRole>
          }
        />
        <Route
          path="/admin/managestores"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <ManageStores />
            </RequireRole>
          }
        />
        <Route
          path="/admin/adminlogs"
          element={
            <RequireRole allowedRoles={["manager"]}>
              <AdminLogs />
            </RequireRole>
          }
        />
        <Route
          path="/admin/adminstock"
          element={
            <RequireRole allowedRoles={["admin", "manager"]}>
              <AdminStock />
            </RequireRole>
          }
        />
        <Route path="/quarry" element={<Quarry />} />
      </Routes>
      {shouldShowUI && <Footer />}
      {shouldShowUI && <DevToolsPanel />}
      {!isAdminRoute &&
        !isPortalRoute &&
        sessionStorage.getItem("activeOrder") && <ActiveOrderWidget />}
        
        // Global toast renderer — appears at the top of the screen for 4 seconds
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

      // Show cookie consent modal if the user hasn't made a choice yet
      {showCookieModal && (
        <CookieConsentModal onClose={() => setShowCookieModal(false)} />
      )}
    </>
  );
}

// Wrap everything in React Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>

  );
}

export default App;
