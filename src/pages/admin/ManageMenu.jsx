import React, { useState } from "react";
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import RetryFallback from "../../components/RetryFallback";
import Toast from "../../components/Toast";
import TwoChoicesModal from "../../components/TwoChoices";
import {
  Box,
  Select,
  Tabs,
  Tab,
  Typography,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  Collapse,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMediaQuery } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ManageMenu() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userRole = user?.role || "unknown"; // admin, manager, customer
  const userStoreId = user?.store_id || null;
  const selectedStoreIdFromSession = sessionStorage.getItem("selectedStoreId");
  const [storeId, setStoreId] = useState(selectedStoreIdFromSession || userStoreId || "");
  

  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:520px)");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);
  const [toggleTarget, setToggleTarget] = useState(null);

  const {
    data: stores,
    error: storesError,
    retry: retryStores,
    isLoading: storesLoading,
  } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php`
  );

  const {
    data: drinks,
    error,
    retry,
    isLoading,
  } = useFetchWithRetry(
    stores && (storeId || stores[0]?.id)
      ? `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/read_drinks.php?store_id=${
          storeId || stores[0]?.id
        }`
      : null
  );

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectStore = (newId) => {
    setStoreId(newId);
    const selectedStore = stores?.find(
      (store) => store.id.toString() === newId
    );
    if (selectedStore) {
      sessionStorage.setItem("selectedStoreId", newId);
      sessionStorage.setItem("selectedStoreName", selectedStore.store_name);
    }
    handleCloseMenu();
    window.location.reload();
  };

  const selectedStore = stores && stores.length > 0
  ? stores.find((store) => store.id.toString() === storeId.toString())
  : null;

  // If admin has no assigned store, block page
  const isBlockedAdmin = userRole === "admin" && !userStoreId;

  const filteredDrinks = Array.isArray(drinks)
    ? drinks.filter((drink) => {
        const combined = Object.values(drink).join(" ").toLowerCase();
        return combined.includes(search.toLowerCase());
      })
    : [];

  const handleToggleClick = async (drink) => {
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
            admin_id: admin_id,
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

        retry(); // ✅ Refresh drink list automatically
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
  const handleRealToggle = async (drink) => {
    setToggleTarget(null); // Close modal immediately

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
            admin_id: admin_id,
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

        retry(); // ✅ Refresh drinks after toggle
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
    <Box sx={{ padding: 4 }}>
      {storesLoading && <p>Loading stores...</p>}
      {storesError ? (
        <RetryFallback onRetry={retryStores} />
      ) : (
        <>
          <h1>Menu Management</h1>
          <Typography sx={{ marginBottom: 2 }}>
            Manage your store's drink menu, customizations, and seasonal
            templates here.
          </Typography>

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
          {isBlockedAdmin ? (
            <Box
              sx={{
                backgroundColor: "#ffebee", // Light red background
                border: "2px solid #f44336", // Red border
                padding: 4,
                borderRadius: 2,
                textAlign: "center",
                color: "#c62828", // Strong dark red text
              }}
            >
              <ErrorOutlineIcon
                sx={{ fontSize: 60, color: "#f44336", mb: 2 }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, marginBottom: 2 }}
              >
                No Store Assigned
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                You are not assigned to any store yet. Please contact a manager.
              </Typography>
            </Box>
          ) : (
            <>
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
                    You are not assigned to a store. Contact a manager to assign
                    you.
                  </Typography>
                ) : (
                  <Box
                    onClick={
                      userRole === "manager" ? handleOpenMenu : undefined
                    }
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
                          userRole === "manager"
                            ? "rgba(0, 0, 0, 0.05)"
                            : "transparent",
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
                        fontSize: "1.2rem",
                      }}
                    >
                      {selectedStore
                        ? selectedStore.store_name
                        : "Unknown Store"}
                    </Typography>
                    {userRole === "manager" && (
                      <ArrowDropDownIcon fontSize="medium" />
                    )}
                  </Box>
                )}

                {userRole === "manager" && (
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    {stores?.map((store) => (
                      <MenuItem
                        key={store.id}
                        onClick={() => handleSelectStore(store.id.toString())}
                      >
                        {store.store_name}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>

              {/* Tabs */}
              {isSmallScreen ? (
                <Select
                  value={activeTab}
                  onChange={(e) => setActiveTab(Number(e.target.value))}
                  sx={{
                    minWidth: 200,
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  <MenuItem value={0}>Menu Items</MenuItem>
                  <MenuItem value={1}>Customizations</MenuItem>
                  <MenuItem value={2}>Templates</MenuItem>
                </Select>
              ) : (
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="inherit"
                  TabIndicatorProps={{
                    style: { backgroundColor: "var(--primary)" },
                  }}
                  sx={{
                    marginBottom: 4,
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                    "& .MuiTabs-flexContainer": {
                      justifyContent: { xs: "center", md: "flex-start" },
                    },
                    "& .MuiTab-root": {
                      color: "var(--text)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      minWidth: 120,
                      paddingX: 2,
                      flexShrink: 0,
                    },
                    "& .Mui-selected": {
                      color: "var(--primary)",
                    },
                  }}
                >
                  <Tab label="Menu Items" />
                  <Tab label="Customizations" />
                  <Tab label="Templates" />
                </Tabs>
              )}

              {/* Content */}
              {activeTab === 0 && (
                <>
                  <Collapse in={open} timeout="auto" unmountOnExit>
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
                        <button
                          className="btn btn--primary"
                          onClick={() =>
                            setToast({
                              type: "info",
                              title: "Feature Coming Soon",
                              message:
                                "Adding new drinks will be available shortly!",
                            })
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            padding: "10px 18px",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                            gap: "8px",
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <Add />
                          Add Drink
                        </button>
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
                                onClick={() => setToggleTarget(params.row)}
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
                                {params.row.is_out_of_stock === 1
                                  ? "Turn ON"
                                  : "Turn OFF"}
                              </button>
                            ),
                          },
                          {
                            field: "description",
                            headerName: "Description",
                            flex: 2,
                          },
                          { field: "price", headerName: "Price", flex: 0.6 },
                          {
                            field: "category",
                            headerName: "Category",
                            flex: 1,
                          },
                          { field: "tags", headerName: "Tags", flex: 1.2 },
                        ]}
                        disableRowSelectionOnClick
                        hideFooterPagination
                        localeText={{
                          noRowsLabel: "No drinks match this search",
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
                </>
              )}

              {activeTab === 1 && (
                <>
                  <h2>Manage Customizations</h2>
                  <p>
                    This section allows you to manage the availability of drink
                    customizations like milk options, syrups, and toppings.
                  </p>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <h2>Manage Seasonal Templates</h2>
                  <p>
                    This section allows managers to switch between different
                    seasonal menus (e.g., winter menu, spring menu).
                  </p>
                </>
              )}
            </>
          )}
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
        </>
      )}
    </Box>
  );
}

export default ManageMenu;
