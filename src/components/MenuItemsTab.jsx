import React, { useState } from "react";
import useFetchWithRetry from "../utils/useFetchWithRetry";
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
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import TwoChoicesModal from "./TwoChoices";
import EditDrinkModal from "./EditDrinkModal"; // 🆕 import the modal

function MenuItemsTab({ storeId, setToast }) {
  const [search, setSearch] = useState("");
  const [toggleTarget, setToggleTarget] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null); // 🆕 for the edit modal

  const {
    data: drinks,
    error,
    retry,
    isLoading,
  } = useFetchWithRetry(
    storeId
      ? `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/read_drinks.php?store_id=${storeId}`
      : null
  );

  const filteredDrinks = Array.isArray(drinks)
    ? drinks.filter((drink) => {
        const combined = Object.values(drink).join(" ").toLowerCase();
        return combined.includes(search.toLowerCase());
      })
    : [];

  const handleRealToggle = async (drink) => {
    setToggleTarget(null);
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const admin_id = user?.id;

    if (!admin_id) {
      setToast({
        type: "error",
        title: "Authentication Error",
        message: "Admin ID not found. Please log in again.",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/toggle_drink.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id: storeId,
            drink_id: drink.id,
            admin_id,
          }),
        }
      );

      const raw = await response.text();
      let result;
      try {
        result = JSON.parse(raw);
      } catch (err) {
        throw new Error("Invalid JSON from server");
      }

      if (response.ok && result.message) {
        setToast({
          type: "success",
          title: "Drink Updated",
          message: result.message,
        });
        retry();
      } else {
        throw new Error(result.error || "Unknown server error");
      }
    } catch (err) {
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Something went wrong",
      });
    }
  };

  return (
    <>
<Collapse in={true} timeout="auto" unmountOnExit>
<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
  Manage Menu Items
</Typography>

  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "stretch", sm: "center" },
      marginBottom: 2,
      gap: { xs: 2, sm: 0 },
    }}
  >
    {/* ...Search Field and Buttons */}

          <TextField
            size="small"
            placeholder="Search drinks..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: 300,
              input: {
                color: "var(--text)",
                backgroundColor: "var(--card)",
                borderRadius: "4px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--component-border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary)",
                },
              },
            }}
          />

          <Box sx={{ flexShrink: 0 }}>

          </Box>
        </Box>

        <Box sx={{ width: "100%", backgroundColor: "var(--card)" }}>
          <DataGrid
            autoHeight
            rows={filteredDrinks}
            columns={[
              { field: "id", headerName: "ID", flex: 0.4 },
              { field: "name", headerName: "Name", flex: 1 },
              {
                field: "toggle",
                headerName: "Toggle",
                flex: 0.8,
                sortable: false,
                renderCell: (params) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🛑 stop row click opening edit modal
                      setToggleTarget(params.row);
                    }}
                    style={{
                      backgroundColor:
                        params.row.is_out_of_stock === 1
                          ? "#E53935"
                          : "#43A047",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    {params.row.is_out_of_stock === 1 ? "Turn ON" : "Turn OFF"}
                  </button>
                ),
              },
              { field: "description", headerName: "Description", flex: 2 },
              { field: "price", headerName: "Price", flex: 0.6 },
              { field: "category", headerName: "Category", flex: 1 },
              { field: "tags", headerName: "Tags", flex: 1.2 },
            ]}
            onRowClick={(params) => setSelectedDrink(params.row)} // 🆕 open modal
            disableRowSelectionOnClick
            hideFooterPagination
            localeText={{ noRowsLabel: "No drinks match this search" }}
            sx={{
              color: "var(--text) !important",
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
            }}
          />
        </Box>
      </Collapse>

      {/* Toggle Modal */}
      {toggleTarget && (
        <TwoChoicesModal
          title="Confirm Drink Toggle"
          text={`Are you sure you want to close orders for ${toggleTarget.name}?`}
          confirmLabel="Yes, Close Orders"
          cancelLabel="No, Go Back"
          onConfirm={() => handleRealToggle(toggleTarget)}
          onCancel={() => setToggleTarget(null)}
        />
      )}

      {/* Edit Drink Modal */}
      {selectedDrink && (
        <EditDrinkModal
          drink={selectedDrink}
          onCancel={() => setSelectedDrink(null)}
          onSave={() => {
            // you can add save logic later if you want
            setSelectedDrink(null);
          }}
        />
      )}
    </>
  );
}

export default MenuItemsTab;
