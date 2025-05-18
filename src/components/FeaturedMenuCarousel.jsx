import React, { useState } from "react";
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const featuredDrinks = [
  {
    name: "Espresso Delight",
    desc: "Rich & bold.",
    img: "https://source.unsplash.com/300x450/?espresso",
  },
  {
    name: "Matcha Madness",
    desc: "Earthy and energizing.",
    img: "https://source.unsplash.com/300x450/?matcha",
  },
  {
    name: "Caramel Dream",
    desc: "Sweet & creamy.",
    img: "https://source.unsplash.com/300x450/?caramel-coffee",
  },
  {
    name: "Vanilla Bliss",
    desc: "Smooth vanilla flavor.",
    img: "https://source.unsplash.com/300x450/?vanilla-coffee",
  },
  {
    name: "Choco Chill",
    desc: "Icy chocolate treat.",
    img: "https://source.unsplash.com/300x450/?iced-coffee",
  },
];

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      { breakpoint: 1, settings: { slidesToShow: 1 } },
    ],
  };

  return (
<Box
  sx={{
    p: 4,
    maxHeight: "950px",
    color: "var(--text)",
    maxWidth: "2400px",
    margin: "auto"
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
        {/* Image on the left (desktop), below on mobile */}
        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            width: { md: 350 },
            flexShrink: 0,
            display: { xs: "none", md: "block" }, // <-- add this line
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

        {/* Text + Carousel */}
        <Grid item xs={12} md sx={{ flexGrow: 1, minWidth: 0, }}>
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
                <Box key={index} sx={{ px: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: "var(--card)",
                      borderRadius: "16px",
                      boxShadow: "0 4x 12px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      width: "100%",
                      maxWidth: 280,
                      height: 350,
                      textAlign: "center",
                      mx: "auto",
                    }}
                  >
                    <Box
                      component="img"
                      src={drink.img}
                      alt={drink.name}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 180,
                        objectFit: "contain",
                        borderRadius: "12px",
                        mb: 2,
                      }}
                      onError={(e) => {
                        e.target.src = "/img/Fallback.png";
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "var(--accent)" }}
                    >
                      {drink.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--body-text)", mt: 0.5 }}
                    >
                      {drink.desc}
                    </Typography>
                  </Box>
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