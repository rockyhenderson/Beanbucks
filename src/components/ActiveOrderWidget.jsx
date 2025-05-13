import React, { useEffect, useState } from "react";
import { Box, Button, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ActiveOrderWidget() {
  const [activeOrder, setActiveOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [animate, setAnimate] = useState(true);
  const [hasAlerted, setHasAlerted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("activeOrder");
    if (stored) setActiveOrder(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ⏱ Poll every 10s to keep widget synced

  useEffect(() => {
    if (!activeOrder) return;
  
    const poll = async () => {
      try {
        const response = await fetch(
          `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/poll_pickup_time.php?order_id=${activeOrder.orderId}`
        );
        const result = await response.json();
  
        if (
          result?.success === false &&
          result?.error === "No orders found" &&
          !hasAlerted
        ) {
          setTimeLeft("Ready for pickup!");
          setHasAlerted(true);
          sessionStorage.removeItem("activeOrder");
  
          // 🔔 Sound
          const sound = new Audio("/sounds/OrderReady.mp3");
          sound.volume = 1;
          sound.play().catch((err) =>
            console.warn("🔇 Could not play sound:", err)
          );
  
          // ✅ Toast
          if (window?.showGlobalToast) {
            window.showGlobalToast({
              type: "success",
              title: "Order Ready",
              message: "Your BeanBucks order is ready for pickup!",
            });
          }
        } else if (result?.pickup_time) {
          const now = new Date();
          const pickup = new Date(result.pickup_time.replace(" ", "T"));
          const diffMs = pickup - now;
  
          if (diffMs < 0) {
            const lateBy = Math.abs(Math.floor(diffMs / 60000));
            setTimeLeft(`Late by ${lateBy} min${lateBy === 1 ? "" : "s"}`);
          } else {
            const mins = Math.floor(diffMs / 60000);
            const secs = Math.floor((diffMs % 60000) / 1000);
            setTimeLeft(`${mins}m ${secs < 10 ? "0" : ""}${secs}s`);
          }
        } else {
          setTimeLeft("Unavailable");
        }
      } catch (err) {
        console.error("Error polling pickup time:", err);
      }
    };
  
    // Initial poll and every 10s
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [activeOrder, hasAlerted]);
  



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
        left: "1.5rem",
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
                color: timeLeft.includes("Late")
                  ? "var(--danger)"
                  : timeLeft === "Ready for pickup!"
                  ? "#2e7d32"
                  : "#388e3c",
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
