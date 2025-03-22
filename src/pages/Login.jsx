import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

function Login() {
  return (
    <Box
      sx={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
        minHeight: "auto", // Fit content
        padding: "2rem 1rem",
      }}
    >
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

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            required
            type="email"
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
            variant="outlined"
            fullWidth
            required
            type="password"
            sx={{
              input: { color: "var(--text)" },
              label: { color: "var(--text)" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
              },
            }}
          />

          <MuiLink
            component={Link}
            to="/forgot"
            underline="hover"
            sx={{
              alignSelf: "flex-end",
              fontSize: "0.9rem",
              color: "var(--accent)",
              textAlign: "center",
              margin: "auto",
            }}
          >
            Forgot password?
          </MuiLink>

          <Button
            variant="contained"
            fullWidth
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
            Log In
          </Button>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "var(--text)" }}
        >
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", textDecoration: "underline" }}>
            Register here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
