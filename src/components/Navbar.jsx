import React, { useState, useEffect } from 'react';
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
import { useLocation, Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import DrinkModal from "./DrinkModal";

function Navbar({ cartItemCount, setCartItemCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isLoggedIn = !!user;
  const userRole = user?.role || null;




  // Hide Navbar on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Order", path: "/order" },
    { text: "Rewards", path: "/rewards" },
    { text: "Stores", path: "/store" },
    ...(userRole === "admin" || userRole === "manager"
      ? [{ text: "BeanAdmin", path: "/admin" }]
      : []),
  ];
  useEffect(() => {
    console.log("Navbar mounted, cart item count:", cartItemCount); // Log cart count
  }, [cartItemCount]);


  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "var(--primary)",
          color: "#FFFFFF",
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
            {/* MOBILE */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                width: "100%",
                alignItems: "center",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
              >
                <MenuIcon fontSize="large" />
              </IconButton>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  flexGrow: 1,
                  textAlign: "center",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: { xs: "pre-line", md: "nowrap" },
                  fontFamily: "'Quicksand', sans-serif",
                  letterSpacing: "1px",
                  fontSize: { xs: "32px", sm: "36px", md: "40px", lg: "44px" },
                  color: "#FFF",
                }}
              >
                Bean{"\n"}Bucks
              </Typography>

              <Box
                component={Link}
                to="/cart"
                sx={{
                  position: "relative",
                  display: "inline-block",
                  textDecoration: "none", // Removes blue link style
                }}
              >
                <IconButton
                  sx={{
                    color: location.pathname === "/cart" ? "#FFE7D2" : "#FFFFFF",
                    backgroundColor:
                      location.pathname === "/cart" ? "rgba(255,255,255,0.2)" : "transparent",
                    borderRadius: "50%",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon fontSize="large" />
                </IconButton>

                {cartItemCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      backgroundColor: "#fff",
                      color: "var(--primary)",
                      borderRadius: "50%",
                      minWidth: "24px",
                      height: "24px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {cartItemCount}
                  </Box>
                )}
              </Box>


            </Box>

            {/* DESKTOP */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 3,
                width: "100%",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#FFF",
                }}
              >
                BeanBucks
              </Typography>

              <Box sx={{ display: "flex", gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      fontSize: "16px",
                      fontWeight:
                        location.pathname === item.path ? 900 : "bold",
                      fontFamily: "'Poppins', sans-serif",
                      color: "#FFFFFF",
                      backgroundColor:
                        location.pathname === item.path
                          ? "rgba(255,255,255,0.25)"
                          : "transparent",
                      borderRadius: "20px",
                      px: 2,
                      py: 0.8,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Icons Right (Desktop) */}
            {/* Icons Right (Desktop) */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Box
                component={Link}
                to="/cart"
                sx={{
                  position: "relative",
                  display: "inline-block",
                  textDecoration: "none", // Removes blue link style
                }}
              >
                <IconButton
                  sx={{
                    color: location.pathname === "/cart" ? "#FFE7D2" : "#FFFFFF",
                    backgroundColor:
                      location.pathname === "/cart" ? "rgba(255,255,255,0.2)" : "transparent",
                    borderRadius: "50%",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon fontSize="large" />
                </IconButton>

                {cartItemCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      backgroundColor: "#fff",
                      color: "var(--primary)",
                      borderRadius: "50%",
                      minWidth: "24px",
                      height: "24px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {cartItemCount}
                  </Box>
                )}
              </Box>


              <IconButton
                component={Link}
                to={isLoggedIn ? "/profile" : "/login"}
                sx={{
                  color:
                    location.pathname === "/profile" && isLoggedIn
                      ? "#FFE7D2"
                      : "#FFFFFF",
                  backgroundColor:
                    location.pathname === "/profile" && isLoggedIn
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  borderRadius: "50%",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {isLoggedIn ? (
                  <Person2OutlinedIcon fontSize="large" />
                ) : (
                  <LoginIcon fontSize="large" />
                )}
              </IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100vw",
            height: "100vh",
            backgroundColor: "var(--background)",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            height: "100%",
            paddingX: "36px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "20px",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontFamily: "'Quicksand', sans-serif",
                color: "var(--drawer-text)",
              }}
            >
              BeanBucks
            </Typography>

            <IconButton
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: "var(--drawer-text)", padding: "8px" }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          <List sx={{ padding: 0, marginTop: "10px" }}>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  padding: "14px 18px",
                  fontSize: "22px",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                  fontFamily: "'Quicksand', sans-serif",
                  color:
                    location.pathname === item.path
                      ? "var(--primary)"
                      : "var(--drawer-text)",
                  backgroundColor:
                    location.pathname === item.path
                      ? "var(--drawer-active)"
                      : "transparent",
                  borderRadius: "14px",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "var(--drawer-hover)",
                    color: "var(--primary)",
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Login/Profile Button at Bottom */}
        <Box sx={{ textAlign: "center", marginBottom: "60px" }}>
          <Button
            variant="contained"
            component={Link}
            to={isLoggedIn ? "/profile" : "/login"}
            onClick={handleDrawerToggle}
            sx={{
              width: "80%",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "'Quicksand', sans-serif",
              backgroundColor: "var(--primary)",
              color: "var(--button-text)",
              borderRadius: "25px",
              padding: "12px 0",
              "&:hover": {
                backgroundColor: "#d44f00",
              },
            }}
          >
            {isLoggedIn ? "Profile" : "Login"}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
