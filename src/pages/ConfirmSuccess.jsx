import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetchWithRetry from "../utils/useFetchWithRetry";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const orderId = state?.orderId || localStorage.getItem("last_order_id");
  const cart =
  state?.cart ||
  JSON.parse(localStorage.getItem("last_order_info") || "{}")?.cart;

const storeName =
  state?.storeName ||
  JSON.parse(localStorage.getItem("last_order_info") || "{}")?.storeName;


  // Save orderId to localStorage for reloads
  useEffect(() => {
    if (state?.orderId) {
      localStorage.setItem("last_order_id", state.orderId);
    }
  }, [state?.orderId]);

  const {
    data: pickupData,
    isLoading,
    error,
    retry,
  } = useFetchWithRetry(
    `/api/public/poll_pickup_time.php?order_id=${orderId}`
  );

  useEffect(() => {
    const interval = setInterval(() => {
      retry();
    }, 10000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [retry]);

  // Check for when the order is removed from DB
  useEffect(() => {
    if (
      pickupData?.success === false &&
      pickupData?.error === "No orders found"
    ) {
      // Order was deleted from DB (e.g. completed)
      localStorage.removeItem("last_order_id");
      localStorage.removeItem("last_order_info");
      sessionStorage.removeItem("activeOrder"); // 🧼 Clear the session-based widget!
    }
  }, [pickupData]);
  

  const pickupTimeDisplay = (() => {
    if (error) return "Unavailable";
    if (isLoading) return "Loading...";

    if (
      pickupData?.success === false &&
      pickupData?.error === "No orders found"
    ) {
      return "Ready now!";
    }

    const timeStr = pickupData?.pickup_time;
    if (!timeStr) return "Unavailable";

    const pickupDate = new Date(timeStr.replace(" ", "T"));
    const now = new Date();
    const diffMin = Math.round((pickupDate - now) / 60000);

    if (isNaN(diffMin)) return "Unavailable";

    if (diffMin > 0) {
      return `In ${diffMin} min${diffMin === 1 ? "" : "s"}`;
    } else {
      const lateBy = Math.abs(diffMin);
      return {
        text: `Late by ${lateBy} min${lateBy === 1 ? "" : "s"}`,
        isLate: true,
      };
    }
  })();

  // Fallback if required data is missing
  if (!orderId || !cart || !storeName) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "var(--background)",
          color: "var(--danger)",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ color: "var(--danger)" }}>⚠️ Order Not Found</h1>
          <p>We couldn’t load your order summary. Please try again.</p>
          <button
            className="btn"
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--button-text)",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const itemCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem 1rem",
        backgroundColor: "var(--background)",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      {/* 🎉 Banner */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>☕</div>
        <h1 style={{ marginBottom: "0.5rem" }}>Order Confirmed!</h1>
        <p style={{ fontSize: "1rem", color: "var(--body-text)" }}>
          Your order from <strong>{storeName}</strong> is being prepared!
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            marginTop: "0.5rem",
            color: "var(--info)",
          }}
        >
          Order ID: <strong>{orderId}</strong>
        </p>
      </div>

      {/* Pickup Info Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          backgroundColor: "var(--card)",
          border: "1px solid var(--component-border)",
          borderRadius: "1.25rem",
          padding: "1.5rem 2rem",
          textAlign: "center",
          boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
        }}
      >
        <p style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
          <strong>Pickup Time:</strong>{" "}
          <span
            style={{
              color:
                typeof pickupTimeDisplay === "object" &&
                pickupTimeDisplay.isLate
                  ? "var(--danger)"
                  : "var(--success)",
            }}
          >
            {typeof pickupTimeDisplay === "string"
              ? pickupTimeDisplay
              : pickupTimeDisplay.text}
          </span>
        </p>
        <p>We'll notify you when your drink is ready!</p>
        {pickupData?.store_order_count >= 5 && (
          <div
            style={{
              marginTop: "1rem",
              backgroundColor: "var(--warning-bg, #fff3cd)",
              color: "var(--warning-text, #856404)",
              border: "1px solid var(--warning-border, #ffeeba)",
              borderRadius: "0.75rem",
              padding: "1rem",
            }}
          >
            ⚠️ There are currently{" "}
            <strong>{pickupData.store_order_count}</strong> orders being
            processed at this store. It might take a little longer than usual.
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--card)",
          border: "1px solid var(--component-border)",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Your {itemCount} item{itemCount > 1 ? "s" : ""}
        </h2>
        <ul style={{ marginBottom: "1.5rem" }}>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} × {item.qty || 1}
            </li>
          ))}
        </ul>
        <button
          className="btn"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--button-text)",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "0.75rem",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
