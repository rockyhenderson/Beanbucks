import React, { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import RetryFallback from "../../components/RetryFallback";
import { useEffect } from "react";
import TwoChoicesModal from "../../components/TwoChoices";
import Toast from "../../components/Toast";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, Typography, IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BaristaSettingsModal from "../../components/BaristaSettingsModal";

function BaristaSecurePortal() {
  const [orders, setOrders] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [lowStock, setLowStock] = useState([]); // Store the low stock data

  const [storeNames, setStoreNames] = useState([]); // Store the fetched store names
  const [storeName, setStoreName] = useState(""); // Store the current store name
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false); // local toggle state
  const [expandedDrinks, setExpandedDrinks] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [toastType, setToastType] = useState("error"); // 'error' | 'success'
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem("soundEnabled") !== "false" // default to true
  );
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const orderPing = new Audio("/sounds/IncomingOrder.mp3");
  const orderDoneSound = new Audio("/sounds/OrderDone.mp3");

  orderPing.volume = 1;
  orderDoneSound.volume = 1;
  const [selectedStore, setSelectedStore] = useState(() => {
    const user = sessionStorage.getItem("user"); // Get the 'user' string from sessionStorage
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the string into an object
        const storeId = parsedUser.store_id || ""; // Get the store_id
        const role = parsedUser.role || ""; // Get the role

        // Log the retrieved values
        // console.log("✅Store ID:", storeId);
        // console.log("✅Role:", role);

        return {
          storeId,
          role,
        };
      } catch (error) {
        console.error("Error parsing 'user' from sessionStorage:", error);
      }
    }
    return { storeId: "", role: "" }; // Default values if no user data is found
  });
  const role = selectedStore.role; // Extract the role from the state
  const storeId = selectedStore.storeId;
  const fetchLowStockData = async (storeId) => {
    try {
      const response = await fetch(
        `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/portal/lowest_stock.php?store_id=${storeId}`
      );

      // Check if the response is ok (status 200)
      if (!response.ok) {
        throw new Error("Failed to fetch low stock data");
      }

      // Parse JSON response
      const data = await response.json();

      // Check if the response contains data
      if (data.success) {
        console.log("Low stock data:", data.data);
        setLowStock(data.data); // Update the lowStock state with the fetched data
      } else {
        console.error("Error:", data.message); // Log the error message if there's no data
      }
    } catch (error) {
      console.error("Error fetching low stock data:", error);
    }
  };

  const { data, error, retry, isLoading } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/portal/request_drinks.php?store_id=${sessionStorage.getItem(
      "selectedStoreId"
    )}`
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", storedTheme);
    setTheme(storedTheme);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("soundEnabled", next.toString());
  };
  const handleToggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };
  useEffect(() => {
    const storedSound = localStorage.getItem("soundEnabled");
    if (storedSound !== null) setSoundEnabled(storedSound === "true");
  }, []);
  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      // 🔔 Detect new orders
      if (data.data.length > orders.length) {
        orderPing
          .play()
          .catch((err) =>
            console.warn("🔇 Couldn't play new order sound:", err)
          );
      }

      setOrders(data.data); // Update order state
      setShowErrorToast(false);
    }
  }, [data, error]);

  useEffect(() => {
    // Fetch store names from the backend
    const fetchStoreNames = async () => {
      try {
        // console.log("✅ Fetching store names...");
        const response = await fetch(
          "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/portal/read_store_names.php"
        );
        const data = await response.json();
        // console.log("✅ Store names fetched:", data);

        if (data.success) {
          setStoreNames(data.data); // Store the fetched store names
          // console.log("✅ Store names set in state:", data.data);

          // Retrieve selectedStoreId from the sessionStorage
          const selectedStoreId = Number(storeId); // Ensure it is a number
          // console.log("✅ Selected store ID (from storeId):", selectedStoreId);

          // Log the current store names data and check types for comparison
          // console.log("✅ Store names list:", data.data);

          // Ensure selectedStoreId is a number before comparing
          const selectedStore = data.data.find(
            (store) => Number(store.id) === selectedStoreId // Convert store.id to a number
          );

          // console.log("✅ Found selected store:", selectedStore);

          if (selectedStore) {
            setStoreName(selectedStore.name); // Set the store name immediately
            // console.log("✅ Store name set to:", selectedStore.name);
          } else {
            setStoreName("Unknown Store"); // Fallback if no matching store is found
            // console.log("✅ Store name set to: Unknown Store");
          }
        } else {
          console.warn("❌ Failed to fetch store names. Response:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching store names:", error);
      }
    };

    fetchStoreNames();
  }, [storeId]); // Re-run when storeId changes

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("[poll] Refetching order data...");
      retry();
    }, 5000);

    return () => clearInterval(interval);
  }, [retry]);

  function extractCustomisationList(obj) {
    if (!obj || typeof obj !== "object") return [];
    const parts = [];

    if (obj.size) parts.push(obj.size);
    if (obj.milk && obj.milk !== "None") parts.push(obj.milk + " Milk");
    if (obj.shots) parts.push(`${obj.shots} Shot${obj.shots > 1 ? "s" : ""}`);

    if (obj.syrups && typeof obj.syrups === "object") {
      const syrups = Object.entries(obj.syrups)
        .filter(([_, amt]) => amt > 0)
        .map(([name, amt]) => `${amt}x ${name}`);
      parts.push(...syrups);
    }

    if (Array.isArray(obj.toppings) && obj.toppings.length > 0) {
      parts.push(`Toppings: ${obj.toppings.join(", ")}`);
    }

    return parts;
  }

  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      // console.log("✅ Orders loaded successfully.");
      // console.log("Raw orders data from API:", data.data);

      setOrders(data.data); // ✅ Use the raw data directly (includes full drink objects, IDs, ingredients, etc.)
      setShowErrorToast(false);
    }

    if (error) {
      console.warn("❌ Error fetching orders");
      setShowErrorToast(true);
      if (!data) {
        setOrders([]);
      }
    }
  }, [data, error]);

  // Handle and show toast on any error (including network loss)
  useEffect(() => {
    if (error) {
      console.warn("❌ Network or fetch error detected. Showing toast.");
      setShowErrorToast(true);
    }
  }, [error]);

  const markAsCompleted = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
  };

  const completeOrder = async (order) => {
    try {
      const payload = {
        order_id: Number(order.order_id ?? order.id),
        user_id: Number(order.user_id),
        store_id: Number(storeId), // FIXED: Use global
        pickup_time: order.pickup_time,
        total_price: Number(order.total_price) || 0, // FIXED: Fallback to 0
        drinks: order.drinks.map((drink) => ({
          drink_id: drink.drink_id,
          qty: drink.quantity,
          customizations: drink.customizations,
          base_ingredients: drink.base_ingredients,
        })),
      };

      // console.log("🔍 Sending order payload:", payload);

      const res = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/portal/mark_order_done.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (result.success) {
        orderDoneSound
          .play()
          .catch((err) => console.warn("🔇 Couldn't play done sound:", err));
        markAsCompleted(order.order_id);
      } else {
        console.warn("❌ Error completing order:", result.message);
      }
    } catch (err) {
      console.error("❌ Network error while completing order:", err);
      setErrorMessage(
        "Order could not be completed. Please try again or check your connection."
      );
      setShowErrorToast(true);
    }
  };

  const getTimeElapsed = (placedAt) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(placedAt)) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };
  const navigate = useNavigate();
  const getPickupStatus = (pickupTime) => {
    console.log("getPickupStatus received pickupTime:", pickupTime); // Debugging log

    // Check if pickupTime is valid
    if (!pickupTime || typeof pickupTime !== "string") {
      console.log("Invalid pickupTime received:", pickupTime); // Log if pickupTime is missing or incorrect
      return { label: "Invalid Time", bgColor: "grey" };
    }

    // Format the time as needed
    const formattedTime = pickupTime.replace(" ", "T");
    console.log("Formatted pickupTime:", formattedTime); // Log the formatted time

    // Try to parse the formatted time
    const pickup = new Date(formattedTime);
    console.log("Parsed pickup time:", pickup);

    // Check if the parsed date is valid
    if (isNaN(pickup.getTime())) {
      console.log("Error: Invalid date format detected"); // Debugging log for invalid date
      return { label: "Invalid Time", bgColor: "grey" };
    }

    // Calculate the difference in minutes
    const now = new Date();
    const diffMin = Math.round((pickup - now) / 60000);
    console.log("Time difference in minutes:", diffMin); // Debugging log for time difference

    const isLate = diffMin < 0;
    let label = isLate ? `Late ${Math.abs(diffMin)}m` : `In ${diffMin}m`;

    let bgColor = isLate
      ? "var(--danger)"
      : diffMin <= 2
      ? "var(--warning)"
      : "var(--success)";

    return { label, bgColor };
  };

  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      console.log("✅ Orders loaded successfully.");
      console.log("Raw orders data from API:", data.data);

      setOrders(data.data); // ✅ Use the raw data directly (includes full drink objects, IDs, ingredients, etc.)
      setShowErrorToast(false);

      // Debugging the pickupTime field directly from the first order
      console.log("First order pickupTime:", data.data[0]?.pickup_time);
    }
  }, [data, error]);

  useEffect(() => {
    if (storeId) {
      fetchLowStockData(storeId); // Correct function call
      const intervalId = setInterval(() => fetchLowStockData(storeId), 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [storeId]); // Run the effect whenever storeId changes

  const handleStoreChange = (event) => {
    const newStoreId = Number(event.target.value); // Convert to number
    sessionStorage.setItem("selectedStoreId", newStoreId); // Update sessionStorage
    setSelectedStore({ ...selectedStore, storeId: newStoreId }); // Update state
    retry(); // Refetch orders for the new store
  };
  useEffect(() => {
    // Check if the storeNames and selectedStore are available
    if (storeNames.length > 0) {
      let currentStoreId = storeId;

      // If the user is an admin and no storeId is set, default to the first store
      if (role === "admin" && !storeId) {
        currentStoreId = Number(storeNames[0].id); // Default to the first store
        setSelectedStore({ ...selectedStore, storeId: currentStoreId }); // Update state
        sessionStorage.setItem("selectedStoreId", currentStoreId); // Update sessionStorage
        // console.log("✅ Default storeId set for admin:", currentStoreId);
      }

      // Find the selected store by its ID
      const selectedStore = storeNames.find(
        (store) => Number(store.id) === Number(currentStoreId)
      );

      if (selectedStore) {
        setStoreName(selectedStore.name); // Update the store name
        // console.log("✅ Store name updated to:", selectedStore.name); // Log for debugging
      } else {
        setStoreName("Unknown Store");
        // console.log("✅ Store name set to: Unknown Store");
      }
    }
  }, [storeId, storeNames, role]); // Trigger whenever storeId, storeNames, or role changes
  const handleDelayOrder = async (order) => {
    try {
      const payload = {
        order_id: order.order_id ?? order.id,
        store_id: Number(storeId),
      };

      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/portal/delay_order.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        setToastType("success");
        setErrorMessage("Order delayed by 5 minutes!");
        setShowErrorToast(true);

        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.order_id === order.order_id
              ? {
                  ...o,
                  delay_count: (o.delay_count || 0) + 1,
                  pickup_time: new Date(
                    new Date(o.pickup_time.replace(" ", "T")).getTime() +
                      5 * 60000
                  )
                    .toLocaleString("sv-SE", { hour12: false }) // "YYYY-MM-DD HH:mm:ss"
                    .replace("T", " "),
                }
              : o
          )
        );
      } else {
        setToastType("error");
        setErrorMessage(result.message || "⚠️ Failed to delay order.");
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error("❌ Network error during delay:", error);
      setToastType("error");
      setErrorMessage("❌ Network error. Could not delay order.");
      setShowErrorToast(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: {
          xs: "transparent", // On mobile, the background is transparent
          sm: "var(--background)", // For larger screens, use the normal background
        },
        padding: {
          xs: "0", // On mobile, set padding to 0
          sm: "2rem", // For larger screens, use 2rem padding
        },
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {isManager && (
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="store-select-label">Select Store</InputLabel>
          <Select
            labelId="store-select-label"
            value={storeId} // Use only the store ID here, not the full object
            onChange={handleStoreChange}
            label="Select Store"
          >
            {storeNames.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name.replace(/^BeanBucks\s*-\s*/, "")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {showErrorToast && (
        <Box
          sx={{
            position: "fixed",
            top: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <Toast
            type={toastType} // dynamic based on toastType
            title={toastType === "success" ? "Success" : "Error"}
            message={errorMessage}
            onClose={() => setShowErrorToast(false)}
          />
        </Box>
      )}
      {error && (
        <Box
          sx={{
            backgroundColor: "#ffcccc",
            color: "#8B0000",
            padding: "0.75rem 1rem",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderBottom: "2px solid #8B0000",
            position: "sticky",
            top: 0,
            zIndex: 999,
          }}
        >
          ⚠️ CONNECTION LOST — TRY REFRESHING OR CONTACT IT SUPPORT
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", // allows stacking on smaller screens
          gap: "1rem",
          marginBottom: "1.5rem",
          paddingLeft: {
            xs: "2rem", // On mobile, add 2rem padding-left
            sm: "0", // For larger screens, no padding-left
          },
          paddingRight: {
            xs: "2rem", // On mobile, add 2rem padding-right
            sm: "0", // For larger screens, no padding-right
          },
          paddingTop: {
            xs: "2rem", // On mobile, add 2rem padding-top
            sm: "0", // For larger screens, no padding-top
          },
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Barista Portal</h1>
          {role === "admin" ? (
            // Render this if the user is an admin
            <h2 style={{ margin: 0 }}>
              {storeName.replace(/^BeanBucks\s*-\s*/, "")}
            </h2>
          ) : (
            // Render this if the user is not an admin
            <h2
              style={{
                margin: 0,
                display: "flex",
                flexDirection: "column", // Stack content vertically
                alignItems: "flex-start", // Align content to the left
                gap: "0.5rem",
              }}
            >
              <FormControl variant="standard" sx={{ minWidth: "auto" }}>
                <Select
                  value={storeId} // Use storeId here, not the entire selectedStore object
                  onChange={handleStoreChange}
                  disableUnderline
                  sx={{
                    fontSize: "inherit",
                    fontWeight: "bold",
                    color: "inherit",
                    paddingLeft: 0,
                    paddingRight: 0,
                    "& .MuiSelect-icon": {
                      marginLeft: "0.25rem", // Adjust spacing for the dropdown arrow
                    },
                  }}
                >
                  {storeNames
                    .filter(
                      (store, index, self) =>
                        self.findIndex((s) => s.name === store.name) === index // Remove duplicates
                    )
                    .map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name.replace(/^BeanBucks\s*-\s*/, "")}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </h2>
          )}
        </div>

        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            fontWeight: 600,
            borderColor: "var(--primary)",
            color: "var(--primary)",
            textTransform: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "rgba(238, 92, 1, 0.1)",
              borderColor: "var(--primary)",
            },
          }}
        >
          ⬅ Back
        </Button>
      </Box>

      {/* Status + Settings Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.8rem",
          paddingLeft: {
            xs: "2rem",
            sm: "0",
          },
          paddingRight: {
            xs: "2rem",
            sm: "0",
          },
        }}
      >
        {/* Connection Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: error ? "var(--danger)" : "var(--success)",
            }}
          />
          <span
            style={{
              color: error ? "var(--danger)" : "var(--body-text)",
              fontWeight: error ? 700 : 500,
              textTransform: error ? "uppercase" : "none",
              fontSize: "1.4rem",
            }}
          >
            {error ? "Disconnected from server" : "Connected to order system"}
          </span>
        </Box>

        {/* Settings Button */}
        <Button
          variant="outlined"
          onClick={() => setSettingsOpen(true)}
          sx={{
            fontWeight: 600,
            borderColor: "var(--primary)",
            color: "var(--primary)",
            textTransform: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "rgba(238, 92, 1, 0.1)",
              borderColor: "var(--primary)",
            },
          }}
        >
          ⚙️ Settings
        </Button>
      </Box>

      {/* Orders */}
      <Box
        sx={{
          backgroundColor: error ? "#ffe6e6" : "var(--card)", // light red tint
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: {
            xs: "none", // No box shadow on mobile
            sm: "0 4px 12px rgba(0,0,0,0.08)", // Box shadow on larger screens
          },
          marginBottom: "2rem",
          paddingTop: "0.4rem",
          transition: "background-color 0.3s ease",
          backgroundColor: {
            xs: "transparent", // Transparent background on mobile
            sm: error ? "#ffe6e6" : "var(--card)", // Normal background on larger screens
          },
        }}
      >
        <h2>Incoming Orders ({orders.length})</h2>

        {!data && error ? (
          <RetryFallback onRetry={retry} isLoading={isLoading} />
        ) : orders.length === 0 && !isLoading ? (
          <p>No current orders.</p>
        ) : (
          orders.map((order) => {
            const { label, bgColor } = getPickupStatus(order.pickup_time);

            return (
              <Box
                key={order.order_id} // ✅ FIXED
                sx={{
                  backgroundColor: "--(var(--card))",
                  borderRadius: "10px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  border: "2px solid var(--primary)",
                  color: "#161620",
                }}
              >
                {/* Header Row: Customer + Timer */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",

                  }}
                >
                  {/* Left side: Order for X */}
                  <h2
                    style={{
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    Order for {order.customer_name || `User #${order.user_id}`}
                  </h2>

                  {/* Right side: Chip and delay */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Chip
                      label={label}
                      sx={{
                        backgroundColor: bgColor,
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        padding: "0 12px",
                      }}
                    />
                    {order.delay_count > 0 && (
                      <div
                        style={{
                          backgroundColor: "#fff3cd",
                          color: "#8a6d3b",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          marginTop: "0.4rem",
                          display: "inline-block",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        Delayed by {order.delay_count * 5} minute
                        {order.delay_count > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </Box>

                {/* Drinks Row */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {order.drinks.map((drink, idx) => {
                    console.log(
                      "ORDER DEBUG",
                      order.order_id,
                      order.delay_count
                    );

                    const key = `${order.order_id}-${idx}`;
                    const isExpanded = expandedDrinks[key] || false;

                    return (
                      <Box
                        key={`${order.order_id}-${drink.drink_entry_id || idx}`}
                        sx={{
                          flex: "1 1 100%",
                          position: "relative",
                          paddingRight: { xs: "0", sm: "1rem" },
                          marginRight: { xs: "0", sm: "1rem" },
                          borderBottom: "1px solid #ddd",
                          borderRight: { xs: "none", sm: "1px solid #ddd" },
                          overflowX: "auto",
                          paddingBottom: "1rem",
                        }}
                      >
                        <h4 style={{ marginBottom: "0.5rem" }}>{drink.name}</h4>

                        <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                          {extractCustomisationList(drink.customizations).map(
                            (c, i) => (
                              <li key={i}>{c}</li>
                            )
                          )}
                        </ul>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            marginTop: "0.5rem",
                            cursor: "pointer",
                            color: "var(--primary)",
                          }}
                          onClick={() =>
                            setExpandedDrinks((prev) => ({
                              ...prev,
                              [key]: !isExpanded,
                            }))
                          }
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "var(--primary)",
                              userSelect: "none",
                            }}
                          >
                            {isExpanded
                              ? "Hide Ingredients"
                              : "View Ingredients"}
                          </Typography>
                          <ExpandMoreIcon
                            sx={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease-in-out",
                            }}
                          />
                        </Box>

                        <Collapse in={isExpanded}>
                          <Box sx={{ marginTop: "0.5rem" }}>
                            {drink.base_ingredients?.map((ing, i) => (
                              <Box
                                key={i}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "0.25rem 0",
                                  borderBottom: "1px dashed #ddd",
                                  fontSize: "0.95rem",
                                }}
                              >
                                <Typography>{ing.name}</Typography>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {ing.quantity}
                                  {ing.unit}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => completeOrder(order)}
                    className="btn"
                    sx={{
                      backgroundColor: "var(--success)",
                      color: "var(--button-text)",
                      fontWeight: 600,
                      fontSize: "1.3rem",
                      padding: "1rem 2.5rem",
                      borderRadius: "12px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#218838",
                      },
                    }}
                  >
                    Done
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleDelayOrder(order)}
                    sx={{
                      color: "var(--danger)",
                      borderColor: "var(--danger)",
                      fontWeight: 600,
                      fontSize: "1.3rem",
                      padding: "1rem 2.5rem",
                      borderRadius: "12px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#8B0000",
                        borderColor: "var(--danger)",
                      },
                    }}
                  >
                    Delay +5m
                  </Button>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Stock Alerts */}
      <Box
        sx={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Added shadow for depth
          marginTop: "1rem",
          "& p": {
            color: "#000",
          },
        }}
      >
        <h3
          style={{ color: "#856404", marginBottom: "0.75rem", fontWeight: 600 }}
        >
          ⚠️ Stock Alerts
        </h3>
        {isLoading ? (
          <p style={{ fontSize: "1rem", color: "#856404", marginBottom: 0 }}>
            Loading...
          </p>
        ) : lowStock.length > 0 ? (
          lowStock.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px dashed #e0c100", // Darker shade of yellow for the line
                fontSize: "1rem",
                color: "#856404",
              }}
            >
              <p style={{ marginBottom: 0 }}>
                <strong>{item.name}</strong>
              </p>
              <p style={{ marginBottom: 0 }}>
                <b>
                  {item.stock_quantity} {item.unit}
                </b>{" "}
                remaining
              </p>
            </Box>
          ))
        ) : (
          <p style={{ fontSize: "1rem", color: "#856404", marginBottom: 0 }}>
            No low stock items.
          </p>
        )}
      </Box>
      <BaristaSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    </Box>
  );
}

export default BaristaSecurePortal;
