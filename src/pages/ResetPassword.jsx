import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setStatus({ type: "warning", message: "Please be cautious. This will overwrite your current password." });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (!token) {
      setStatus({ type: "error", message: "Missing reset token." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/reset_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setStatus({ type: "success", message: "Password reset successful!" });
        setSuccess(true);
      } else {
        setStatus({ type: "error", message: result.error || "Something went wrong." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Server error. Please try again later." });
    }

    setIsSubmitting(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
        minHeight: "100vh",
        padding: "2rem 1rem",
        position: "relative"
      }}
    >
      {status && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <Toast
            type={status.type}
            title={status.type === "success" ? "Success" : status.type === "error" ? "Error" : "Warning"}
            message={status.message}
            onClose={() => setStatus(null)}
          />
        </Box>
      )}

      <Container maxWidth="xs">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: "'Quicksand', sans-serif",
            color: "var(--heading-color)",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          {success ? "Password Reset" : "Reset Your Password"}
        </Typography>

        {!success ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              sx={{
                input: { color: "var(--text)" },
                label: { color: "var(--text)" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#888" },
                },
              }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              sx={{
                input: { color: "var(--text)" },
                label: { color: "var(--text)" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#888" },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                backgroundColor: "var(--primary)",
                color: "var(--button-text)",
                fontWeight: "bold",
                padding: "0.75rem",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#d44f00",
                },
              }}
            >
              {isSubmitting ? "Submitting..." : "Set New Password"}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "var(--primary)",
                color: "var(--button-text)",
                fontWeight: "bold",
                padding: "0.75rem",
                fontSize: "1rem",
              }}
            >
              Return to Homepage
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/profile")}
              sx={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
                fontWeight: "bold",
                padding: "0.75rem",
                fontSize: "1rem",
              }}
            >
              Go to Profile
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ResetPassword;
