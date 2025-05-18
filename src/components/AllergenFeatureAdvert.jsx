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
  return (
    <Box sx={{ my: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
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
            maxWidth: 360,
            px: 4,
            py: 5,
            borderRadius: "24px",
            backgroundColor: "#fff7e6",
            boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/img/allergenimg.png"
            alt="Bee Icon"
            style={{ width: 80, height: 80, marginBottom: 16 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#4A2C2A", mb: 1 }}>
            Allergy-Safe Filtering
          </Typography>
          <Typography sx={{ color: "#5A4A42", fontSize: "0.95rem", mb: 2 }}>
            Choose your dietary needs and we'll help you find drinks that fit — no stress, just sips.
          </Typography>
          <Box component="ul" sx={{ textAlign: "left", fontSize: "0.9rem", color: "#6c4b3b", pl: 2, mb: 2 }}>
            <li>Set filters in your profile</li>
            <li>Hide ingredients you avoid</li>
            <li>Safe choices across the app</li>
          </Box>
          <Button
            variant="contained"
            href="/profile/preferences"
            sx={{
              backgroundColor: "#ee5c01",
              color: "#fff",
              fontWeight: 500,
              borderRadius: "999px",
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              "&:hover": { backgroundColor: "#d24e00" },
            }}
          >
            Set My Preferences
          </Button>
        </Box>

        {/* 2. Quick Reorder */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 360,
            px: 4,
            py: 5,
            borderRadius: "24px",
            backgroundColor: "#e6f4ff",
            boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/img/coffeeReorder.png"
            alt="Bee Icon"
            style={{ width: 80, height: 80, marginBottom: 16 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a3c5c", mb: 1 }}>
            Quick Reorder
          </Typography>
          <Typography sx={{ color: "#324c63", fontSize: "0.95rem", mb: 2 }}>
            Loved your last order? Bring it back in one click — just the way you like it.
          </Typography>
          <Box component="ul" sx={{ textAlign: "left", fontSize: "0.9rem", color: "#3d5466", pl: 2, mb: 2 }}>
            <li>Instantly repeat your favorite drink</li>
            <li>Applies saved customizations</li>
            <li>No need to rebuild your order</li>
          </Box>
          <Button
            variant="contained"
            href="/profile/history"
            sx={{
              backgroundColor: "#007bba",
              color: "#fff",
              fontWeight: 500,
              borderRadius: "999px",
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              "&:hover": { backgroundColor: "#005e95" },
            }}
          >
            Reorder Now
          </Button>
        </Box>

        {/* 3. Featured Drinks */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 360,
            px: 4,
            py: 5,
            borderRadius: "24px",
            backgroundColor: "#ffedf2",
            boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/img/featureddrink.png"
            alt="Bee Icon"
            style={{ width: 80, height: 80, marginBottom: 16 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#7b2434", mb: 1 }}>
            Featured Drinks
          </Typography>
          <Typography sx={{ color: "#853947", fontSize: "0.95rem", mb: 2 }}>
            Every week we spotlight fan-favorite drinks and seasonal sips worth buzzing about.
          </Typography>
          <Box component="ul" sx={{ textAlign: "left", fontSize: "0.9rem", color: "#853947", pl: 2, mb: 2 }}>
            <li>Handpicked top-rated drinks</li>
            <li>Rotates every Monday</li>
            <li>Only available for a limited time</li>
          </Box>
          <Button
            variant="contained"
            href="/menu/featured"
            sx={{
              backgroundColor: "#e53961",
              color: "#fff",
              fontWeight: 500,
              borderRadius: "999px",
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              "&:hover": { backgroundColor: "#c92d50" },
            }}
          >
            See What's Hot
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AllergenFeatureSection;