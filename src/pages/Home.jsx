import React from "react";
import { Box } from "@mui/material";

import HeroBanner from "../components/HeroBanner";
import FeaturedMenuCarousel from "../components/FeaturedMenuCarousel";
import LoyaltyPreview from "../components/LoyaltyPreview";
import AllergenFeatureAdvert from "../components/AllergenFeatureAdvert";
import SocialProof from "../components/SocialProof";
import HowItWorksSteps from "../components/HowItWorksSteps";

function Home() {
  return (
    <Box className="home" sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
      <HeroBanner />

      <Box sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
        <FeaturedMenuCarousel />
      </Box>

      <Box sx={{ backgroundColor: '#fff8e1', py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
        <LoyaltyPreview />
      </Box>

      <Box sx={{ backgroundColor: '#e3f2fd', py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
        <AllergenFeatureAdvert />
      </Box>

      <Box sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
        <SocialProof />
      </Box>

      <Box sx={{ backgroundColor: '#f1f8e9', py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
        <HowItWorksSteps />
      </Box>
    </Box>
  );
}

export default Home;
