import React from "react";
import { Button, Typography, Stack, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function RetryFallback({
  onRetry,
  isLoading = false,
  message = "Something went wrong. We're not sure what.",
}) {
  return (
    <Stack
      direction="column"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ marginTop: "2rem" }}
    >
      <ErrorOutlineIcon sx={{ fontSize: "2.5rem", color: "var(--primary)" }} />
      <Typography
        variant="body1"
        sx={{
          color: "var(--text)",
          fontFamily: "'Poppins', sans-serif",
          textAlign: "center",
        }}
      >
        {message}
      </Typography>

      <Button
        onClick={onRetry}
        disabled={isLoading}
        startIcon={
          isLoading ? (
            <CircularProgress
              size={20}
              sx={{ color: "white" }}
            />
          ) : null
        }
        sx={{
          backgroundColor: "var(--primary)",
          color: "var(--button-text)",
          fontWeight: 600,
          padding: "0.4rem 1.2rem",
          fontFamily: "'Poppins', sans-serif",
          borderRadius: "6px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#d65100",
          },
        }}
      >
        {isLoading ? "Retrying..." : "Try Again"}
      </Button>
    </Stack>
  );
}
