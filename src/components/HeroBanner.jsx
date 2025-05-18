import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import noImage from '../../public/img/Fallback.png';
import CoffeeBackground from '../../public/img/CoffeeBackground.png';
import MobileBackground from '../../public/img/backgroundmobile.png';
import HeroBlob from '../../public/img/background.svg';
import { useTheme, useMediaQuery } from "@mui/material";
import CoffeeCup from '../../public/img/CoffeeCup.png';



function HeroBanner() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [imgSrc, setImgSrc] = useState(isMobile ? MobileBackground : CoffeeBackground);

  useEffect(() => {
    setImgSrc(isMobile ? MobileBackground : CoffeeBackground);
  }, [isMobile]);

  const handleImageError = () => {
    setImgSrc(noImage);
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: { xs: "80vh", md: "70vh" },
        minHeight: { xs: "600px", md: "auto" },
        overflow: "hidden",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Background Layer: CoffeeBackground always visible */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${CoffeeBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
        onError={handleImageError}
      />
  
      {/* Overlay: SVG blob (desktop) or solid with curved bottom (mobile) */}
      {!isMobile ? (
        <Box
          component="img"
          src={HeroBlob}
          alt="Decorative orange background shape"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "70%",
            backgroundColor: "#dbc1ac",
            zIndex: 1,
            maxHeight: "550px",
            borderBottomLeftRadius: "100% 40%",
            borderBottomRightRadius: "100% 40%",
            overflow: "hidden",
          }}
        />
      )}
  
      {/* Content */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
          zIndex: 2,
          height: { xs: "50%", md: "100%" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" }, // Increased mobile size
              mb: 2,
              lineHeight: 1.2,
              color: "#4a2c2a"
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
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.25rem" }, // Increased mobile size
              mb: 4,
              maxWidth: { xs: "100%", sm: "90%", md: "90%" },
              color: "#4a2c2a",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            Cool down with our signature Iced Latte — smooth, refreshing, and just what you need.
          </Box>
  
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--primary)",
              color: "#fff",
              fontSize: { xs: "1.1rem", md: "1rem" }, // Slightly larger on mobile
              px: 4,
              py: 1.5, // Slightly more padding
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
  
      {/* Right filler (empty on mobile) */}
      <Box
  sx={{
    width: { xs: "100%", md: "40%" },
    position: "relative",
    display: "flex",
    alignItems: { xs: "flex-end", md: "center" },
    justifyContent: "center",
    zIndex: 2,
    order: { xs: 1, md: 0 },
    height: { xs: "auto", md: "auto" },
    marginBottom: { xs: "-120px", md: 0 }, // Force -120px bottom margin on mobile
  }}
>
  <Box
    component="img"
    src={CoffeeCup}
    alt="Coffee Cup"
    sx={{
      position: { xs: "relative", md: "sticky" },
      top: { md: "10vh" },
      height: { 
        xs: "400px", // Much larger on mobile
        sm: "450px", 
        md: "80vh" 
      },
      maxHeight: { xs: "none", md: 600 },
      width: { 
        xs: "95%", // Wider on mobile
        sm: "85%", 
        md: "auto" 
      },
      maxWidth: "90%",
      objectFit: "contain",
      transform: { 
        xs: "translateY(60px)", // Push down further
        md: "none" 
      },
    }}
  />
</Box>
    </Box>
  );
}

export default HeroBanner;
