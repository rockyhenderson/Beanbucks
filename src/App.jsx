import React from "react";
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
import DevToolsPanel from "./components/DevToolsPanel";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

// Regular Pages
import Home from "./pages/Home";
import Order from "./pages/Order";
import Rewards from "./pages/Rewards";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OrderCategory from "./pages/OrderCategory";
import ResetPassword from "./pages/ResetPassword"; // 
import VerifyCode from "./pages/VerifyCode";
import AdminStock from "./pages/admin/AdminStock"; 

// Admin Pages
import BeanAdmin from "./pages/admin/BeanAdmin";
import Quarry from "./pages/admin/Quarry";
import ManageMenu from "./pages/admin/ManageMenu";
import ManageUsers from "./pages/admin/Manageusers";
import BaristaPortal from "./pages/admin/BaristaPortal";
import ManageStores from "./pages/admin/ManageStores";
import AdminLogs from "./pages/admin/AdminLogs";

// Styles
import "./global.css";
import "mapbox-gl/dist/mapbox-gl.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDesktop = useMediaQuery("(min-width:900px)");

  return isAdminRoute && isDesktop ? (
    <div style={{ display: "flex" }}>
      <AdminNavbar />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Regular Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/store" element={<Store />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order/:type" element={<OrderCategory />} />
          <Route path="/reset-password" element={<ResetPassword />} /> 
          <Route path="/verify-code" element={<VerifyCode />} /> 

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
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Routes>
        {/* Regular Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order/:type" element={<OrderCategory />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/verify-code" element={<VerifyCode />} />

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
