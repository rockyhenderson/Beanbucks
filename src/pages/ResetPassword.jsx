import React, { useEffect, useState } from "react";
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Toast from "../components/Toast";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const isRegisterFlow = searchParams.get("type") === "register";  
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setStatus({
      type: "warning",
      message: isRegisterFlow
        ? "This is your first time setting a password. Make sure it's secure."
        : "Please be cautious. This will overwrite your current password.",
    });
  }, [isRegisterFlow]);
  

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
      
        if (isRegisterFlow) {
          const email = sessionStorage.getItem("reset_email");
          if (!email) {
            setStatus({ type: "error", message: "Missing email for auto-login." });
            return;
          }
      
          // Attempt login
          const loginRes = await fetch(
            "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/login.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password: newPassword }),
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
      
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            setStatus({
              type: "error",
              message: "Password set but login failed. Try logging in manually.",
            });
          }
        }
      }
       else {
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
  {success
    ? "Password Set"
    : isRegisterFlow
    ? "Create Your Password"
    : "Reset Your Password"}
</Typography>


        {!success ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
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
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
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
