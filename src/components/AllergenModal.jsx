import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

const allergensList = [
  "Milk",
  "Eggs",
  "Peanuts",
  "Soy",
  "Wheat/Gluten",
  "Sesame",
  "Coconut",
  "Oats",
  "Chocolate",
  "Corn",
  "Cinnamon",
];

const AllergenModal = ({ open, onClose, onSave }) => {
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const isMobile = useMediaQuery("(max-width:720px)");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && Array.isArray(user.allergens)) {
      setSelectedAllergens(user.allergens);
    }
  }, [open]);

  const handleToggle = (allergen) => {
    setSelectedAllergens((prevSelected) =>
      prevSelected.includes(allergen)
        ? prevSelected.filter((a) => a !== allergen)
        : [...prevSelected, allergen]
    );
  };
  const handleSave = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    fetch(
      "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/update_allergens.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          allergens: selectedAllergens,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // ✅ update sessionStorage
          const updatedUser = { ...user, allergens: selectedAllergens };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));

          // ✅ tell parent
          onSave(selectedAllergens);
        } else {
          alert("Failed to update allergens.");
        }
      })
      .catch((err) => {
        console.error("Allergen update failed:", err);
        alert("Something went wrong while saving.");
      })
      .finally(() => {
        onClose();
      });
  };

  const handleTryClose = () => {
    if (
      window.confirm(
        "Are you sure you want to leave? Your allergen preferences will not be saved."
      )
    ) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleTryClose}>
      <Box
        sx={{
          backgroundColor: "var(--background)",
          color: "var(--text)",
          borderRadius: isMobile ? 0 : 4,
          p: isMobile ? 2 : 4,
          width: isMobile ? "100vw" : "60%",
          height: isMobile ? "100vh" : "auto",
          margin: isMobile ? 0 : "auto",
          mt: isMobile ? 0 : 10, // ✅ adds margin-top ONLY on desktop
          overflowY: isMobile ? "scroll" : "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          outline: "none",
        }}
      >
        {/* Top-right Close (X) Button */}
        <IconButton
          onClick={handleTryClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "var(--text)",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 1,
          }}
        >
          <Typography variant="h2" component="h2" fontSize="2rem">
            Allergens
          </Typography>
          <Tooltip title="Select all allergens that apply, then save." arrow>
            <IconButton
              sx={{
                color: "var(--primary)",
              }}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* RED WARNING */}
        <Typography
          sx={{
            color: "red",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textAlign: "center",
            mb: 2,
          }}
        >
          REMEMBER TO MAKE AN API PULL TO UPDATE THIS
        </Typography>

        {/* Toggles */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {allergensList.map((allergen) => {
            const isSelected = selectedAllergens.includes(allergen);
            return (
              <Box
                key={allergen}
                sx={{
                  backgroundColor: "var(--card)",
                  border: "2px solid var(--component-border)",
                  borderRadius: "16px",
                  padding: "12px 16px",
                  minWidth: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {allergen}
                </Typography>

                <Button
                  onClick={() => handleToggle(allergen)}
                  variant="contained"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: isSelected
                      ? "var(--success)"
                      : "var(--danger)",
                    color: "var(--button-text)",
                    borderRadius: "30px",
                    px: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? "var(--success)"
                        : "var(--danger)",
                      opacity: 0.9,
                    },
                  }}
                  className="btn"
                >
                  {isSelected ? (
                    <>
                      <CheckCircleIcon sx={{ mr: 1 }} />
                      ON
                    </>
                  ) : (
                    <>
                      <CancelIcon sx={{ mr: 1 }} />
                      OFF
                    </>
                  )}
                </Button>
              </Box>
            );
          })}
        </Box>

        {/* Footer Buttons (Save left, Cancel right) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 4,
            mb: isMobile ? 4 : 0,
          }}
        >
          <button className="btn btn--primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn--outline" onClick={handleTryClose}>
            Cancel
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AllergenModal;
