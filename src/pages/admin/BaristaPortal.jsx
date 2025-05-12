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
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "var(--card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem", color: "var(--heading)" }}>Barista Portal</h1>
        <p style={{ color: "var(--body-text)", marginBottom: "1.5rem", fontSize: "1rem", lineHeight: "1.6" }}>
          Welcome to the Barista Portal. Here you’ll receive live order updates as they come in.
          View drink customisations, track status, and mark drinks as preparing or ready — all in real time.
        </p>

        <p style={{ fontSize: "0.9rem", color: "var(--danger)", fontWeight: 500, marginBottom: "2rem" }}>
          Please enter the portal at least <strong>10 minutes before your shift</strong> to ensure you're ready
          to receive orders.
        </p>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("../portal/barista")}
          sx={{ backgroundColor: "var(--primary)", color: "var(--button-text)", fontWeight: 600 }}
        >
          Enter Secure Portal 
        </Button>
      </Box>
    </Box>
  );
}

export default BaristaSecurePortal;
