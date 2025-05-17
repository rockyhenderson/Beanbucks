import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import noImage from '../../public/img/Fallback.png'
import smilingGuy from '../../public/img/happycoffeeman.png'

function HeroBanner() {
  const [imgSrc, setImgSrc] = useState(smilingGuy)
  const handleImageError = () => {
    setImgSrc(noImage); // ✅ Use the imported image
  };
  return (
    <Box
      component="section"
      sx={{
        maxHeight: "600px",
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: { xs: "auto", md: "70vh" },
        overflow: "hidden",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Left Container (no background) */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: { xs: 0, md: 0 },
          position: "relative",
        }}
      >
        {/* Inner Text Block with Background and Clip */}
        <Box
          sx={{
            position: "relative",
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            backgroundColor: "var(--accent)",
            color: "#fff",
            width: { xs: "100%", md: "90%" },
            height: "100%",
            clipPath: {
              md: "ellipse(100% 100% at 0% 50%)",
              xs: "none",
            },
            WebkitClipPath: {
              md: "ellipse(100% 100% at 0% 50%)",
              xs: "none",
            },
            display: "flex",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Box
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Sip into <br />
            <Box component="span" sx={{ color: "var(--primary)" }}>
              serenity
            </Box>
          </Box>

          <Box
            component="p"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              mb: 4,
              maxWidth: "90%",
              color: "var(--button-text)",
            }}
          >
            Cool down with our signature Iced Latte — smooth, refreshing, and just what you need.
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--primary)",
              color: "#fff",
              fontSize: "1rem",
              px: 4,
              py: 1.25,
              borderRadius: "24px",
              width: "fit-content",
              textTransform: "none",
              '&:hover': {
                backgroundColor: "#cc4a00",
              },
            }}
          >
            View Iced Latte
          </Button>
        </Box>
      </Box>

      {/* Right Side: Image */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          backgroundColor: "var(--background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 4, md: 6 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          onError={handleImageError}
          alt="Iced Latte"
          sx={{
            width: "100%",
            maxWidth: "480px",
            height: "auto",
            borderRadius: 4,
            boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
          }}
        />
      </Box>
    </Box>
  );
}

export default HeroBanner;
