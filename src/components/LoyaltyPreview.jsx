import React, { useEffect, useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";
import RetryFallback from "../components/RetryFallback";
import { useNavigate } from "react-router-dom";


function LoyaltyHero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loyaltyUrl, setLoyaltyUrl] = useState(null);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // STEP 1: Check sessionStorage for user
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        console.log("✅ Loaded user from sessionStorage:", parsed);
        if (parsed?.role && parsed?.role !== "none") {
          setIsLoggedIn(true);
          setUserId(parsed.id);
        } else {
          console.warn("⚠️ Invalid or guest user role:", parsed.role);
        }
      } catch (err) {
        console.error("❌ Failed to parse sessionStorage user:", err);
      }
    } else {
      console.warn("⚠️ No user in sessionStorage");
    }
  }, []);

  // STEP 2: Construct URL once we have a userId
  useEffect(() => {
    if (userId) {
      const url = `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_loyalty_points.php?id=${userId}`;
      setLoyaltyUrl(url);
      console.log("✅ Loyalty URL set:", url);
    }
  }, [userId]);

  // STEP 3: Fetch loyalty points when URL is ready
  useEffect(() => {
    if (!loyaltyUrl) return;

    console.log("📡 Fetching loyalty data from:", loyaltyUrl);
    setIsLoading(true);
    setError(null);

    fetch(loyaltyUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((json) => {
        console.log("✅ Loyalty data received:", json);
        setData(json);
      })
      .catch((err) => {
        console.error("❌ Error fetching loyalty data:", err);
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loyaltyUrl, retryKey]);

  const retry = () => setRetryKey((prev) => prev + 1);

  const currentPoints = data?.loyalty_points || 0;
  const goal = 150;
  const progress = Math.min((currentPoints / goal) * 100, 100);
  const hasReachedGoal = currentPoints >= goal;

  if (error) return <RetryFallback onRetry={retry} />;
  if (isLoggedIn && isLoading) return <p>Loading...</p>;

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
        margin: "auto",
        maxWidth: "1800px",
      }}
    >
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
        <h2 style={{ fontWeight: 800, color: "#4A2C2A", marginBottom: "1rem" }}>
          {isLoggedIn ? "You’ve Got BeanPoints!" : "Perks, Just a Sip Away"}
        </h2>

        {isLoggedIn ? (
          <>
            <p style={{ color: "#5A4A42", marginBottom: "0.5rem" }}>
              Looks like you’ve brewed up{" "}
              <strong style={{ color: "#ee5c01" }}>{currentPoints} points</strong>.
            </p>
            <p style={{ color: "#6c4b3b", marginBottom: "1rem" }}>
              {hasReachedGoal
                ? "You’ve got enough points for a reward! Treat yourself 🍩"
                : `Only ${goal - currentPoints} more to go and your next handcrafted drink is on us.`}
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
                    onClick={() => navigate("/rewards")} 
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
            <ul
              style={{
                color: "#6c4b3b",
                paddingLeft: "1.25rem",
                marginBottom: "1rem",
                listStyle: "disc",
              }}
            >
              <li>Earn 1 point for every £1 you spend</li>
              <li>Collect 150 points to enjoy a drink on the house</li>
              <li>Get something extra special on your birthday</li>
            </ul>

            <Button
              variant="contained"
              onClick={() => navigate("/login")} 
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
            background:
              "radial-gradient(circle, rgba(255,234,205,0.6) 0%, transparent 70%)",
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
