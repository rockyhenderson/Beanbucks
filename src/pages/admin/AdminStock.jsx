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
import EditStockModal from "../../components/EditStockModal";


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
  const [expiryFilter, setExpiryFilter] = useState("");
  const [recentSave, setRecentSave] = useState(false);

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

  const [showSummaryStats, setShowSummaryStats] = useState(true);
  const [showInventoryTable, setShowInventoryTable] = useState(true);

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
  const stockRows = Array.isArray(stockData?.data)
    ? stockData.data
      .filter((item) => item.id != null) // ✅ Filter out rows without ID
      .map((item) => ({
        id: item.id,
        name: item.ingredient_name || "Unnamed",
        stock: parseInt(item.stock_quantity ?? "0", 10),
        unit: item.unit || "unit",
        threshold: parseInt(item.threshold ?? "0", 10),
        expiry_date: item.expiry_date ? new Date(item.expiry_date) : null,
        is_out_of_stock: item.is_out_of_stock === "1" || item.is_out_of_stock === 1,
      }))
    : [];




  console.log("✅ stockData raw:", stockData);
  console.log("✅ stockRows parsed:", stockRows);
  const now = new Date();

  const filteredData = stockRows.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "urgent"
        ? item.is_out_of_stock === true ||
        item.stock === 0 ||
        (item.expiry_date instanceof Date
          ? item.expiry_date < now
          : new Date(item.expiry_date) < now)
        : true;


    const matchesUnit = unit ? item.unit === unit : true;
    const matchesExpiry =
      expiryFilter === "soon"
        ? item.expiry_date && item.expiry_date <= new Date(now.getTime() + 3 * 86400000)
        : true;

    return matchesSearch && matchesFilter && matchesUnit && matchesExpiry;
  });


  console.log("✅ filteredData result:", filteredData);

  const outOfStock = stockRows.filter(
    (d) => d.stock === 0 || d.is_out_of_stock === true
  ).length;
  const oosPercentage = stockRows.length > 0 ? (outOfStock / stockRows.length) * 100 : 0;

  const oosColor =
    oosPercentage > 90
      ? "#28a745" // Green
      : oosPercentage > 70
        ? "#ffc107" // Yellow
        : "#dc3545"; // Red

  const belowThreshold = stockRows.filter((d) => d.stock < d.threshold).length;
  const lowestItem = [...stockRows].sort((a, b) => a.stock - b.stock)[0];

  const uniqueUnits = [...new Set(stockRows.map((d) => d.unit))];

  const handleSave = async (updatedItem) => {
    try {
      // 1. Update stock
      const res1 = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/update_stock_quantity.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updatedItem.id, stock_quantity: updatedItem.stock }),
      });
      const data1 = await res1.json();
      if (!data1.success) throw new Error("Failed to update stock.");

      // 2. Update threshold
      const res2 = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/update_threshold.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updatedItem.id, threshold: updatedItem.threshold }),
      });
      const data2 = await res2.json();
      if (!data2.success) throw new Error("Failed to update threshold.");

      // 3. Update expiry date
      const res3 = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/update_expiry_date.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updatedItem.id, expiry_date: updatedItem.expiry_date }),
      });
      const data3 = await res3.json();
      if (!data3.success) throw new Error("Failed to update expiry date.");
      // 4. Update out of stock flag
      const res4 = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/update_out_of_stock.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updatedItem.id, is_out_of_stock: updatedItem.is_out_of_stock }),
      });
      const data4 = await res4.json();
      if (!data4.success) throw new Error("Failed to update out of stock status.");

      // ✅ Show global toast
      setToast({
        type: "success",
        title: "Saved",
        message: "Stock successfully updated!",
      });

      setSelected(null);
      setOpen(false);

      setRecentSave(true); // ✅ block expired warning for a few seconds

      setTimeout(() => {
        setRecentSave(false); // re-enable warning
      }, 3000);

      retryStock(); // ✅ fetch data immediately



      setSelected(null);
      setOpen(false);
      retryStock(); // reload table
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Something went wrong.",
      });

    }
  };



  const handleSelectStore = (id) => {
    setStoreId(id);
    const store = stores?.find((s) => s.id.toString() === id);
    const name = store?.store_name || "Unknown Store";
    sessionStorage.setItem("selectedStoreId", id);
    sessionStorage.setItem("selectedStoreName", name);
    retryStock(); // 👈 trigger a refetch instead of reload
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
  useEffect(() => {
    if (storesError) {
      setToast({
        type: "error",
        title: "Failed to Load Stores",
        message: "Could not fetch the list of stores. Please try again later.",
      });
    }
  }, [storesError]);
  const expiringSoon = stockRows.filter(d =>
    d.expiry_date &&
    d.expiry_date > now &&
    d.expiry_date <= new Date(now.getTime() + 3 * 86400000)
  ).length;


  const riskLevel =
    outOfStock + belowThreshold === 0
      ? "Low"
      : outOfStock > 3 || belowThreshold > 5
        ? "High"
        : "Medium";

  const stockRiskSummary = `${riskLevel} — ${outOfStock} OOS, ${belowThreshold} low`;

  const riskColor =
    riskLevel === "Low" ? "#28a745" : riskLevel === "Medium" ? "#ffc107" : "#dc3545";
  const expiredCount = stockRows.filter(
    (d) => d.expiry_date instanceof Date && d.expiry_date < now
  ).length;
  useEffect(() => {
    if (!stockLoading && expiredCount > 0 && !recentSave) {
      setToast({
        type: "error",
        title: "Expired Stock",
        message: `You have ${expiredCount} ingredient${expiredCount > 1 ? "s" : ""} out of date.`,
      });
    }

  }, [stockLoading, expiredCount]);
  const getBackgroundFromColor = (color) => {
    if (color === "#28a745") return "rgba(40, 167, 69, 0.1)";   // green
    if (color === "#ffc107") return "rgba(255, 193, 7, 0.15)";  // yellow
    if (color === "#dc3545") return "rgba(220, 53, 69, 0.1)";   // red
    return "rgba(0,0,0,0.03)"; // default fallback
  };
  const getColorFromPercent = (pct) => pct < 10 ? "#28a745" : pct < 30 ? "#ffc107" : "#dc3545";

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>

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
        <p style={{
          fontStyle: "italic",
          color: "var(--text)",
          fontSize: "0.9rem",
          margin: 0,
        }}>
          Your Selected Store
        </p>


        {userRole === "admin" && !userStoreId ? (
          <p style={{
            color: "red",
            fontWeight: "bold",
            marginTop: "8px"  // equivalent to MUI's `marginTop: 1`
          }}>
            You are not assigned to a store. Contact a manager to assign you.
          </p>

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
            <h2 style={{ fontWeight: 600, marginRight: "1rem", color: "var(--primary)", fontSize: selectedStore?.store_name ? "1.2rem" : "1rem" }}>
              {selectedStore?.store_name || "Unknown Store"}
            </h2>

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
      {expiredCount > 0 && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "2px solid #f5c6cb",
            borderRadius: "10px",
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <ReportProblemOutlined style={{ fontSize: "2.5rem", color: "#dc3545" }} />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: "bold" }}>
              {expiredCount} Ingredient{expiredCount > 1 ? "s" : ""} Expired!
            </h2>
            <p style={{ marginTop: "0.4rem", fontSize: "1rem", lineHeight: 1.4 }}>
              Please mark them as <strong>out of stock</strong> immediately to prevent drink issues.
            </p>
          </div>
          <button
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "0.7rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => alert("MORE CODE HERE")}
          >
            Resolve Now
          </button>

        </div>
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
            mb: showSummaryStats ? 2 : 0,
          }}
        >
          <h2 style={{ margin: 0, color: "var(--heading-color)" }}>Operational Stock Metrics</h2>
          <Button
            onClick={() => setShowSummaryStats((prev) => !prev)}
            sx={{ color: "var(--primary)", minWidth: 0, padding: 1 }}
          >
            {showSummaryStats ? <ExpandLess /> : <ExpandMore />}
          </Button>

        </Box>




        <Collapse in={showSummaryStats}>
          <Grid container spacing={2}>
            {[
              {
                label: "Total Ingredients",
                value: stockRows.length,
                tip: `This represents the total number of unique ingredients currently tracked for this store.

Includes all ingredients regardless of stock level, expiry status, or threshold.`,
              },
              {
                label: "Out of Stock",
                value: outOfStock,
                percent: oosPercentage,
                tip: `Ingredients that are completely out of stock (stock = 0) or are flagged as manually marked out of stock.

${Math.round(oosPercentage)}% of tracked ingredients are currently out of stock.

Severity:
- 🟢 Less than 10% = Healthy
- 🟡 10–30% = Warning
- 🔴 Over 30% = Critical

Used to determine store-wide stock risk level.`,
              },
              {
                label: "Below Threshold",
                value: belowThreshold,
                percent: stockRows.length > 0 ? (belowThreshold / stockRows.length) * 100 : 0,
                tip: `Ingredients where the current stock is below the configured minimum threshold.

This helps flag ingredients that are not yet out of stock, but are **running low**.

% is based on total number of tracked ingredients.`,
              },
              {
                label: "Lowest Stock Item",
                value: lowestItem ? `${lowestItem.name} (${lowestItem.stock})` : "N/A",
                fixedIcon: WaterDropOutlined,
                tip: `This shows the ingredient with the **lowest available stock count** in the store.

Useful for quickly identifying the most urgent refill candidate that is still in stock.`,
              },
              {
                label: "Expiring Soon",
                value: `${expiringSoon} ingredients`,
                percent: stockRows.length > 0 ? (expiringSoon / stockRows.length) * 100 : 0,
                tip: `Ingredients that will expire within the next 3 days (today + 3 days ahead).

Helps identify stock that may become unusable soon and should be prioritized or removed.

% is based on the total number of ingredients with a valid expiry date.`,
              },
              {
                label: "Stock Risk Level",
                value: stockRiskSummary,
                percent: outOfStock + belowThreshold > 0 ? 100 : 0,
                tip: `An overall summary of the store's inventory health, combining both Out of Stock and Below Threshold items.

Examples:
- "Low — 0 OOS, 0 low" = ✅ Fully stocked
- "Medium — 2 OOS, 5 low" = ⚠️ Needs attention
- "High — 6 OOS, 9 low" = 🔥 Critical shortages

This value directly affects the color and icon of this card.`,
              },
            ]
              .map((stat, i) => {
                const percent = stat.percent ?? 0;
                const color = getColorFromPercent(percent);
                const bg = getBackgroundFromColor(color);

                // Pick icon based on status or fallback
                let IconComponent = stat.fixedIcon;
                if (!IconComponent) {
                  IconComponent =
                    color === "#28a745"
                      ? Inventory2Outlined // ✅ green = good
                      : color === "#ffc107"
                        ? ShieldOutlined // ⚠️ yellow = warning
                        : ReportProblemOutlined; // 🔴 red = bad
                }

                return (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: bg,
                        border: `1px solid ${color}`,
                        height: "100%",
                        boxShadow: "0 0 0 1px var(--component-border)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconComponent sx={{ color, mr: 1 }} />
                          <p
                            style={{
                              fontStyle: "italic",
                              color: "var(--text)",
                              fontSize: "0.9rem",
                              margin: 0,
                            }}
                          >
                            {stat.label}
                          </p>
                        </Box>
                        <Tooltip
                          title={
                            <div style={{ fontSize: "0.9rem", lineHeight: 1.4, maxWidth: 220 }}>
                              {stat.tip}
                            </div>
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
                      <p
                        style={{
                          fontWeight: 600,
                          color,
                          margin: 0,
                        }}
                      >
                        {stat.value}
                      </p>
                    </Box>
                  </Grid>
                );
              })}


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
          <h2 style={{ marginBottom: "1rem" }}>Ingredient Inventory</h2>

          <IconButton
            onClick={() => setShowInventoryTable((prev) => !prev)}
            sx={{ color: "var(--primary)" }}
          >
            {showInventoryTable ? <ExpandLess /> : <ExpandMore />}
          </IconButton>


        </Box>

        <Collapse in={showInventoryTable} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: "100%",
                maxWidth: 240,
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

            {/* Unit filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--primary)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--primary)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--primary)",
                  },
                },
              }}
            >
              <InputLabel id="unit-filter-label">Unit</InputLabel>
              <Select
                labelId="unit-filter-label"
                value={unit}
                label="Unit"
                onChange={(e) => setUnit(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueUnits.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Out of Stock filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "var(--primary)" },
                  "&:hover fieldset": { borderColor: "var(--primary)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--primary)" },
                },
              }}
            >
              <InputLabel id="stock-filter-label">Stock Filter</InputLabel>
              <Select
                labelId="stock-filter-label"
                value={filter}
                label="Stock Filter"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="urgent">🚨 Urgent Issues</MenuItem>
              </Select>
            </FormControl>




          </Box>


          <Box sx={{ width: "100%", backgroundColor: "var(--card)" }}>
            {!stockLoading && (
              filteredData.length === 0 ? (
                <p style={{
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  fontStyle: "italic",
                  color: "gray",
                  textAlign: "center"
                }}>
                  No stock data available for this store.
                </p>

              ) : (
                <DataGrid
                  autoHeight
                  rows={filteredData}
                  getRowClassName={(params) => {
                    const isExpired =
                      params.row.expiry_date instanceof Date
                        ? params.row.expiry_date < new Date()
                        : new Date(params.row.expiry_date) < new Date();

                    if (params.row.is_out_of_stock) return "row-oos";
                    if (isExpired) return "row-expired";
                    return "";
                  }}


                  columns={[
                    {
                      field: "name",
                      headerName: "Ingredient",
                      flex: 1,
                      renderCell: (params) => {
                        const isExpired =
                          params.row.expiry_date instanceof Date
                            ? params.row.expiry_date < new Date()
                            : new Date(params.row.expiry_date) < new Date();

                        const iconStyle = {
                          fontSize: "1.2rem",
                          marginRight: "0.5rem",
                        };

                        let icon = null;

                        if (params.row.is_out_of_stock) {
                          icon = <span style={{ ...iconStyle, color: "#dc3545" }}>❌</span>;
                        } else if (isExpired) {
                          icon = <span style={{ ...iconStyle, color: "#ffc107" }}>⚠️</span>;
                        }

                        return (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            {icon}
                            {params.row.name}
                          </div>
                        );
                      },
                    },


                    {
                      field: "stock",
                      headerName: "Stock",
                      flex: 0.6,
                      renderCell: (params) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {params.row.stock}

                        </div>
                      )
                    },

                    { field: "unit", headerName: "Unit", flex: 0.6 },
                    {
                      field: "expiry_date",
                      headerName: "Expiry Date",
                      flex: 1,
                      renderCell: (params) => {
                        const date = params.row?.expiry_date;
                        if (!date) return "N/A";

                        // Safely format whether it's a Date or a string
                        const d = date instanceof Date ? date : new Date(date);
                        return d.toLocaleDateString();
                      }
                    }

                    ,


                    { field: "threshold", headerName: "Minimum Threshold", flex: 0.6 },
                    {
                      field: "edit",
                      headerName: "Edit",
                      flex: 0.5,
                      sortable: false,
                      renderCell: (params) => (
                        <Button
                          onClick={() => handleEdit(params.row)}
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            paddingX: 2,
                            paddingY: 0.5,
                            borderRadius: "8px",
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
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'var(--accent)',
                      color: 'var(--text)',
                      fontWeight: 'bold',
                      borderBottom: '1px solid var(--component-border)',
                    },
                    '& .MuiDataGrid-row': {
                      borderBottom: '1px solid var(--component-border)',
                    },
                    '& .row-oos': {
                      backgroundColor: 'rgba(220, 53, 69, 0.1)', // light red
                      '&:hover': {
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                      },
                    },
                    '& .row-expired': {
                      backgroundColor: 'rgba(255, 193, 7, 0.15)', // light yellow
                      '&:hover': {
                        backgroundColor: 'rgba(255, 193, 7, 0.25)',
                      },
                    },
                  }}


                />
              )
            )}
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

      {selected && (
        <EditStockModal
          open={open}
          onClose={handleClose}
          onSave={handleSave}
          item={selected}
        />


      )}

    </Box>
  );
}

export default AdminStock;
