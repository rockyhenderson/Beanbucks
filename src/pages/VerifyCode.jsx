import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

function VerifyCode() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit verification:", { email, code });
    // Future: Call backend to validate code
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
        minHeight: "100%",
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          Verify Your Identity
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
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
      </Container>
    </Box>
  );
}

export default VerifyCode;
