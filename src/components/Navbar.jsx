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
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
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
        <Container maxWidth="xl" sx={{ maxWidth: "1500px" }}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* MOBILE: Hamburger on Left, Logo Centered, Icons Right */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                width: "100%",
                alignItems: "center",
              }}
            >
              {/* Left: Hamburger Menu */}
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
              >
                <MenuIcon fontSize="large" />
              </IconButton>

              {/* Center: Logo */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  flexGrow: 1,
                  textAlign: "center",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: { xs: "pre-line", md: "nowrap" }, // Splits into two lines on mobile
                  fontFamily: "'Quicksand', sans-serif",
                  letterSpacing: "1px",
                  fontSize: { xs: "32px", sm: "36px", md: "40px", lg: "44px" }, // Responsive font size
                }}
              >
                Bean{"\n"}Bucks
              </Typography>

              {/* Right: Updated Icons */}
              <Box sx={{ marginLeft: "auto", display: "flex" }}>
                <IconButton color="inherit" component={Link} to="/cart">
                  <ShoppingCartOutlinedIcon fontSize="large" />
                </IconButton>
                {/* Hide Profile Icon on Mobile */}
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton color="inherit" component={Link} to="/profile">
                    <Person2OutlinedIcon fontSize="large" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* DESKTOP: Logo + Nav Items on Left, Icons on Right */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 3,
                width: "100%",
              }}
            >
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
                    sx={{ fontSize: "16px", fontWeight: "bold" }} //EDIT THIS FOR FONT SIZE IN NAV
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* DESKTOP: Updated Icons */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCartOutlinedIcon fontSize="large" />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/profile">
                <Person2OutlinedIcon fontSize="large" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer (Full-Screen) */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100vw",
            height: "100vh",
            backgroundColor: "#C8A47E", // Warm coffee brown
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Push content to top and bottom naturally
          },
        }}
      >
        {/* Close Button & Logo */}
        {/* Wrapper for Title, Close Button & Nav Items */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start", // Ensures spacing between top content & login button
            height: "100%", // Takes full height so login stays at bottom
            paddingX: "36px", // Adds side padding
          }}
        >
          {/* Close Button & Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Keeps title and X button spaced properly
              paddingBottom: "20px",
            }}
          >
            {/* Left-Aligned "BeanBucks" */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontFamily: "'Quicksand', sans-serif",
                color: "#5B4233",
              }}
            >
              BeanBucks
            </Typography>

            {/* X Button on Right */}
            <IconButton
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: "#5B4233", padding: "8px" }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Navigation Links Left-Aligned Below "BeanBucks" */}
          <List sx={{ padding: "0", marginTop: "10px" }}>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  padding: "10px 0",
                  fontSize: "20px",
                  fontWeight: "bold",
                  fontFamily: "'Quicksand', sans-serif",
                  textAlign: "left",
                  color: "#5B4233",
                  "&:hover": {
                    backgroundColor: "#A67C52",
                    color: "#FFF5E1",
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Login Button Centered at Bottom */}
        <Box sx={{ textAlign: "center", marginBottom: "60px" }}>
          <Button
            variant="contained"
            component={Link}
            to="/profile"
            onClick={handleDrawerToggle}
            sx={{
              width: "80%", // Makes it properly centered
              fontSize: "20px", // Bigger text for easier readability
              fontWeight: "bold",
              fontFamily: "'Quicksand', sans-serif",
              backgroundColor: "#8D6E63", // Coffee brown
              color: "#FFF5E1", // Soft cream text
              borderRadius: "25px",
              padding: "12px 0",
              "&:hover": {
                backgroundColor: "#6D4C41", // Darker brown on hover
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
//test