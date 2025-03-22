import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TOAST_STYLES = {
  success: {
    background: "#D3FCCF",
    borderColor: "#20A612",
    textColor: "#0A4A03",
    progressColor: "#20A612",
    emoji: "✅",
    message: "Everything went smoothly. You're all set!",
  },
  error: {
    background: "#FEEDEC",
    borderColor: "#E51A3C",
    textColor: "#750800",
    progressColor: "#E51A3C",
    emoji: "❌",
    message: "This server couldn't find what went wrong so this is a generic error message.",
  },
  warning: {
    background: "#FFF5CC",
    borderColor: "#E6900F",
    textColor: "#5C4900",
    progressColor: "#E6900F",
    emoji: "⚠️",
    message: "Heads up! Something might need your attention.",
  },
  info: {
    background: "#CCE6FF",
    borderColor: "#1469B8",
    textColor: "#002F5C",
    progressColor: "#1469B8",
    emoji: "ℹ️",
    message: "Here’s something useful to keep in mind.",
  },
};

function Toast({ type = "error", title = "Header", onClose }) {
  const styles = TOAST_STYLES[type] || TOAST_STYLES.error;
  const [progress, setProgress] = useState(100);

  // Countdown effect
  useEffect(() => {
    const duration = 4000; // 4 seconds
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          if (onClose) onClose();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <Box
      sx={{
        backgroundColor: styles.background,
        color: styles.textColor,
        borderLeft: `5px solid ${styles.borderColor}`,
        padding: "16px",
        borderRadius: "6px",
        boxShadow: "0px 4px 10px rgba(10, 74, 3, 0.2)",
        fontFamily: "Roboto, sans-serif",
        maxWidth: 400,
        position: "relative",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{ fontSize: "18px", fontWeight: 600, display: "flex", alignItems: "center" }}
        >
          <span style={{ marginRight: "8px" }}>{styles.emoji}</span> {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: styles.textColor }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Typography variant="body2" sx={{ fontSize: "12px", mt: 1 }}>
        {styles.message}
      </Typography>

      {/* Countdown Progress */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          marginTop: "12px",
          height: "6px",
          backgroundColor: "#E0E0E0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: styles.progressColor,
          },
        }}
      />
    </Box>
  );
}

export default Toast;
