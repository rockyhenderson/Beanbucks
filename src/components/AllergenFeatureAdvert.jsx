import React, { useState } from "react";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import Collapse from "@mui/material/Collapse";

function AllergenFeatureSection() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [expanded, setExpanded] = useState({
    allergen: false,
    reorder: false,
    featured: false
  });

  const toggleExpand = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isSmallScreen) {
    return (
      <Box sx={{ my: 4, px: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Allergy-Safe Filtering */}
        <Box sx={{ 
          backgroundColor: "#fff7e6",
          borderRadius: "24px",
          px: 3,
          py: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              component="img"
              src="/img/allergenimg.png"
              alt="Allergy Icon"
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: "#4A2C2A",
              fontSize: "1.1rem" // Smaller title size
            }}>
              Allergy-Safe
            </Typography>
          </Box>
  
          <Collapse in={expanded.allergen}>
            <Typography sx={{ color: "#5A4A42", fontSize: "0.9rem", mb: 1.5 }}>
              Choose your dietary needs and we'll help you find drinks that fit.
            </Typography>
            <Box component="ul" sx={{ 
              textAlign: "left", 
              fontSize: "0.85rem", 
              color: "#6c4b3b", 
              pl: 2, 
              mb: 1.5,
              listStyleType: "none",
              '& li': {
                position: 'relative',
                pl: '1.2em',
                mb: '0.3em',
                '&:before': {
                  content: '"•"',
                  position: 'absolute',
                  left: 0,
                  color: '#ee5c01'
                }
              }
            }}>
              <li>Set filters in your profile</li>
              <li>Hide ingredients you avoid</li>
              <li>Safe choices across the app</li>
            </Box>
          </Collapse>
  
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              href="/profile/preferences"
              sx={{
                backgroundColor: "#ee5c01",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "999px",
                textTransform: "none",
                py: 0.5,
                fontSize: "0.8rem", // Smaller font size
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap', // Prevent text wrapping
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Set Prefs
            </Button>
            <Button
              onClick={() => toggleExpand("allergen")}
              sx={{
                border: "2px solid #ee5c01",
                color: "#ee5c01",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 500,
                py: 0.5,
                fontSize: "0.8rem", // Smaller font size
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {expanded.allergen ? "Less" : "More"}
            </Button>
          </Box>
        </Box>
  
        {/* Quick Reorder */}
        <Box sx={{ 
          backgroundColor: "#e6f4ff",
          borderRadius: "24px",
          px: 3,
          py: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              component="img"
              src="/img/coffeeReorder.png"
              alt="Reorder Icon"
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: "#1a3c5c",
              fontSize: "1.1rem" // Smaller title size
            }}>
              Quick Reorder
            </Typography>
          </Box>
  
          <Collapse in={expanded.reorder}>
            <Typography sx={{ color: "#324c63", fontSize: "0.9rem", mb: 1.5 }}>
              Loved your last order? Bring it back in one click.
            </Typography>
            <Box component="ul" sx={{ 
              textAlign: "left", 
              fontSize: "0.85rem", 
              color: "#3d5466", 
              pl: 2, 
              mb: 1.5,
              listStyleType: "none",
              '& li': {
                position: 'relative',
                pl: '1.2em',
                mb: '0.3em',
                '&:before': {
                  content: '"•"',
                  position: 'absolute',
                  left: 0,
                  color: '#007bba'
                }
              }
            }}>
              <li>Repeat favorite drinks</li>
              <li>Saves customizations</li>
              <li>No rebuilding needed</li>
            </Box>
          </Collapse>
  
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              href="/profile/history"
              sx={{
                backgroundColor: "#007bba",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "999px",
                textTransform: "none",
                py: 0.5,
                fontSize: "0.8rem",
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Reorder
            </Button>
            <Button
              onClick={() => toggleExpand("reorder")}
              sx={{
                border: "2px solid #007bba",
                color: "#007bba",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 500,
                py: 0.5,
                fontSize: "0.8rem",
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {expanded.reorder ? "Less" : "More"}
            </Button>
          </Box>
        </Box>
  
        {/* Featured Drinks */}
        <Box sx={{ 
          backgroundColor: "#ffedf2",
          borderRadius: "24px",
          px: 3,
          py: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              component="img"
              src="/img/featureddrink.png"
              alt="Featured Icon"
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: "#7b2434",
              fontSize: "1.1rem" // Smaller title size
            }}>
              Featured
            </Typography>
          </Box>
  
          <Collapse in={expanded.featured}>
            <Typography sx={{ color: "#853947", fontSize: "0.9rem", mb: 1.5 }}>
              Weekly spotlight of fan-favorite seasonal drinks.
            </Typography>
            <Box component="ul" sx={{ 
              textAlign: "left", 
              fontSize: "0.85rem", 
              color: "#853947", 
              pl: 2, 
              mb: 1.5,
              listStyleType: "none",
              '& li': {
                position: 'relative',
                pl: '1.2em',
                mb: '0.3em',
                '&:before': {
                  content: '"•"',
                  position: 'absolute',
                  left: 0,
                  color: '#e53961'
                }
              }
            }}>
              <li>Handpicked top drinks</li>
              <li>Rotates weekly</li>
              <li>Limited time only</li>
            </Box>
          </Collapse>
  
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              href="/menu/featured"
              sx={{
                backgroundColor: "#e53961",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "999px",
                textTransform: "none",
                py: 0.5,
                fontSize: "0.8rem",
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              See Featured
            </Button>
            <Button
              onClick={() => toggleExpand("featured")}
              sx={{
                border: "2px solid #e53961",
                color: "#e53961",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 500,
                py: 0.5,
                fontSize: "0.8rem",
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {expanded.featured ? "Less" : "More"}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // ✅ Desktop: full 3-card layout
// Desktop view only - updated return
return (
<Box sx={{ maxWidth: "1400px", mx: "auto", px: 2 }}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      gap: 3,
      flexWrap: "wrap",
    }}
  >
      {/* 1. Allergy-Safe Filtering */}
      <Box
        sx={{
          flex: 1,
          minWidth: 300,
          maxWidth: 360,
          px: 4,
          py: 4,
          borderRadius: "24px",
          backgroundColor: "#fff7e6",
          boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src="/img/allergenimg.png"
          alt="Allergy Icon"
          style={{ width: 80, height: 80, marginBottom: 16 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#4A2C2A", mb: 1 }}>
          Allergy-Safe Filtering
        </Typography>
        <Typography sx={{ color: "#5A4A42", fontSize: "0.95rem", mb: 2 }}>
          Choose your dietary needs and we'll help you find drinks that fit.
        </Typography>
        <Box component="ul" sx={{ 
          textAlign: "left", 
          fontSize: "0.9rem", 
          color: "#6c4b3b", 
          pl: 2, 
          mb: 3, // Extra margin to push button down
          flexGrow: 1 // Pushes content up
        }}>
          <li>Set filters in your profile</li>
          <li>Hide ingredients you avoid</li>
          <li>Safe choices across the app</li>
        </Box>
        <Button
          variant="contained"
          href={sessionStorage.getItem("user") ? "/profile/preferences" : "/login"}
          sx={{
            backgroundColor: "#ee5c01",
            color: "#fff",
            borderRadius: "999px",
            py: 1,
            width: "100%",
            mt: "auto", // Pushes button to bottom
            alignSelf: "flex-end" // Ensures alignment
          }}
        >
          {sessionStorage.getItem("user") ? "Set Preferences" : "Login to Set Prefs"}
        </Button>
      </Box>

      {/* 2. Quick Reorder */}
      <Box
        sx={{
          flex: 1,
          minWidth: 300,
          maxWidth: 360,
          px: 4,
          py: 4,
          borderRadius: "24px",
          backgroundColor: "#e6f4ff",
          boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src="/img/coffeeReorder.png"
          alt="Reorder Icon"
          style={{ width: 80, height: 80, marginBottom: 16 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a3c5c", mb: 1 }}>
          Quick Reorder
        </Typography>
        <Typography sx={{ color: "#324c63", fontSize: "0.95rem", mb: 2 }}>
          Loved your last order? Bring it back in one click.
        </Typography>
        <Box component="ul" sx={{ 
          textAlign: "left", 
          fontSize: "0.9rem", 
          color: "#3d5466", 
          pl: 2, 
          mb: 3,
          flexGrow: 1
        }}>
          <li>Repeat favorite drinks</li>
          <li>Saves customizations</li>
          <li>No rebuilding needed</li>
        </Box>
        <Button
          variant="contained"
          href={sessionStorage.getItem("user") ? "/profile/history" : "/login"}
          sx={{
            backgroundColor: "#007bba",
            color: "#fff",
            borderRadius: "999px",
            py: 1,
            width: "100%",
            mt: "auto"
          }}
        >
          {sessionStorage.getItem("user") ? "Reorder Now" : "Login to Reorder"}
        </Button>
      </Box>

      {/* 3. Featured Drinks (no auth check) */}
      <Box
        sx={{
          flex: 1,
          minWidth: 300,
          maxWidth: 360,
          px: 4,
          py: 4,
          borderRadius: "24px",
          backgroundColor: "#ffedf2",
          boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src="/img/featureddrink.png"
          alt="Featured Icon"
          style={{ width: 80, height: 80, marginBottom: 16 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#7b2434", mb: 1 }}>
          Featured Drinks
        </Typography>
        <Typography sx={{ color: "#853947", fontSize: "0.95rem", mb: 2 }}>
          Weekly spotlight of seasonal drinks.
        </Typography>
        <Box component="ul" sx={{ 
          textAlign: "left", 
          fontSize: "0.9rem", 
          color: "#853947", 
          pl: 2, 
          mb: 3,
          flexGrow: 1
        }}>
          <li>Handpicked top drinks</li>
          <li>Rotates weekly</li>
          <li>Limited time only</li>
        </Box>
        <Button
          variant="contained"
          href="/menu/featured"
          sx={{
            backgroundColor: "#e53961",
            color: "#fff",
            borderRadius: "999px",
            py: 1,
            width: "100%",
            mt: "auto"
          }}
        >
          See Featured
        </Button>
      </Box>
    </Box>
  </Box>
);
}

export default AllergenFeatureSection;