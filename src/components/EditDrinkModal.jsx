import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import FillerHero from "../assets/FILLER_HERO_IMG.jpg";

function EditDrinkModal({ drink, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
  });

  useEffect(() => {
    if (drink) {
      setFormData({
        name: drink.name || "",
        description: drink.description || "",
        price: drink.price || "",
        category: drink.category || "",
        tags: drink.tags || "",
      });
    }
  }, [drink]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!drink) return null;

  return (
    <Dialog open onClose={onCancel} maxWidth="md" fullWidth>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Image Section */}
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            backgroundImage: `url(${FillerHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: 200, md: "auto" },
            borderTopLeftRadius: 1,
            borderBottomLeftRadius: { md: 1 },
          }}
        />

        {/* Form Section */}
        <Box flex={1} p={3}>
          <Typography variant="h5" mb={3}>Edit Drink</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={handleChange("description")}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <Box display="flex" gap={2} flexWrap="wrap">
              <div style={{ flex: 1, minWidth: "120px" }}>
                <label style={labelStyle}>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={handleChange("price")}
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1, minWidth: "120px" }}>
                <label style={labelStyle}>Category</label>
                <select
                  value={formData.category}
                  onChange={handleChange("category")}
                  style={selectStyle}
                >
                  <option value="">Select Category</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                  <option value="food">Food</option>
                </select>
              </div>
            </Box>

            <div>
              <label style={labelStyle}>Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={handleChange("tags")}
                style={inputStyle}
              />
            </div>
          </Box>

          <DialogActions sx={{ mt: 3, justifyContent: "space-between" }}>

            <button className="btn btn--primary" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn btn--outline" onClick={onCancel}>
              Cancel
            </button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "2px solid #FD6100",
  outline: "none",
  backgroundColor: "#fefaf7",
  color: "#333",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border 0.2s ease, box-shadow 0.2s ease",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage:
    'url("data:image/svg+xml;utf8,<svg fill="%23FD6100" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>")',
  backgroundRepeat: "no-repeat",
  backgroundPositionX: "calc(100% - 1rem)",
  backgroundPositionY: "center",
  backgroundSize: "1rem",
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginBottom: "0.3rem",
  display: "block",
  textAlign: "left",
};

export default EditDrinkModal;
