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

// Mapping of allergen names to their IDs
const allergensMap = {
  Milk: 1,
  Eggs: 2,
  Peanuts: 3,
  Soy: 4,
  "Wheat/Gluten": 5,
  Sesame: 6,
  Coconut: 7,
  Oats: 8,
  Chocolate: 9,
  Corn: 10,
  Cinnamon: 11,
};

const allergensList = Object.keys(allergensMap);

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
    const allergenId = allergensMap[allergen];
    setSelectedAllergens((prev) =>
      prev.includes(allergenId)
        ? prev.filter((id) => id !== allergenId)
        : [...prev, allergenId]
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
          const updatedUser = { ...user, allergens: selectedAllergens };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
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
          width: isMobile ? "100vw" : "600px",
          height: isMobile ? "100vh" : "auto",
          m: isMobile ? 0 : "auto",
          mt: isMobile ? 0 : 10,
          overflowY: "auto",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <IconButton
          onClick={handleTryClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "var(--text)" }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // ✅ centers the whole group
            gap: 1,
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Allergens</h2>
          <Tooltip title="Select all allergens that apply, then save." arrow>
            <InfoOutlinedIcon sx={{ color: "var(--primary)", cursor: "pointer" }} />
          </Tooltip>
        </Box>


        {/* <Typography
          sx={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          REMEMBER TO MAKE AN API PULL TO UPDATE THIS
        </Typography> */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {allergensList.map((allergen) => {
            const isSelected = selectedAllergens.includes(allergensMap[allergen]);

            return (
              <Box
                key={allergen}
                onClick={() => handleToggle(allergen)}
                sx={{
                  backgroundColor: "var(--card)",
                  border: "2px solid var(--component-border)",
                  borderRadius: "16px",
                  padding: "12px",
                  minWidth: "140px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "var(--hover-bg, #eee)",
                  },
                }}
              >
                <Typography fontWeight={600}>{allergen}</Typography>
                <Button
                  variant="contained"
                  sx={{
                    pointerEvents: "none", // ← let clicks pass to parent Box
                    backgroundColor: isSelected ? "var(--success)" : "var(--danger)",
                    color: "var(--button-text)",
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 2,
                  }}
                >
                  {isSelected ? (
                    <>
                      <CheckCircleIcon sx={{ mr: 1 }} /> ON
                    </>
                  ) : (
                    <>
                      <CancelIcon sx={{ mr: 1 }} /> OFF
                    </>
                  )}
                </Button>
              </Box>
            );
          })}

        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: "auto",
            mb: isMobile ? 2 : 0,
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
