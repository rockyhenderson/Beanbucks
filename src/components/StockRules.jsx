import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Collapse, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Toast from "./Toast";
import EditExpiryModal from "./EditExpiryModal";

const StockRules = () => {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [selectedRule, setSelectedRule] = useState(null); // State for the selected rule to edit
  const [stockRules, setStockRules] = useState([]); // State to store fetched stock rules
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [toast, setToast] = useState(null); // State for toast notifications
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const storeId = sessionStorage.getItem("selectedStoreId") || "1"; // Get store ID from session

  // Columns for the DataGrid
  const columns = [
    {
      field: "ingredient_group",
      headerName: "Ingredient Group",
      flex: 1,
      headerClassName: "header-style",
    },
    {
      field: "default_expiry",
      headerName: "Default Expiry (Days)",
      flex: 1,
      headerClassName: "header-style",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      headerClassName: "header-style",
    },
   {
  field: "ingredients",
  headerName: "Items in Group", // Changed header to "Items in Group"
  flex: 2,
  headerClassName: "header-style",
  renderCell: (params) => {
    // Log the raw value of ingredients to see the incoming data
    console.log("Raw ingredients value:", params.value);

    // Split the comma-separated ingredients into an array
    const ingredients = params.value ? params.value.split(",") : [];
    console.log("Split ingredients:", ingredients);

    // Log the individual ingredients after trimming spaces
    const trimmedIngredients = ingredients.map((ingredient) => ingredient.trim());
    console.log("Trimmed ingredients:", trimmedIngredients);

    return (
      <div>
        {trimmedIngredients.map((ingredient, index) => (
          <div key={index}>{ingredient}</div> // Ensure each ingredient is displayed on a new line
        ))}
      </div>
    );
  },
},


    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedRule(params.row); // Set the selected rule
            setModalOpen(true); // Open the modal
          }}
          sx={{
            textTransform: "none",
            color: "var(--primary)",
            borderColor: "var(--primary)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "var(--primary)",
            },
          }}
        >
          Edit
        </Button>
      ),
    },
  ];




  // Fetch stock rules from the API
  const fetchStockRules = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/get_stock_rules.php?store_id=${storeId}`
      );
      const result = await response.json();

      if (result.success) {
        setStockRules(result.data); // Update stock rules state
        setToast({
          type: "success",
          title: "Success",
          message: "Stock rules loaded successfully.",
        });
      } else {
        throw new Error(result.message || "Failed to fetch stock rules.");
      }
    } catch (error) {
      setToast({
        type: "error",
        title: "Error",
        message: error.message || "An error occurred while fetching stock rules.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock rules on component mount
  useEffect(() => {
    fetchStockRules();
  }, [storeId]);

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filtered data based on search query
  const filteredStockRules = stockRules.filter((rule) =>
    rule.ingredient_group.toLowerCase().includes(searchQuery) ||
    rule.description.toLowerCase().includes(searchQuery)
  );

  return (
    <Box
      sx={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--component-border)",
        borderRadius: 2,
        padding: 3,
        marginBottom: 4,
      }}
    >
      {/* Header with Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: open ? 2 : 0,
        }}
      >
        <h2 style={{ margin: 0, color: "var(--heading-color)" }}>Stock Rules</h2>
        <IconButton onClick={() => setOpen((prev) => !prev)} sx={{ color: "var(--primary)" }}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Search Bar */}
      <TextField
        label="Search Stock Rules"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{
          marginBottom: "1rem",
          backgroundColor: "var(--card)",
          "& .MuiInputBase-root": {
            borderColor: "var(--component-border)",
          },
        }}
      />

      {/* Collapsible Section */}
      <Collapse in={open}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            autoHeight // Automatically adjusts height to fit rows
            rows={filteredStockRules} // Use filtered rows
            columns={columns}
            disableRowSelectionOnClick
            hideFooterPagination
            loading={loading} // Show loading indicator
            getRowId={(row) => row.rule_id} // Use rule_id as unique row ID
            sx={{
              color: "var(--text)",
              borderColor: "var(--component-border)",
              backgroundColor: "var(--card)",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--accent)",
                color: "var(--text)",
                fontWeight: "bold",
                borderBottom: "1px solid var(--component-border)",
              },
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid var(--component-border)",
              },
              "& .MuiDataGrid-cell": {
                color: "var(--text)",
              },
            }}
          />
        </Box>
      </Collapse>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Edit Expiry Modal */}
      <EditExpiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rule={selectedRule}
        onSave={(updatedRule) => {
          setStockRules((prevRules) =>
            prevRules.map((rule) => (rule.rule_id === updatedRule.rule_id ? updatedRule : rule))
          );
          setToast({
            type: "success",
            title: "Success",
            message: "Stock rule updated successfully.",
          });
          setModalOpen(false);
        }}
        setToast={setToast} // Pass setToast here
      />
    </Box>
  );
};

export default StockRules;
