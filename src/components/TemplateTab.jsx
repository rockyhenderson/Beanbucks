import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import TwoChoicesModal from "../components/TwoChoices";


const PREDEFINED_TEMPLATES = [
  {
    id: 1,
    name: "Classic Core",
    mockAdds: ["Espresso", "Americano", "Cappuccino"],
    season: "Year-Round",
  },
  {
    id: 2,
    name: "Haunted Brews",
    mockAdds: ["Peppermint Mocha", "Gingerbread Latte", "Eggnog Latte"],
    season: "Spooky Season",
  },
  {
    id: 3,
    name: "Petal Burst",
    mockAdds: ["Lavender Cold Brew", "Cherry Blossom Tea", "Honey Matcha"],
    season: "Spring Awakening",
  },
  {
    id: 4,
    name: "Sunset Sips",
    mockAdds: ["Iced Lemonade", "Coconut Cold Brew", "Tropical Refresher"],
    season: "Summer Vibes",
  },
  {
    id: 5,
    name: "Crimson Chill",
    mockAdds: ["Pumpkin Spice Latte", "Maple Cold Brew", "Cinnamon Tea"],
    season: "Fall Drops",
  },
  {
    id: 6,
    name: "Earthy & Oaty",
    mockAdds: ["Oat Latte", "Almond Flat White", "Soy Cappuccino"],
    season: "Plant-Based",
  },
];


function TemplateTab({ setToast }) {
  const [activeTemplateIds, setActiveTemplateIds] = useState([1]);
  const [expandedTemplateId, setExpandedTemplateId] = useState(null);
  const [templateDrinks, setTemplateDrinks] = useState({});
  const [pendingToggleId, setPendingToggleId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleToggleTemplate = (id) => {
    const isActive = activeTemplateIds.includes(id);

    if (id === 1) return; // Default can’t be toggled

    if (!isActive) {
      // Activating — show confirmation
      setPendingToggleId(id);
      setShowConfirmModal(true);
    } else {
      // Deactivating — instant
      toggleTemplate(id, 0);
    }
  };



  const toggleExpand = (id) => {
    setExpandedTemplateId((prev) => (prev === id ? null : id));
  };


  const getSeasonColor = (season) => {
    switch (season) {
      case "Year-Round":
        return "#6c5ce7"; // Vibrant purple
      case "Spooky Season":
        return "#d63031"; // Bold red-orange
      case "Spring Awakening":
        return "#00b894"; // Bright teal green
      case "Summer Vibes":
        return "#fdcb6e"; // Sunny yellow
      case "Fall Drops":
        return "#e17055"; // Burnt orange
      case "Plant-Based":
        return "#55efc4"; // Minty green
      default:
        return "#b2bec3"; // Neutral gray
    }
  };
  
  const {
    data: drinkData,
    error: fetchError,
    isLoading,
  } = useFetchWithRetry(
    "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/get_all_drinks_grouped_by_template.php"
  );
  useEffect(() => {
    if (drinkData) {
      const mapped = {};
      for (const group of drinkData) {
        mapped[group.template_id] = group.drinks;
      }
      setTemplateDrinks(mapped);
    }
  }, [drinkData]);

  useEffect(() => {
    if (fetchError) {
      setToast({
        type: "error",
        title: "Failed to Load Drinks",
        message: "Could not load real drinks for templates.",
      });
    }
  }, [fetchError]);
const toggleTemplate = (id, newStatus) => {
  const admin = JSON.parse(sessionStorage.getItem("user"));  // Retrieve admin info from session storage
  const adminId = admin?.id;  // Get the admin ID

  if (!adminId) {
    setToast({
      type: "error",
      title: "Admin Not Logged In",
      message: "You must be logged in as an admin to make this change.",
    });
    return;
  }

  fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/toggle_template.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      template_id: id,
      new_status: newStatus,
      admin_id: adminId  // Include admin ID in the request payload
    })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) throw new Error(data.message || "Unknown error");

    const updated = newStatus === 1
      ? [...activeTemplateIds, id]
      : activeTemplateIds.filter(tid => tid !== id && tid !== 1);

    setActiveTemplateIds(updated);

    setToast({
      type: newStatus === 1 ? "success" : "info",
      title: newStatus === 1 ? "Template Activated" : "Template Deactivated",
      message: `The "${PREDEFINED_TEMPLATES.find(t => t.id === id).name}" template is now ${newStatus === 1 ? "active" : "inactive"}.`
    });
  })
  .catch(err => {
    console.error("Toggle error:", err);
    setToast({
      type: "error",
      title: "Failed to Toggle Template",
      message: err.message || "Something went wrong when updating the template status."
    });
  });
};

  useEffect(() => {
    fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/get_active_templates.php")
      .then((res) => res.json())
      .then((data) => {
        // Always include default (ID 1) as active
        setActiveTemplateIds([1, ...data]);
      })
      .catch((err) => {
        console.error("Failed to fetch active templates:", err);
        setToast({
          type: "error",
          title: "Failed to Load Template States",
          message: "Could not determine which templates are active.",
        });
      });
  }, []);

  return (
    <Box sx={{

      maxWidth: "1400px",
      margin: "0 auto"
    }}>
     <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
  Menu Templates
</Typography>


      <Typography variant="body1" sx={{
        mb: 4,

        fontSize: "1.1rem",
        maxWidth: "800px"
      }}>
        Activate seasonal or specialty templates to update menu offerings across all stores.
        Multiple templates can be active simultaneously.
      </Typography>

      <Grid container spacing={3}>
        {PREDEFINED_TEMPLATES.map((template) => {
          const isActive = activeTemplateIds.includes(template.id);
          const isExpanded = expandedTemplateId === template.id;
          const isDefault = template.id === 1;

          return (
            <Grid item xs={12} sm={6} lg={4} key={template.id}>
              <Paper
                elevation={isExpanded ? 6 : 3}
                sx={{
                  p: 3,

                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: isActive ? "var(--card)" : "var(--card)",

                  borderLeft: `4px solid ${isActive ? "#ee5c01" : "#e0e0e0"}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                  }
                }}
              >
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1
                }}>
                  <Box>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}>
                      {isActive ? (
                        <CheckCircleIcon color="primary" fontSize="small" />
                      ) : (
                        <RadioButtonUncheckedIcon fontSize="small" sx={{ color: "#bdbdbd" }} />
                      )}
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.season}
                      size="small"
                      sx={{
                        backgroundColor: getSeasonColor(template.season),
                        color: "white",
                        fontSize: "0.7rem",
                        height: "20px",
                        mt: 0.5
                      }}
                    />
                  </Box>
                  <IconButton
                    onClick={() => toggleExpand(template.id)}
                    size="small"
                    sx={{
                      color: isExpanded ? "#ee5c01" : "#7f8c8d",
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>

                <Button
                  fullWidth
                  variant={isActive ? "outlined" : "contained"}
                  onClick={() => handleToggleTemplate(template.id)}
                  disabled={isDefault}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    borderRadius: "8px",
                    backgroundColor: isActive ? "transparent" : "#f97f2e",  // lighter orange
                    color: isActive ? "var(--primary)" : "white",
                    border: isActive ? "2px solid var(--primary)" : "none",
                    "&:hover": {
                      backgroundColor: isActive ? "#ffe8d9" : "#d45301"  // faded bg or darker orange
                    }
                  }}
                >
                  {isActive ? "Deactivate" : "Activate"}
                  {isDefault && " (Always Active)"}
                </Button>



                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{
                      color: "#7f8c8d",
                      mb: 1,
                      fontWeight: 500
                    }}>
                      Included Items:
                    </Typography>
                    <List dense sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      py: 0
                    }}>
                      {(template.id === 1 ? template.mockAdds : (templateDrinks[template.id] || [])).map((item, idx, arr) => {
                        const name = typeof item === "string" ? item : item.name;

                        return (
                          <ListItem
                            key={idx}
                            sx={{
                              borderBottom: idx < arr.length - 1 ? "1px solid #e0e0e0" : "none",
                              py: 1
                            }}
                          >
                            <ListItemText
                              primary={name}
                              primaryTypographyProps={{
                                sx: {
                                  fontWeight: 500,
                                  color: "#2c3e50"
                                }
                              }}
                            />
                          </ListItem>
                        );
                      })}


                    </List>
                  </Box>
                </Collapse>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      {showConfirmModal && (
        <TwoChoicesModal
          title={`Activate "${PREDEFINED_TEMPLATES.find(t => t.id === pendingToggleId)?.name}" Template?`}
          text="This will make drinks in this template available across all stores."
          confirmLabel="Yes, Activate"
          cancelLabel="Cancel"
          onConfirm={() => {
            toggleTemplate(pendingToggleId, 1);
            setShowConfirmModal(false);
            setPendingToggleId(null);
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setPendingToggleId(null);
          }}
        />
      )}

    </Box>
  );
}

export default TemplateTab;