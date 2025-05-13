import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";

function VerifyCode() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("reset_email");
    const timestamp = sessionStorage.getItem("reset_email_timestamp");
    const user = sessionStorage.getItem("user");

    if (stored && timestamp) {
      const now = Date.now();
      const age = now - parseInt(timestamp);
      if (age <= 10 * 60 * 1000) {
        setEmail(stored);
        setStep("code");
      } else {
        sessionStorage.removeItem("reset_email");
        sessionStorage.removeItem("reset_email_timestamp");
      }
    } else if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.email) {
          setEmail(parsed.email);
        }
      } catch (e) {
        console.error("Invalid user session object.", e);
      }
    }
  }, []);

  useEffect(() => {
    if (step === "code") {
      const expiry = parseInt(sessionStorage.getItem("reset_email_timestamp")) + 10 * 60 * 1000;
      const interval = setInterval(() => {
        const remaining = Math.max(0, expiry - Date.now());
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          sessionStorage.removeItem("reset_email");
          sessionStorage.removeItem("reset_email_timestamp");
          setToast({
            type: "error",
            title: "Code Expired",
            message: "Your reset code has expired. Please request a new one.",
          });
          setStep("email");
          setEmail("");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleBack = () => {
    sessionStorage.removeItem("reset_email");
    sessionStorage.removeItem("reset_email_timestamp");
    setEmail("");
    setStep("email");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      sessionStorage.setItem("reset_email", email.trim());
      sessionStorage.setItem("reset_email_timestamp", Date.now().toString());

      try {
        const response = await fetch(
          "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/request_reset_code.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
          }
        );

        const data = await response.json();
        if (data.success) {
          setStep("code");
          setToast({
            type: "success",
            title: "Code Sent",
            message: "If the email exists, a 6-digit code has been sent.",
          });
        } else {
          setToast({
            type: "warning",
            title: "Heads up",
            message: data.error || "Something went wrong.",
          });
        }
      } catch (err) {
        setToast({
          type: "error",
          title: "Server Error",
          message: "Could not contact the server. Try again later.",
        });
      }
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/verify_reset_code.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await response.json();
      if (data.success) {
        const token = data.token;
        navigate(`/reset-password?token=${token}&type=register`);
      } else {
        setToast({
          type: "error",
          title: "Invalid Code",
          message: data.error || "The code is incorrect or expired.",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        title: "Server Error",
        message: "Could not contact the server.",
      });
    }
  };

  const handleClearResetEmail = () => {
    sessionStorage.removeItem("reset_email");
    sessionStorage.removeItem("reset_email_timestamp");
    sessionStorage.removeItem("user");
    setEmail("");
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
        height: "calc(100vh - 84px)",
        padding: "2rem 1rem",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {toast && (
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
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </Box>
      )}

      {step === "code" && (
        <IconButton
          onClick={handleBack}
          sx={{ position: "absolute", top: 16, left: 16, zIndex: 999 }}
        >
          <ArrowBackIcon />
        </IconButton>
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
          {step === "email" ? "Request Reset Code" : "Enter Verification Code"}
        </Typography>

        {step === "email" && sessionStorage.getItem("user") && email && (
          <>
            <Box
              component="form"
              onSubmit={handleEmailSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography sx={{ textAlign: "center", color: "var(--text)" }}>
                Send code to <strong>{email}</strong>?
              </Typography>

              <Button
                type="submit"
                variant="contained"
                fullWidth
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
                Send Code
              </Button>
            </Box>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, cursor: "pointer", color: "var(--accent)" }}
              onClick={handleClearResetEmail}
            >
              Not my email?
            </Typography>
          </>
        )}

        {step === "email" && (!sessionStorage.getItem("user") || !email) && (
          <>
            <Typography sx={{ mb: 2, textAlign: "center", color: "var(--text)" }}>
              Enter your email to receive a 6-digit verification code.
            </Typography>

            <Box
              component="form"
              onSubmit={handleEmailSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Next
              </Button>
            </Box>
          </>
        )}

        {step === "code" && (
          <>
            <Typography sx={{ mb: 2, textAlign: "center", color: "var(--text)" }}>
              We've sent a 6-digit code to {email}. Please enter it below.
            </Typography>

            {timeLeft !== null && (
              <Typography sx={{ textAlign: "center", color: "var(--text)", mb: 1 }}>
                Code expires in: {Math.floor(timeLeft / 60000)}:{String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')}
              </Typography>
            )}

            <Box
              component="form"
              onSubmit={handleCodeSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="6-Digit Code"
                type="text"
                inputProps={{ maxLength: 6 }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
                Verify Code
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default VerifyCode;
