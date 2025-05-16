import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

function HeroBanner() {
  const [imgSrc, setImgSrc] = useState("/img/costa-style-drinks.png");

  const handleImageError = () => {
    setImgSrc("/img/FallBackImg.png");
  };

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "stretch",
        justifyContent: "space-between",
        width: "100%",
        height: { xs: "auto", md: "90vh" },
        overflow: "hidden",
        background: "var(--background)",
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          flex: 1,
          px: { xs: 4, md: 10 },
          py: { xs: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "var(--accent)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", md: "3rem" },
            mb: 2,
            lineHeight: 1.2,
          }}
        >
          Your chance <br />
          <Box component="span" sx={{ color: "var(--primary)" }}>
            to chill
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            mb: 4,
            maxWidth: "90%",
            color: "var(--button-text)",
          }}
        >
          Summer’s here. Things are heating up out there, so make sure you take a moment
          to chill with an Iced Americano or Iced Latte.
        </Typography>

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
          Our menu
        </Button>
      </Box>

      {/* Right Side: Image */}
      <Box
        sx={{
          flex: 1,
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
          alt="Chilled drinks on display"
          sx={{
            width: "100%",
            maxWidth: "500px",
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
