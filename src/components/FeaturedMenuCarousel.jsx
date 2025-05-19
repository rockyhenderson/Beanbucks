import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FeaturedDrinkCard from "../components/FeaturedDrinkCard";

const ArrowLeft = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      left: "-30px",
      transform: "translateY(-50%)",
      zIndex: 2,
      backgroundColor: "#fff",
      color: "#ee5c01",
      border: "2px solid #ee5c01",
      width: 36,
      height: 36,
      borderRadius: "999px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      "&:hover": {
        backgroundColor: "#fff7f0",
      },
    }}
  >
    <ArrowBackIosNew fontSize="small" />
  </IconButton>
);

const ArrowRight = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      right: "-30px",
      transform: "translateY(-50%)",
      zIndex: 2,
      backgroundColor: "#fff",
      color: "#ee5c01",
      border: "2px solid #ee5c01",
      width: 36,
      height: 36,
      borderRadius: "999px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      "&:hover": {
        backgroundColor: "#fff7f0",
      },
    }}
  >
    <ArrowForwardIos fontSize="small" />
  </IconButton>
);

function FeaturedMenuCarousel() {
  const [imgSrc, setImgSrc] = useState("/img/happycoffeeman.png");
  const [featuredDrinks, setFeaturedDrinks] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/get_featured_drinks.php"
    )
      .then((res) => res.json())
      .then((data) => setFeaturedDrinks(data))
      .catch((err) => console.error("Error fetching featured drinks:", err));
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <ArrowRight />,
    prevArrow: <ArrowLeft />,
    responsive: [
      { breakpoint: 2500, settings: { slidesToShow: 5 } },
      { breakpoint: 1850, settings: { slidesToShow: 4 } },
      { breakpoint: 1650, settings: { slidesToShow: 3 } },
      { breakpoint: 1400, settings: { slidesToShow: 2 } },
      { breakpoint: 1100, settings: { slidesToShow: 2 } },
      { breakpoint: 1000, settings: { slidesToShow: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCardClick = (drink) => {
    navigate(`/order/${drink.category}`, {
      state: { drink },
    });
  };

  return (
    <Box
      sx={{
        p: 4,
        maxHeight: "950px",
        color: "var(--text)",
        maxWidth: "2400px",
        margin: "auto",
      }}
    >
      <Grid
        container
        direction={"row"}
        alignItems="center"
        sx={{
          maxHeight: "950px",
          margin: "auto",
          maxWidth: { xs: 400, md: "none" },
        }}
      >
        {/* Left Image */}
        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            width: { md: 350 },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            component="img"
            src={imgSrc}
            onError={() => setImgSrc("/img/Fallback.png")}
            alt="Happy Customer"
            sx={{
              width: "100%",
              maxWidth: "400px",
              mx: isMobile ? "auto" : 0,
              height: "auto",
              display: "block",
              borderRadius: "16px",
              objectFit: "cover",
            }}
          />
        </Grid>

        {/* Right Content */}
        <Grid item xs={12} md sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "var(--heading-text)",
                fontFamily: "inherit",
                letterSpacing: 1,
              }}
            >
              Trending Now
            </Typography>
          </Box>

          <Box sx={{ position: "relative", px: 4, width: "100%" }}>
            <Slider {...sliderSettings}>
              {featuredDrinks.map((drink, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 1,
                    display: "flex",
                    justifyContent: "center",
                    "&:hover": {
                      transform: "scale(1.03)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                  onClick={() => handleCardClick(drink)}
                >
                  <FeaturedDrinkCard
                    drink={drink}
                    onOrderClick={() => handleCardClick(drink)}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FeaturedMenuCarousel;
