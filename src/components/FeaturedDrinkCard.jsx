import React from "react";
import { Box, Paper, Typography, Chip, Button, useMediaQuery } from "@mui/material";
import noImage from "../../public/img/Fallback.png";

const FeaturedDrinkCard = ({ drink, onOrderClick }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        margin: "auto",
        maxWidth: 280,
        minWidth: 220,
        flex: "1 1 auto",
        transform: "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        },
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "var(--card)",
        border: "2px solid var(--component-border)",
        boxShadow: "0 6px 30px rgba(0, 0, 0, 0.08)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Orange Bar */}
      <Box sx={{ height: "6px", backgroundColor: "#ee5c01", width: "100%" }} />

      {/* Image Area */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 140,
          backgroundColor: "#eee",
        }}
      >
        <img
          src={noImage}
          alt={drink.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#ee5c01",
            color: "#fff",
            px: 1.5,
            py: 0.5,
            borderRadius: "12px",
            fontSize: "0.7rem",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Featured
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "var(--heading-color)",
            mb: 1,
            fontSize: isMobile ? "1rem" : "1.1rem",
          }}
        >
          {drink.name}
        </Typography>

        <Chip
          label="Popular Choice"
          size="small"
          sx={{
            backgroundColor: "rgba(238, 92, 1, 0.15)",
            color: "#ee5c01",
            fontWeight: "bold",
            mb: 2,
          }}
        />

        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={() => {
            console.log("🧪 Payload before Order Now click:", drink);

            onOrderClick?.(drink);
          }}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 600,
            border: "2px solid #ee5c01",
            color: "#ee5c01",
            backgroundColor: "var(--card)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(238, 92, 1, 0.1)",
              borderColor: "#ee5c01",
              boxShadow: "0 0 0 2px rgba(238, 92, 1, 0.2)",
            },
          }}
        >
          Order Now
        </Button>

      </Box>
    </Paper>
  );
};

export default FeaturedDrinkCard;
