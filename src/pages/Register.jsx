import React, { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import "../Toast_Style.css";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/profile");
    }
  }, []);
  const handleSubmit = async (e) => {
    sessionStorage.setItem("test_write", "hello");
console.log("Wrote test_write:", sessionStorage.getItem("test_write"));

    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "/api/public/register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
          }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON returned: " + text);
      }

      if (data.success) {
        sessionStorage.setItem("reset_email", email.trim());
        sessionStorage.setItem("reset_email_timestamp", Date.now().toString());
      
        setToast({
          type: "success",
          title: "Almost There!",
          message: "Check your inbox for the 6-digit verification code.",
        });
      
        // Wait for toast to appear, then navigate after short pause
        setTimeout(() => {
          // ✅ Confirm storage is still there
          console.log("Stored email:", sessionStorage.getItem("reset_email"));
          navigate("/verify-code");
        }, 1000);
      }
       else {
        setToast({
          type: "error",
          title: "Registration Failed",
          message: data.error || "An unknown error occurred.",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setToast({
        type: "error",
        title: "Server Error",
        message: "Unable to connect. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
        minHeight: "auto",
        padding: "2rem 1rem",
      }}
    >
      {toast && (
        <Box
          sx={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            animation: "slideDown 0.3s ease-out",
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
          Create a BeanBucks Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={textfieldStyle}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={textfieldStyle}
          />
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={textfieldStyle}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
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
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "var(--text)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            Log in here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

const textfieldStyle = {
  input: { color: "var(--text)" },
  label: { color: "var(--text)" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "#888" },
  },
};

export default Register;
