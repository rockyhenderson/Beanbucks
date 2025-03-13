import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
} from "@mui/material";
import { Menu as MenuIcon, ShoppingCart, AccountCircle, Close as CloseIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";


/**
 * Navbar Component
 * Originally created by React Dev Team - https://react-bootstrap.netlify.app/docs/components/navbar/
 * Modified by Jack Henderson
 */



function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation Links
  const navItems = [
    { text: "Home", path: "/" },
    { text: "Order", path: "/order" },
    { text: "Rewards", path: "/rewards" },
    { text: "Stores", path: "/store" },
    { text: "BeanAdmin", path: "/admin" },
  ];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "black",
          padding: "10px 0",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="lg" sx={{ maxWidth: "1392px" }}>
          <Toolbar sx={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
            {/* MOBILE: Hamburger on Left, Logo Centered, Icons Right */}
            <Box sx={{ display: { xs: "flex", md: "none" }, width: "100%", alignItems: "center" }}>
              {/* Left: Hamburger Menu */}
              <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon fontSize="large" />
              </IconButton>

              {/* Center: Logo */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  flexGrow: 1,
                  textAlign: "center",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                BeanBucks
              </Typography>

              {/* Right: Cart & Profile Icons */}
              <Box sx={{ marginLeft: "auto" }}>
                <IconButton color="inherit" component={Link} to="/cart">
                  <ShoppingCart fontSize="large" />
                </IconButton>
                <IconButton color="inherit" component={Link} to="/profile">
                  <AccountCircle fontSize="large" />
                </IconButton>
              </Box>
            </Box>

            {/* DESKTOP: Logo + Nav Items on Left, Icons on Right */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3, width: "100%" }}>
              {/* Logo */}
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                BeanBucks
              </Typography>

              {/* Navigation Links */}
              <Box sx={{ display: "flex", gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* DESKTOP: Cart & Profile Icons */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCart fontSize="large" />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircle fontSize="large" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer (Full-Screen) */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} sx={{ "& .MuiDrawer-paper": { width: "100vw", height: "100vh" } }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              BeanBucks
            </Typography>
            <IconButton edge="end" onClick={handleDrawerToggle}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List sx={{ marginTop: "20px", textAlign: "center" }}>
            {navItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.path} onClick={handleDrawerToggle}>
                <ListItemText primary={item.text} sx={{ fontSize: "20px", fontWeight: "bold" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
