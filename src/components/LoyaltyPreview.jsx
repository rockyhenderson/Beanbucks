import React, { useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";

function LoyaltyHero() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const currentPoints = 120;
  const goal = 150;
  const progress = (currentPoints / goal) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        borderRadius: "24px",
        background: "linear-gradient(90deg, #ffe8d0 0%, #fca748 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
        my: 4,
        marign: "auto"
      }}
    >
      {/* Confetti Layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/assets/beans_sparkle_overlay.svg)",
          backgroundRepeat: "repeat",
          opacity: 0.08,
          zIndex: 0

        }}
      />

      {/* Left side - content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: { xs: "center", md: "left" },
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "space-between" },
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontWeight: 800, color: "#4A2C2A", margin: 0 }}>
            {isLoggedIn ? "You’ve Got BeanPoints!" : "Perks, Just a Sip Away"}
          </h2>

          <Button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontSize: "0.875rem",
              backgroundColor: "#fff",
              color: "#4A2C2A",
              "&:hover": { backgroundColor: "#f7e7d7" },
            }}
          >
            Toggle View
          </Button>
        </Box>

        {isLoggedIn ? (
          <>
            <p style={{ color: "#5A4A42", marginBottom: "0.5rem" }}>
              Looks like you’ve brewed up <strong style={{ color: "#ee5c01" }}>{currentPoints} points</strong>.
            </p>
            <p style={{ color: "#6c4b3b", marginBottom: "1rem" }}>
              Only {goal - currentPoints} more to go and your next handcrafted drink is on us.
            </p>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: "999px",
                backgroundColor: "#ffe8d0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#ee5c01",
                },
                mb: 2,
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ee5c01",
                color: "#fff",
                fontWeight: 550,
                borderRadius: "999px",
                px: 3,
                py: 1,
                width: "fit-content",
                alignSelf: { xs: "center", md: "flex-start" },
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#d24e00",
                },
              }}
            >
              Redeem Rewards
            </Button>
          </>
        ) : (
          <>
            <p style={{ color: "#5A4A42", marginBottom: "0.5rem" }}>
              Sign in to start collecting BeanPoints and enjoy sweet little surprises along the way.
            </p>
            <ul style={{ color: "#6c4b3b", paddingLeft: "1.25rem", marginBottom: "1rem", listStyle: "disc" }}>
              <li>Earn 1 point for every £1 you spend</li>
              <li>Collect 150 points to enjoy a drink on the house</li>
              <li>Get something extra special on your birthday</li>
            </ul>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ee5c01",
                color: "#fff",
                fontWeight: 550,
                borderRadius: "999px",
                px: 3,
                py: 1,
                width: "fit-content",
                alignSelf: { xs: "center", md: "flex-start" },
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#d24e00",
                },
              }}
            >
              Log In to Start Earning
            </Button>
          </>
        )}
      </Box>

      {/* Right side - mascot */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,234,205,0.6) 0%, transparent 70%)",
            zIndex: 1,
          }}
        />
        <Box
          component="img"
          src="/img/cupspouring.png"
          alt="BeanBucks Mascot"
          sx={{
            maxHeight: "220px",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
            position: "relative",
            zIndex: 2,
          }}
        />
      </Box>
    </Box>
  );
}

export default LoyaltyHero;
