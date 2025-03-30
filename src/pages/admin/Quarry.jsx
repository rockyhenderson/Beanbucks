import React, { useState } from "react";
import { Box, Typography, Divider, Link as MuiLink, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Toast from "../../components/Toast";
import DrinkCard from "../../components/DrinkCard";
import CategoryCard from "../../components/CategoryCard";
import RetryFallback from "../../components/RetryFallback";
import InfoDisplayModal from "../../components/InfoDisplayModal";
import SingleInputModal from "../../components/SingleInputModal";
import TwoChoicesModal from "../../components/TwoChoices";



function Quarry() {
  const [modalType, setModalType] = useState(null);

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: "var(--background)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
        🧪 Component Quarry
      </Typography>

      {/* Page Links Section */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        All Pages
      </Typography>
      <ul style={{ marginBottom: "2rem" }}>
        <li>
          <MuiLink component={Link} to="/" underline="hover">
            Home
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/order" underline="hover">
            Order
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/rewards" underline="hover">
            Rewards
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/store" underline="hover">
            Store
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/profile" underline="hover">
            Profile
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/cart" underline="hover">
            Cart
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/login" underline="hover">
            Login
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/register" underline="hover">
            Register
          </MuiLink>
        </li>
        <li>
          <MuiLink component={Link} to="/admin" underline="hover">
            Admin
          </MuiLink>
        </li>
      </ul>

      {/* Toast Previews */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        Toasts
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Toast type="success" title="Success" />
        <Toast type="error" title="Error" />
        <Toast type="warning" title="Warning" />
        <Toast type="info" title="Info" />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 1 }}>
        Drink Components
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 4 }}>
        {/* Category Preview */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            CategoryCard
          </Typography>
          <CategoryCard
            label="Seasonal Specials"
            image="https://via.placeholder.com/100"
            isActive={true}
            onClick={() => console.log("Clicked category")}
          />
        </Box>

        {/* Drink Preview */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            DrinkCard
          </Typography>
          <DrinkCard
            drink={{
              name: "Toasted White Chocolate Mocha",
              price: 4.8,
              stock_status: 1,
            }}
          />
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 1 }}>
        Error Fallback
      </Typography>

      <Box>
        <RetryFallback onRetry={() => console.log("Retry clicked")} />
      </Box>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Coming Soon...
      </Typography>
      <Typography variant="body2">
        Cards, Buttons, Inputs, Forms, etc.
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 1 }}>
        Modal Components
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button variant="contained" onClick={() => setModalType("input")}>
          Open SingleInputModal
        </Button>
        <Button variant="contained" onClick={() => setModalType("two")}>
          Open TwoChoicesModal
        </Button>
        <Button variant="contained" onClick={() => setModalType("info")}>
          Open InfoDisplayModal
        </Button>
      </Box>

      {/* Render selected modal */}
      {modalType === "input" && (
        <SingleInputModal
          title="Enter Something"
          inputType="text"
          placeholder="Type here..."
          validate={(val) => val.length > 0}
          errorMessage="Can't be empty"
          onCancel={() => setModalType(null)}
          onSubmit={(val) => {
            alert("Submitted: " + val);
            setModalType(null);
          }}
        />
      )}

      {modalType === "two" && (
        <TwoChoicesModal
          title="Are you sure?"
          confirmLabel="Yes"
          cancelLabel="No"
          onConfirm={() => {
            alert("Confirmed!");
            setModalType(null);
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "info" && (
        <InfoDisplayModal
          title="Example Info Modal"
          onClose={() => setModalType(null)}
        >
          <p>This is a static info modal preview for the quarry.</p>
          <ul>
            <li>Expandable content area</li>
            <li>Back arrow top-right</li>
            <li>Reusable for help/info</li>
          </ul>
        </InfoDisplayModal>
      )}
    </Box>
  );
}

export default Quarry;
