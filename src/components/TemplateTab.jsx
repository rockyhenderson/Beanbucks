import React, { useState, useEffect } from "react";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import Toast from "../components/Toast";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

function TemplateTab({ storeId, setToast }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch templates list
  const {
    data: templatesData,
    error: templatesError,
    retry: retryTemplates,
    isLoading: templatesLoading,
  } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_templates.php?store_id=${storeId}`
  );

  // Load templates data when available
  useEffect(() => {
    if (templatesData && Array.isArray(templatesData)) {
      setTemplates(templatesData);
      setLoading(false);
    } else {
      setToast({
        type: "error",
        title: "Data Error",
        message: "Templates data is not in the expected format.",
      });
      setLoading(false);
    }
  }, [templatesData]);

  const handleToggleTemplate = async (templateId, activate) => {
    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/templates/toggle_template.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template_id: templateId,
            activate: activate ? 1 : 0,
          }),
        }
      );

      const result = await response.json();
      console.log("API Response:", result); // Check what the response looks like

      if (response.ok && result.success) {
        setToast({
          type: "success",
          title: "Template Updated",
          message: result.message,
        });
        retryTemplates(); // Refresh templates list
      } else {
        throw new Error(result.error || "Failed to update template");
      }
    } catch (err) {
      setToast({
        type: "error",
        title: "Error",
        message: err.message,
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {templatesLoading ? (
        <Typography>Loading templates...</Typography>
      ) : templatesError ? (
        <RetryFallback onRetry={retryTemplates} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Manage Templates
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            Switch between different saved menu templates (e.g., winter, spring).
          </Typography>

          <List>
            {templates.map((template) => (
              <ListItem key={template.id} sx={{ display: "flex", alignItems: "center" }}>
                <ListItemText primary={template.name} />
                <Button
                  variant="contained"
                  color={template.is_active ? "secondary" : "primary"}
                  onClick={() => handleToggleTemplate(template.id, !template.is_active)}
                >
                  {template.is_active ? "Deactivate" : "Activate"}
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}

export default TemplateTab;
