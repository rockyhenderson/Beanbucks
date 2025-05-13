import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, useMediaQuery, useTheme } from "@mui/material";

const categories = [
  {
    id: "hot",
    label: "Hot Drinks",
    image: "/img/hot-drink.jpg",
  },
  {
    id: "cold",
    label: "Cold Drinks",
    image: "/img/cold-drink.jpg",
  },
  {
    id: "food",
    label: "Food & Snacks",
    image: "/img/food.jpg",
  },
];

const CategoryCard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Grid
      container
      spacing={2}
      sx={{
        maxWidth: "1000px",
        mx: "auto",
        p: 2,
        height: isDesktop ? "80vh" : "calc(100vh - 12rem)", // fit mobile
        flexWrap: isDesktop ? "wrap" : "nowrap",
        flexDirection: isDesktop ? "row" : "column",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          height: isDesktop ? "66.66%" : "33.33%",
        }}
      >
        <CategoryTile {...categories[0]} onClick={() => navigate(`/order/${categories[0].id}`)} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          height: isDesktop ? "66.66%" : "33.33%",
        }}
      >
        <CategoryTile {...categories[1]} onClick={() => navigate(`/order/${categories[1].id}`)} />
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          height: isDesktop ? "33.33%" : "33.33%",
        }}
      >
        <CategoryTile {...categories[2]} onClick={() => navigate(`/order/${categories[2].id}`)} />
      </Grid>
    </Grid>
  );
};

const CategoryTile = ({ image, label, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={label}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          color: "white",
          px: 2,
          py: 1.5,
          fontSize: "1.5rem",
          fontWeight: 600,
          background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
        }}
      >
        {label}
      </Box>
    </Box>
  );
};

export default CategoryCard;
