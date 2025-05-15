import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Collapse, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Toast from "./Toast";
import EditExpiryModal from "./EditExpiryModal";
import ViewStockRuleModal from "./ViewStockRuleModal";

const StockRules = () => {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [selectedRule, setSelectedRule] = useState(null); // State for the selected rule to edit
  const [stockRules, setStockRules] = useState([]); // State to store fetched stock rules
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [toast, setToast] = useState(null); // State for toast notifications
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const storeId = sessionStorage.getItem("selectedStoreId") || "1";
  const [viewModalOpen, setViewModalOpen] = useState(false);  // For View Stock Rule Modal
  const [editModalOpen, setEditModalOpen] = useState(false);  // For Edit Expiry Modal




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
        const ingredients = params.value
          ? params.value.split(",").map((ingredient) => ingredient.trim()).join(", ")
          : "";
        return <span>{ingredients}</span>;
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
      onClick={(event) => {
        event.stopPropagation();  // Stop the row click from firing
        setSelectedRule(params.row); // Set the selected rule
        setEditModalOpen(true); // Open the Edit Modal
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
}


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
  const filteredStockRules = stockRules.filter((rule) => {
    const groupMatch = rule.ingredient_group.toLowerCase().includes(searchQuery);
    const descriptionMatch = rule.description.toLowerCase().includes(searchQuery);
    const ingredientsMatch = rule.ingredients?.toLowerCase().includes(searchQuery);
    return groupMatch || descriptionMatch || ingredientsMatch;
  });


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
    marginBottom: open ? 1 : 0,
  }}
>
  <h2 style={{ margin: 0, color: "var(--heading-color)" }}>Stock Rules</h2>
  <IconButton onClick={() => setOpen((prev) => !prev)} sx={{ color: "var(--primary)" }}>
    {open ? <ExpandLess /> : <ExpandMore />}
  </IconButton>
</Box>

{open && (
  <p
    style={{
      marginTop: 0,
      marginBottom: "1.5rem",
      color: "var(--text)",
      fontSize: "0.95rem",
      lineHeight: 1.5,
    }}
  >
    These rules define default expiry durations and groupings of ingredients for automated stock expiry logic.
  </p>
)}


      {/* Search Bar */}
      <TextField
        size="small"
        placeholder="Search Stock Rules..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{
          width: "100%",
          maxWidth: 240,
          marginBottom: "1rem",
          input: {
            color: "var(--text)",
            backgroundColor: "var(--card)",
            borderRadius: "4px",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--primary)", // default border
            },
            "&:hover fieldset": {
              borderColor: "var(--primary)", // on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--primary)", // on focus
            },
          },
        }}
      />


      {/* Collapsible Section */}
      <Collapse in={open}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            autoHeight
            rows={filteredStockRules}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterPagination
            loading={loading}
            getRowId={(row) => row.rule_id}
            onRowClick={(param) => {
              setSelectedRule(param.row); // Set the selected rule
              setViewModalOpen(true); // Open the View Modal
            }}
            sx={{
              cursor: "pointer",
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
{/* View Stock Rule Modal */}
<ViewStockRuleModal
  open={viewModalOpen}
  onClose={() => setViewModalOpen(false)}
  rule={selectedRule}
/>

{/* Edit Expiry Modal */}
<EditExpiryModal
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
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
    setEditModalOpen(false);
  }}
  setToast={setToast}
/>

    </Box>
  );
};

export default StockRules;
