import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import "../Toast_Style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/profile");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const loginRes = await fetch(
        "/api/public/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
  
      const loginData = await loginRes.json();
  
      if (loginData.success) {
        const user = loginData.user;
  
        const roleMap = {
          1: "customer",
          2: "admin",
          3: "manager",
        };
  
        const sessionUser = {
          id: user.id,
          name: user.first_name,
          role: roleMap[user.role] || "unknown",
          email: user.email,
          ...(user.store_id !== undefined && { store_id: user.store_id }),
          allergens: user.allergens || [],
        };
  
        sessionStorage.setItem("user", JSON.stringify(sessionUser));
        sessionStorage.removeItem("reset_email");
        sessionStorage.removeItem("reset_email_time");
  
        setToast({
          type: "success",
          title: "Welcome!",
          message: `Welcome to BeanBucks, ${user.first_name} 🎉`,
        });
  
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setToast({
          type: "error",
          title: "Login Failed",
          message: loginData.error || "Could not log in.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setToast({
        type: "error",
        title: "Server Error",
        message: "Could not connect to server. Try again later.",
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
          Log In to BeanBucks
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email Address"
            type="email"
            value={email}
            required
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
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
            label="Password"
            type="password"
            value={password}
            required
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: { color: "var(--text)" },
              label: { color: "var(--text)" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
              },
            }}
          />

          <Typography align="center" sx={{ mt: 1 }}>
            <MuiLink
              component={Link}
              to="/verify-code"
              underline="hover"
              sx={{
                fontSize: "0.9rem",
                color: "var(--accent)",
                textDecoration: "underline",
              }}
            >
              Forgot your password?
            </MuiLink>
          </Typography>

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
              mt: 1,
              "&:hover": {
                backgroundColor: "#d44f00",
              },
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "var(--text)" }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            Register here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
