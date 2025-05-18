import React from "react";
import { Box } from "@mui/material";

import HeroBanner from "../components/HeroBanner";
import FeaturedMenuCarousel from "../components/FeaturedMenuCarousel";
import LoyaltyPreview from "../components/LoyaltyPreview";
import AllergenFeatureAdvert from "../components/AllergenFeatureAdvert";
import SocialProof from "../components/SocialProof";

function Home() {
  return (
<Box className="home" sx={{ display: 'flex', flexDirection: 'column', pb: 0, mb: '-65px' }}>

      <HeroBanner />

      {/* Gradient wrapper */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #ee5c01 0%, rgb(248, 207, 162) 100%)",
          flexGrow: 1,
          width: "100%",
        }}
      >
        <Box>
          <FeaturedMenuCarousel />
        </Box>

        <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
          <LoyaltyPreview />
        </Box>

        <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
          <AllergenFeatureAdvert />
        </Box>

        <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
          <SocialProof />
        </Box>
      </Box>
    </Box>
  );
}


export default Home;
