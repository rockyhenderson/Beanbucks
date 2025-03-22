import React from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Register() {
  return (
<Box
  sx={{
    backgroundColor: "var(--background)",
    color: "var(--text)",
    minHeight: "auto", // 👈 only height needed to fit content
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
          Create a BeanBucks Account
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
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
            label="Last Name"
            variant="outlined"
            fullWidth
            required
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

          <Button
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
            Register
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

export default Register;
