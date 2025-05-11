import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BaristaSecurePortal() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Box
        sx={{
          maxWidth: "650px",
          width: "100%",
          backgroundColor: "var(--card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "left",
        }}
      >
        <h1 style={{ color: "var(--heading)", marginBottom: "1rem" }}>Barista Secure Portal</h1>

        <p style={{ color: "var(--body-text)", marginBottom: "1rem" }}>
          This portal is designed for baristas and managers to manage drink orders efficiently and in real time.
          Please make sure to log in at least <strong>10 minutes before your shift</strong>.
        </p>

        <ul style={{ paddingLeft: "1.2rem", color: "var(--body-text)", marginBottom: "2rem", fontSize: "1rem" }}>
          <li>☕ View incoming customer orders</li>
          <li>✅ Mark drinks as preparing or ready</li>
          <li>⏳ Orders sorted by oldest first</li>
          <li>🔁 Live updates every 5 seconds</li>
          <li>📦 Low stock ingredient alerts</li>
          <li>📍 Auto-store lock for admins, store switcher for managers</li>
          <li>🟢 Connection status indicator (green/red)</li>
        </ul>

        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: "var(--primary)", color: "var(--button-text)", fontWeight: 600 }}
          onClick={() => navigate("/portal/barista/live")}
        >
          Enter Live Dashboard
        </Button>
      </Box>
    </Box>
  );
}

export default BaristaSecurePortal;
