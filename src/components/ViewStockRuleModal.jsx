import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const ViewStockRuleModal = ({ open, onClose, rule }) => {
  if (!rule) return null;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box
        sx={{
          backgroundColor: "var(--card)",
          borderRadius: "12px",
          padding: "24px",
          width: "80%",
          maxWidth: "600px",
          boxShadow: 24,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "var(--heading-color)",
            marginBottom: "16px",
            fontWeight: "600",
            fontSize: "1.2rem",
          }}
        >
          Stock Rule Details
        </Typography>

        <Box sx={{ marginBottom: "12px" }}>
          <Typography variant="body1" sx={{ color: "var(--text)", fontSize: "1rem" }}>
            <strong>Ingredient Group:</strong> {rule.ingredient_group}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "12px" }}>
          <Typography variant="body1" sx={{ color: "var(--text)", fontSize: "1rem" }}>
            <strong>Default Expiry (Days):</strong> {rule.default_expiry}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "12px" }}>
          <Typography variant="body1" sx={{ color: "var(--text)", fontSize: "1rem" }}>
            <strong>Description:</strong> {rule.description}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "16px" }}>
          <Typography variant="body1" sx={{ color: "var(--text)", fontSize: "1rem" }}>
            <strong>Items in Group:</strong>{" "}
            {rule.ingredients
              ? rule.ingredients.split(",").map((item, index) => (
                  <span key={index}>{item.trim()}</span>
                )).reduce((prev, curr) => [prev, ", ", curr])
              : ""}
          </Typography>
        </Box>

        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            color: "var(--primary)",
            borderColor: "var(--primary)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "var(--primary)",
            },
            marginTop: "20px",
            padding: "8px 16px",
            fontSize: "1rem",
            borderRadius: "8px",
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ViewStockRuleModal;
