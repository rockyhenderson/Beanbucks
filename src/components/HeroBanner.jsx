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
        height: { xs: "auto", md: "70vh" },
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

      {/* Overlay: SVG blob (desktop) or solid (mobile) */}
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
            backgroundColor: "#dbc1ac", // Adjust this color if needed
            zIndex: 1,
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
              fontSize: { xs: "2rem", md: "3rem" },
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
              fontSize: { xs: "1rem", md: "1.25rem" },
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

      {/* Right filler (empty on mobile) */}
        <Box
    sx={{
      width: { xs: "0", md: "40%" },
      position: "relative",
      display: { xs: "none", md: "flex" },
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    }}
  >
    <Box
      component="img"
      src={CoffeeCup}
      alt="Coffee Cup"
      sx={{
        position: "sticky",
        top: "10vh", // Adjust if you want it lower or higher
        height: "80vh",
        maxHeight: 600,
        maxWidth: "90%",
        objectFit: "contain",
      }}
    />
  </Box>


    </Box>
  );
}

export default HeroBanner;
