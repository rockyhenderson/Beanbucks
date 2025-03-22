import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function DevToolsPanel() {
  const [open, setOpen] = useState(false);
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const isMobile = useMediaQuery("(max-width: 600px)");

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "40%",
        left: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "row",
        transition: "all 0.3s ease-in-out",
        transform: open ? "translateX(0)" : "translateX(-180px)",
      }}
    >
      {/* Panel */}
      <Box
        sx={{
          width: 180,
          backgroundColor: "#222",
          color: "#FFF",
          padding: "12px",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          boxShadow: "4px 0 12px rgba(0,0,0,0.4)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
        >
          Dev Tools
        </Typography>

        <Button
          variant="contained"
          size="small"
          onClick={toggleTheme}
          sx={{
            width: "100%",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "none",
            backgroundColor: "#FD6100",
            "&:hover": {
              backgroundColor: "#d44f00",
            },
          }}
        >
          Toggle Theme ({isDark ? "Light" : "Dark"})
        </Button>
        <Button
          variant="outlined"
          size="small"
          component="a"
          href="/quarry"
          sx={{
            width: "100%",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "none",
            color: "#FFF",
            borderColor: "#FFF",
            mt: 1,
            "&:hover": {
              borderColor: "#FFE7D2",
              color: "#FFE7D2",
            },
          }}
        >
          Open Quarry
        </Button>
      </Box>

      {/* Toggle Tab */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          borderRadius: "0 8px 8px 0",
          backgroundColor: "#FD6100",
          color: "#FFF",
          ml: "2px",
          height: "48px",
          width: "32px",
          "&:hover": {
            backgroundColor: "#d44f00",
          },
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
}

export default DevToolsPanel;
