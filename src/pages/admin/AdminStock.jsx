import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Menu,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Collapse from "@mui/material/Collapse"; // add this at top
import {
  Inventory2Outlined,
  WarningAmberOutlined,
  ReportProblemOutlined,
  WaterDropOutlined,
  AccessTimeOutlined,
  CalendarTodayOutlined,
  ShieldOutlined,
  HelpOutline,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import RetryFallback from "../../components/RetryFallback";
import { DataGrid } from "@mui/x-data-grid";
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import Toast from "../../components/Toast";


const storeOptions = [
  { id: "101", name: "Store #101" },
  { id: "102", name: "Store #102" },
  { id: "103", name: "Store #103" },
];

function AdminStock() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userRole = user?.role || "unknown";
  const userStoreId = user?.store_id || null;
  const sessionStoreId = sessionStorage.getItem("selectedStoreId");
  const [toast, setToast] = useState(null);
  const [storeId, setStoreId] = useState(sessionStoreId || userStoreId || "101");
  const {
    data: stores,
    error: storesError,
    retry: retryStores,
    isLoading: storesLoading,
  } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php`
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedStore =
    stores && stores.length > 0
      ? stores.find((store) => store.id.toString() === storeId.toString())
      : null;

  const [showStats, setShowStats] = useState(true); // Add to state
  const tileStyle = {
    p: 2,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.03)",
    height: "100%",
    boxShadow: "0 0 0 1px var(--component-border)",
  };
  const {
    data: stockData,
    error: stockError,
    retry: retryStock,
    isLoading: stockLoading,
  } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/read_stock_for_store.php?store_id=${storeId}`
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [unit, setUnit] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpen(false);
  };

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const stockRows = Array.isArray(stockData?.data) ? stockData.data : [];
  const filteredData = stockRows.filter((item) => {
    const matchesSearch =
  item.name?.toLowerCase().includes(search.toLowerCase()) ?? false;

    const matchesFilter =
      filter === "low" ? item.stock < item.threshold : filter === "out" ? item.stock === 0 : true;
    const matchesUnit = unit ? item.unit === unit : true;
    return matchesSearch && matchesFilter && matchesUnit;
  });

  const outOfStock = stockRows.filter((d) => d.stock === 0).length;
  const belowThreshold = stockRows.filter((d) => d.stock < d.threshold).length;
  const lowestItem = [...stockRows].sort((a, b) => a.stock - b.stock)[0];

  const uniqueUnits = [...new Set(stockRows.map((d) => d.unit))];


  const handleSelectStore = (id) => {
    setStoreId(id);
    const store = stores?.find((s) => s.id.toString() === id);
    const name = store?.store_name || "Unknown Store";
    sessionStorage.setItem("selectedStoreId", id);
    sessionStorage.setItem("selectedStoreName", name);
    window.location.reload(); // optional, or manually trigger a refetch
  };
  useEffect(() => {
    if (stockError) {
      setToast({
        type: "error",
        title: "Failed to Load Stock",
        message: "Could not fetch stock for this store. Please try again later.",
      });
    }
  }, [stockError]);


  return (
    <Box sx={{ p: 4 }}>
      {stockLoading && <p>Loading stock data...</p>}
      {stockError && <RetryFallback onRetry={retryStock} />}
      <h1 style={{ color: "var(--heading-color)" }}>Admin Stock</h1>
      {storesLoading && <p>Loading stores...</p>}
      {storesError && <RetryFallback onRetry={retryStores} />}

      {/* Store Switcher */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          marginBottom: 4,
          gap: 0.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontStyle: "italic",
            color: "var(--text)",
            fontSize: "0.9rem",
            margin: 0,
          }}
        >
          Your Selected Store
        </Typography>

        {userRole === "admin" && !userStoreId ? (
          <Typography
            variant="body1"
            sx={{
              color: "red",
              fontWeight: "bold",
              marginTop: 1,
            }}
          >
            You are not assigned to a store. Contact a manager to assign you.
          </Typography>
        ) : (
          <Box
            onClick={userRole === "manager" ? handleOpenMenu : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: userRole === "manager" ? "pointer" : "default",
              paddingX: 2,
              paddingY: 1,
              paddingLeft: 0,
              borderRadius: 2,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor:
                  userRole === "manager" ? "rgba(0, 0, 0, 0.05)" : "transparent",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                marginRight: 1,
                color: "var(--primary)",
                fontSize: selectedStore?.store_name ? "1.2rem" : "1rem",
              }}
            >
              {selectedStore?.store_name || "Unknown Store"}
            </Typography>
            {userRole === "manager" && <ArrowDropDownIcon fontSize="medium" />}
          </Box>
        )}

        {userRole === "manager" && (
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            {stores?.map((store) => (
              <MenuItem key={store.id} onClick={() => handleSelectStore(store.id.toString())}>
                {store.store_name}
              </MenuItem>
            ))}

          </Menu>
        )}
      </Box>


      {userRole === "manager" && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {stores?.map((store) => (
            <MenuItem key={store.id} onClick={() => handleSelectStore(store.id.toString())}>
              {store.store_name}
            </MenuItem>
          ))}

        </Menu>
      )}
      {/* Summary Header Card */}
      <Paper
        sx={{
          backgroundColor: "var(--card)",
          color: "var(--body-text)",
          border: "1px solid var(--component-border)",
          borderRadius: 2,
          padding: 3,
          marginBottom: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: showStats ? 2 : 0,
          }}
        >
          <h2 style={{ margin: 0, color: "var(--heading-color)" }}>Operational Stock Metrics</h2>
          <Button
            onClick={() => setShowStats((prev) => !prev)}
            sx={{
              minWidth: 0,
              padding: 1,
              color: "var(--primary)",
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            {showStats ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </Box>




        <Collapse in={showStats}>
          <Grid container spacing={2}>
            {[
              {
                icon: <Inventory2Outlined sx={{ color: "var(--primary)", mr: 1 }} />,
                label: "Total Ingredients",
                value: 18, // temporary hardcoded
                tip: "The total number of unique ingredients tracked in this store.",
              },
              {
                icon: <ReportProblemOutlined sx={{ color: "#dc3545", mr: 1 }} />,
                label: "Out of Stock",
                value: 2, // temporary hardcoded
                tip: "Ingredients with 0 remaining stock — currently unavailable and may block orders.",
              },
              {
                icon: <WarningAmberOutlined sx={{ color: "#ffcf40", mr: 1 }} />,
                label: "Below Threshold",
                value: 5, // temporary hardcoded
                tip: "Ingredients that are running low — their stock is below the warning level set by a manager.",
              },
              {
                icon: <WaterDropOutlined sx={{ color: "#17a2b8", mr: 1 }} />,
                label: "Lowest Stock Item",
                value: "Sugar (1)", // temporary hardcoded
                tip: "The ingredient with the lowest current stock count in the store.",
              },
              {
                icon: <CalendarTodayOutlined sx={{ color: "#c62828", mr: 1 }} />,
                label: "Expiring Soon",
                value: "2 ingredients", // temporary hardcoded
                tip: "Ingredients that will expire within the next 3 days based on their set expiry dates.",
              },
              {
                icon: <ShieldOutlined sx={{ color: "#ff9800", mr: 1 }} />,
                label: "Stock Risk Level",
                value: "Medium — 2 OOS, 5 low", // temporary hardcoded
                tip: "A quick overview of inventory health. 'Medium — 2 OOS, 5 low' means 2 items are out of stock and 5 are running low.",
              },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box sx={tileStyle}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {stat.icon}
                      <Typography variant="subtitle2" sx={{ color: "var(--heading-color)" }}>
                        {stat.label}
                      </Typography>
                    </Box>
                    <Tooltip
                      title={
                        <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.4, maxWidth: 220 }}>
                          {stat.tip}
                        </Typography>
                      }
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "var(--card)",
                            color: "var(--text)",
                            border: "1px solid var(--component-border)",
                            boxShadow: 2,
                            px: 2,
                            py: 1,
                          },
                        },
                      }}
                    >
                      <IconButton size="small" sx={{ color: "var(--text)", p: 0 }}>
                        <HelpOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

        </Collapse>





      </Paper>



      <Box
        sx={{
          marginTop: 4,
          padding: 2,
          borderRadius: "12px",
          backgroundColor: "var(--card)",
          border: "1px solid var(--component-border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ingredient Inventory
          </Typography>
          <IconButton onClick={() => setShowStats((prev) => !prev)}>
            {showStats ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={showStats} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search..."
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
                  "& fieldset": { borderColor: "var(--component-border)" },
                  "&:hover fieldset": { borderColor: "var(--primary)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--primary)" },
                },
              }}
            />
          </Box>

          <Box sx={{ width: "100%", backgroundColor: "var(--card)" }}>
            {!stockLoading && filteredData.length === 0 && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  mb: 2,
                  fontStyle: "italic",
                  color: "gray",
                  textAlign: "center",
                }}
              >
                No stock data available for this store.
              </Typography>
            )}

            <DataGrid
              autoHeight
              rows={filteredData}
              columns={[
                { field: "name", headerName: "Ingredient", flex: 1 },
                { field: "stock", headerName: "Stock", flex: 0.6 },
                { field: "unit", headerName: "Unit", flex: 0.6 },
                { field: "threshold", headerName: "Threshold", flex: 0.6 },
                {
                  field: "edit",
                  headerName: "Edit",
                  flex: 0.5,
                  sortable: false,
                  renderCell: (params) => (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(params.row)}
                    >
                      Edit
                    </Button>
                  ),
                },
              ]}

              disableRowSelectionOnClick
              hideFooterPagination
              getRowId={(row) => row.id}
              localeText={{
                noRowsLabel: "No ingredients match your filters.",
              }}
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
      </Box>

      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            animation: "slideDown 0.3s ease-out",
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


    </Box>
  );
}

export default AdminStock;
