import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navItems = [
    { text: "Overview", path: "/admin" },
    { text: "Manage Menu", path: "/admin/menu" },
    { text: "Users", path: "/admin/users" },
    { text: "BaristaPortal", path: "/admin/barista" },
    { text: "Store Options", path: "/admin/stores" },
    { text: "Logs", path: "/admin/logs" },
    { text: "Back to main site", path: "/" },
  ];

  const NavContent = ({ onClick }) => (
    <Box sx={{ padding: "20px", width: "250px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: "'Quicksand', sans-serif",
            color: "var(--primary)",
          }}
        >
          BeanAdmin
        </Typography>
        {isMobile && (
          <IconButton onClick={onClick}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={onClick}
            sx={{
              borderRadius: "12px",
              padding: "12px 18px",
              marginBottom: "8px",
              backgroundColor:
                location.pathname === item.path
                  ? "var(--drawer-active)"
                  : "transparent",
              color:
                location.pathname === item.path
                  ? "var(--primary)"
                  : "var(--drawer-text)",
              "&:hover": {
                backgroundColor: "var(--drawer-hover)",
                color: "var(--primary)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "18px",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* MOBILE - Appbar Toggle */}
      {isMobile && (
        <Box sx={{ padding: "10px 20px", background: "var(--background)" }}>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      )}

      {/* MOBILE Drawer */}
      {isMobile && (
        <Drawer anchor="left" open={open} onClose={toggleDrawer}>
          <NavContent onClick={toggleDrawer} />
        </Drawer>
      )}

      {/* DESKTOP Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: 0,
            width: "250px",
            height: "100vh",
            backgroundColor: "var(--background)",
            borderRight: "1px solid #444",
            boxShadow: "2px 0 6px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <NavContent />
        </Box>
      )}
    </>
  );
}

export default AdminNavbar;
