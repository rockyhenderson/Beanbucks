import React, { useEffect, useState } from "react";
import { Box, Button, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";


function ActiveOrderWidget() {
  const [activeOrder, setActiveOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [animate, setAnimate] = useState(true);
  const navigate = useNavigate();
  const readySound = new Audio("/sounds/OrderReady.mp3");
  readySound.volume = 1;
  
  // Load order info from session
  useEffect(() => {
    const stored = sessionStorage.getItem("activeOrder");
    if (stored) setActiveOrder(JSON.parse(stored));
  }, []);

  // One-time pulse animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, []);

// Countdown timer + ready alert
useEffect(() => {
    if (!activeOrder) return;
  
    let interval;
    let hasAlerted = false;
  
    interval = setInterval(() => {
      const now = new Date();
      const pickup = new Date(activeOrder.pickupTime.replace(" ", "T"));
      const diffMs = pickup - now;
  
      if (diffMs <= 0 && !hasAlerted) {
        setTimeLeft("Ready for pickup!");
  
        // 🔔 Play ready sound
        const sound = new Audio("/sounds/OrderReady.mp3");
        sound.volume = 1;
        sound.play().catch((err) =>
          console.warn("🔇 Could not play ready sound:", err)
        );
  
        // ✅ Show toast
        if (window?.showGlobalToast) {
          window.showGlobalToast({
            type: "success",
            title: "Ready for Pickup",
            message: `Your order at ${activeOrder.storeName.replace(
              /^BeanBucks\s*-\s*/,
              ""
            )} is now ready!`,
          });
        }
  
        hasAlerted = true;
        clearInterval(interval); // 🛑 Stop further updates
      } else if (diffMs > 0) {
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs < 10 ? "0" : ""}${secs}s`);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [activeOrder]);
  
  
  

  const handleViewOrder = () => {
    navigate("/order-success", {
      state: {
        orderId: activeOrder.orderId,
        fromWidget: true,
      },
    });
  };

  if (!activeOrder) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "4rem",
        right: "1.5rem",
        zIndex: 9999,
      }}
    >
      <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            backgroundColor: "#fff8e1",
            color: "#5d4037",
            border: "2px solid #f9a825",
            borderRadius: "16px",
            padding: "1.25rem",
            minWidth: "260px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
            🛍️ Active Order
          </h3>
          <p style={{ margin: 0 }}>
            <b>Pickup at:</b>{" "}
            {activeOrder.storeName.replace(/^BeanBucks\s*-\s*/, "")}
          </p>
          <p style={{ marginBottom: "0.75rem" }}>
            <b>Time left:</b>{" "}
            <span
              style={{
                color: timeLeft === "Ready for pickup!" ? "#2e7d32" : "#388e3c",
                fontWeight: 600,
              }}
            >
              {timeLeft}
            </span>
          </p>

          <Button
            variant="contained"
            size="small"
            onClick={handleViewOrder}
            sx={{
              width: "100%",
              fontWeight: 600,
              fontSize: "0.9rem",
              backgroundColor: "var(--primary)",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e16600",
              },
            }}
          >
            View Order
          </Button>
        </Box>
      </Slide>

      <Button
        variant="contained"
        onClick={() => setIsOpen((prev) => !prev)}
        sx={{
          borderRadius: "999px",
          padding: "0.6rem 1.4rem",
          fontWeight: 600,
          fontSize: "1rem",
          backgroundColor: "var(--primary)",
          color: "white",
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          mt: 1,
          animation: animate ? "pulse 1s ease-in-out infinite" : "none",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.06)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      >
        {isOpen ? "Close" : "🛍️ Order Active"}
      </Button>
    </Box>
  );
}

export default ActiveOrderWidget;
