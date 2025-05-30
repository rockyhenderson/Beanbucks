import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TwoChoicesModal from "../components/TwoChoices";
import {
  Typography,
  Button,
  Paper,
  Divider,
  MenuItem,
  Select,
  Box,
  FormControl,
  InputLabel,
  Grid,
  OutlinedInput,
} from "@mui/material";
import Toast from "../components/Toast";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import { useMemo } from "react";
import TwoChoices from "../components/TwoChoices";

function ConfirmOrder() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [timeSlot, setTimeSlot] = useState("ASAP");
  const [confirming, setConfirming] = useState(false);
  const [selectedReward, setSelectedReward] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showStoreChangeModal, setShowStoreChangeModal] = useState(false);
  const [cardProcessing, setCardProcessing] = useState(false);
  let discountApplied = false;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role && parsed.role !== "none") {
        setIsLoggedIn(true);
      }
    } catch {
      setIsLoggedIn(false);
    }
  } else {
    setIsLoggedIn(false);
  }

  document.body.style.overflow = isLoggedIn ? "auto" : "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, [isLoggedIn]);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [toast, setToast] = useState(null);

  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser.id;

  const {
    data: loyaltyData,
    error: loyaltyError,
    retry: retryLoyalty,
    isLoading: loadingLoyalty,
  } = useFetchWithRetry(
    `/api/public/read_loyalty_points.php?id=${userId}`
  );
  const {
    data: storeData,
    error: storeError,
    retry: retryStore,
    isLoading: storeLoading,
  } = useFetchWithRetry(
    `/api/public/read_store.php?id=${selectedStore}`
  );

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("beanbucks_cart");
    if (stored) setCartItems(JSON.parse(stored));

    const storedStore = sessionStorage.getItem("selectedStoreId");
    if (storedStore) setSelectedStore(storedStore);
  }, []);

  const total = cartItems
    .reduce((sum, item) => {
      const base = parseFloat(item.price) || 2.5;
      const shotCost = 0.5 * (item.shots - 1);
      const syrupCount = Object.values(item.syrups || {}).reduce(
        (sum, n) => sum + n,
        0
      );
      const syrupCost = 0.3 * syrupCount;
      const toppingCost = 0.4 * (item.toppings?.length || 0);
      const unitPrice = base + shotCost + syrupCost + toppingCost;
      return sum + unitPrice * (item.qty || 1);
    }, 0)
    .toFixed(2);
  const applyRewardDiscount = (originalTotal, cartItems, rewardValue) => {
    let discount = 0;

    console.log("Reward being applied:", rewardValue);
    console.log("Cart items:", cartItems);

    if (rewardValue === "free-shot") {
      const drinkWithExtraShot = cartItems.find(item => item.shots > 1);
      if (drinkWithExtraShot) {
        discount = 0.5;
        console.log("Applied free-shot discount: -£0.50 for", drinkWithExtraShot.name);
      } else {
        console.log("No drink with extra shot found.");
      }
    }


    else if (rewardValue === "free-small") {
      const smallDrink = cartItems.find((item) => item.size === "Small");
      if (smallDrink) {
        discount = parseFloat(smallDrink.price);
        console.log(`Applied small drink discount: -£${discount} for`, smallDrink.name);
      } else {
        console.log("No small drink found.");
      }
    }

    else if (rewardValue === "free-large") {
      const largeDrink = cartItems.find((item) => item.size === "Large");
      if (largeDrink) {
        discount = parseFloat(largeDrink.price);
        console.log(`Applied large drink discount: -£${discount} for`, largeDrink.name);
      } else {
        console.log("No large drink found.");
      }
    }

    else if (rewardValue === "free-snack") {
      const snack = cartItems.find((item) => item.category?.toLowerCase() === "food");
      if (snack && !isNaN(parseFloat(snack.price))) {
        discount += parseFloat(snack.price);
        console.log(`Applied snack discount: -£${discount} for`, snack.name);
      } else {
        console.warn("Snack missing or has invalid price:", snack);
      }
    }


    else if (rewardValue === "free-combo") {
      const snack = cartItems.find((item) => item.category?.toLowerCase() === "food");
      const drink = cartItems.find((item) => item.category?.toLowerCase() !== "food");
      if (snack) {
        discount += parseFloat(snack.price);
        console.log(`Snack part of combo discount: -£${discount} for`, snack.name);
      } else {
        console.log("No snack found for combo.");
      }
      if (drink) {
        const drinkDiscount = parseFloat(drink.price);
        discount += drinkDiscount;
        console.log(`Drink part of combo discount: -£${drinkDiscount} for`, drink.name);
      } else {
        console.log("No drink found for combo.");
      }
    }

    const adjusted = Math.max(0, originalTotal - discount);
    console.log(`Original total: £${originalTotal} → Adjusted total: £${adjusted}`);
    return adjusted;
  };



  const adjustedTotal = useMemo(() => {
    const parsedTotal = parseFloat(total);
    if (!Number.isFinite(parsedTotal)) return 0;
    return applyRewardDiscount(parsedTotal, cartItems, selectedReward);
  }, [total, cartItems, selectedReward]);


  const handleConfirm = async () => {
    setConfirming(true);

    // Add delay for UI feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get current time
    const now = new Date();

    // Add 1 hour to the current time to counter the timezone issue
    now.setHours(now.getHours() + 1); // Add 1 hour

    // Determine the number of minutes to add based on the selected time slot
    let minutesToAdd = 5; // Default to "ASAP"
    if (timeSlot === "10min") minutesToAdd = 10;
    else if (timeSlot === "20min") minutesToAdd = 20;
    else if (timeSlot === "30min") minutesToAdd = 30;

    // Adjust the current time for the selected pickup slot
    now.setMinutes(now.getMinutes() + minutesToAdd);

    // Format the adjusted pickup time in 'YYYY-MM-DD HH:mm:ss' format
    const formattedPickupTime = now
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Prepare payload with the correct pickup time
    const payload = {
      user_id: userId,
      store_id: parseInt(selectedStore),
      pickup_time: formattedPickupTime, // Corrected pickup time
      total_price: adjustedTotal,

      reward_used: selectedReward || null,
      cart: cartItems,
    };

    try {
      const response = await fetch(
        "/api/public/CORE_ORDER_DRINK.php",
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
        const orderId = result.order_id;
        localStorage.removeItem("SelectedReward");
        // After order is placed successfully
        const loyaltyPayload = {
          user_id: userId,
          total_paid: adjustedTotal,
          reward_used: selectedReward
        };

        console.log("🧾 Loyalty Payload:", loyaltyPayload);

        fetch("/api/public/update_loyalty_points.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: userId,
            total_paid: adjustedTotal,
            reward_used: selectedReward
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res.success) {
              console.log("✅ Loyalty updated successfully:", res);
            } else {
              console.log("❌ Loyalty update failed:", res.error || res);
            }
          })
          .catch(err => {
            console.error("❌ Loyalty fetch error:", err.message || err);
          });


        // ✅ Store for ActiveOrderWidget
        sessionStorage.setItem(
          "activeOrder",
          JSON.stringify({
            orderId: orderId,
            pickupTime: formattedPickupTime,
            storeName: storeData?.store_name || `Store #${selectedStore}`,
          })
        );

        // ✅ Optional extra storage
        localStorage.setItem("last_order_id", orderId);
        localStorage.setItem(
          "last_order_info",
          JSON.stringify({
            cart: cartItems,
            storeName: storeData?.store_name || `Store #${selectedStore}`,
          })
        );

        // ✅ Clean up cart
        localStorage.removeItem("beanbucks_cart");

        showToast("success", "Order Placed", "Your order has been successfully placed!");

        setTimeout(() => {
          navigate("/order-success", {
            state: {
              cart: cartItems,
              storeName: storeData?.store_name || `Store #${selectedStore}`,
              orderId: orderId,
            },
          });
        }, 1500);
      }

      else {
        throw new Error(result.error || "Order failed.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Order Failed", error.message);
      setConfirming(false);
    }
  };

  const getExpectedPickupTime = () => {
    const now = new Date();
    let minutesToAdd = 5;
    if (timeSlot === "10min") minutesToAdd = 10;
    else if (timeSlot === "20min") minutesToAdd = 20;
    else if (timeSlot === "30min") minutesToAdd = 30;
    now.setMinutes(now.getMinutes() + minutesToAdd);
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const allRewardOptions = [
    { id: 1, value: "free-shot", label: "Free Extra Shot (50 pts)" },
    { id: 2, value: "free-small", label: "Free Small Drink (100 pts)" },
    { id: 3, value: "free-large", label: "Free Large Drink (200 pts)" },
    {
      id: 4,
      value: "free-snack",
      label: "Free Snack or Bakery Item (400 pts)",
    },
    { id: 5, value: "free-combo", label: "Any Drink + Snack Combo (600 pts)" },
  ];

  const storedSelected = localStorage.getItem("SelectedReward");
  const storedSelectedId = storedSelected
    ? JSON.parse(storedSelected).id
    : null;

  const [displayedRewards, setDisplayedRewards] = useState([]);
  useEffect(() => {
    const selected = allRewardOptions.find((r) => r.id === storedSelectedId);
    let others = allRewardOptions.filter((r) => r.id !== storedSelectedId);

    if (selected) {
      others = others.sort(() => 0.5 - Math.random()).slice(0, 2);
      setDisplayedRewards([others[0], selected, others[1]]);
      setSelectedReward(selected.value); // optional: highlight visually
    } else {
      const randomThree = [...allRewardOptions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setDisplayedRewards(randomThree);
    }
  }, []);
  if (selectedReward === "free-combo") {
    window.__comboState = { food: false, drink: false };
  }
  if (!isLoggedIn) {
  return (
    <TwoChoicesModal
      title="Please log in to confirm your order"
      confirmLabel="Login"
      cancelLabel="Register"
      onConfirm={() => navigate("/login")}
      onCancel={() => navigate("/register")}
    />
  );
}

  return (
    <Box sx={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      <Box
        sx={{
          position: "fixed",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          zIndex: 9999,
        }}
      >
        {toast && (
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              margin: "auto",
              paddingLeft: { xs: "1rem", sm: "2rem" },
              paddingRight: { xs: "1rem", sm: "2rem" },
              paddingTop: "0",
              paddingBottom: "2rem",
            }}
          >
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          </Box>
        )}
      </Box>
      {showStoreChangeModal && (
        <TwoChoicesModal
          title="Change Store?"
          text="Changing your store will remove all items from your order. Do you want to continue?"
          confirmLabel="Yes, change it"
          cancelLabel="Cancel"
          onConfirm={() => {
            sessionStorage.removeItem("selectedStoreId");
            localStorage.removeItem("beanbucks_cart");
            navigate("/store");
          }}
          onCancel={() => setShowStoreChangeModal(false)}
        />
      )}

      <h1>Confirm Your Order</h1>
      

      {cartItems.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Your cart is empty.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          <Paper sx={{ padding: "1.5rem", backgroundColor: "var(--card)" }}>
            <h2>Order Summary</h2>
            {cartItems.map((item, i) => {
              let isFree = false;
              let showShotDiscount = false;
              if (!discountApplied && selectedReward === "free-shot" && item.shots > 1) {
                showShotDiscount = true;
                discountApplied = true;
              }

              if (!discountApplied) {
                const cat = item.category?.toLowerCase();
                if (selectedReward === "free-small" && item.size === "Small") {
                  isFree = true;
                  discountApplied = true;
                } else if (selectedReward === "free-large" && item.size === "Large") {
                  isFree = true;
                  discountApplied = true;
                } else if (selectedReward === "free-snack" && cat === "food") {
                  isFree = true;
                  discountApplied = true;
                } else if (selectedReward === "free-combo") {
                  if (!window.__comboState) window.__comboState = { food: false, drink: false };

                  if (cat === "food" && !window.__comboState.food) {
                    isFree = true;
                    window.__comboState.food = true;
                  } else if (cat !== "food" && !window.__comboState.drink) {
                    isFree = true;
                    window.__comboState.drink = true;
                  }

                  // Mark discount applied if both conditions are met
                  if (window.__comboState.food && window.__comboState.drink) {
                    discountApplied = true;
                  }
                }
              }


              const originalTotal = parseFloat(item.price) * (item.qty || 1);
              const discountedPrice = (originalTotal - 0.5).toFixed(2);
              const displayPrice = showShotDiscount ? (
                <>
                  <span style={{ color: "var(--body-text)", fontWeight: 500 }}>
                    £{discountedPrice}
                  </span>{" "}
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                    (-£0.50)
                  </span>
                </>
              )
                : isFree ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "gray" }}>
                      £{originalTotal.toFixed(2)}
                    </span>{" "}
                    <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                      (-£{originalTotal.toFixed(2)})
                    </span>
                  </>
                ) : `£${originalTotal.toFixed(2)}`;
              `£${originalTotal.toFixed(2)}`;

              return (
                <Box key={i} display="flex" justifyContent="space-between" py={0.5}>
                  <p>{item.name} x{item.qty || 1}</p>
                  <p>{displayPrice}</p>
                </Box>
              );
            })}


            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" fontWeight={600}>
              <p>
                <strong>Total:</strong>
              </p>
              <p>
                <strong>£{adjustedTotal.toFixed(2)}</strong>
              </p>

            </Box>
          </Paper>

          <Paper sx={{ padding: "1.5rem", backgroundColor: "var(--card)" }}>
            <h2>Pickup Details</h2>

            {/* Fetch store name by ID */}
            {selectedStore && (
              <>
                {storeError && <RetryFallback onRetry={retryStore} />}
                {storeLoading && <p>Loading store info...</p>}
              </>
            )}

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={4}
              alignItems="stretch"
            >
              <Box flex={1}>
                <p>
                  Store:{" "}
                  <strong>
                    {storeData?.store_name ||
                      `Store #${selectedStore || "N/A"}`}
                  </strong>
                </p>

                <button
                  className="btn btn--outline"
                  onClick={() => setShowStoreChangeModal(true)}
                  style={{ marginTop: "0.75rem" }}
                >
                  Change Location
                </button>
              </Box>

              {/* Divider (only on larger screens) */}
              <Box
                sx={{
                  width: "1px",
                  backgroundColor: "var(--component-border)",
                  display: { xs: "none", sm: "block" },
                }}
              />

              <Box flex={1}>
                <FormControl fullWidth color="primary" variant="outlined">
                  <InputLabel id="pickup-time-label">Select Time</InputLabel>
                  <Select
                    labelId="pickup-time-label"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    label="Select Time"
                    input={<OutlinedInput label="Select Time" />}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="ASAP">As soon as possible</MenuItem>
                    <MenuItem value="10min">In 10 minutes</MenuItem>
                    <MenuItem value="20min">In 20 minutes</MenuItem>
                    <MenuItem value="30min">In 30 minutes</MenuItem>
                  </Select>
                </FormControl>
                <p style={{ marginTop: "0.5rem" }}>
                  Expected pickup time:{" "}
                  <strong>{getExpectedPickupTime()}</strong>
                </p>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ padding: "1.5rem", backgroundColor: "var(--card)" }}>
            <h2>Redeem a Reward</h2>

            {loyaltyError ? (
              <RetryFallback onRetry={retryLoyalty} />
            ) : loadingLoyalty ? (
              <p>Loading...</p>
            ) : !loyaltyData ? null : (
              <>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "var(--body-text)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Only one reward can be redeemed per purchase.
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--body-text)",
                    marginBottom: "1rem",
                  }}
                >
                  You currently have{" "}
                  <strong style={{ color: "var(--primary)" }}>
                    {loyaltyData.loyalty_points}
                  </strong>{" "}
                  points.
                </p>

                <Grid container spacing={2} style={{ marginTop: "1rem" }}>
                  <Grid container spacing={2}>
                    {displayedRewards.map((reward) => {
                      const isSelected = selectedReward === reward.value;

                      return (
                        <Grid item xs={12} sm={4} key={reward.value}>
                          <Box
                            onClick={() => {
                              if (selectedReward === reward.value) {
                                // Deselect reward
                                setSelectedReward("");
                                localStorage.removeItem("SelectedReward");
                              } else {
                                // Select new reward
                                setSelectedReward(reward.value);
                                localStorage.setItem(
                                  "SelectedReward",
                                  JSON.stringify({
                                    id: reward.id,
                                    value: reward.value,
                                  })
                                );
                              }
                            }}

                            sx={{
                              backgroundColor: isSelected
                                ? "#ffe8d9"
                                : "var(--card)",
                              border: `2px solid ${isSelected
                                ? "var(--primary)"
                                : "var(--component-border)"
                                }`,
                              borderRadius: "12px",
                              padding: "1.5rem",
                              minHeight: "200px", // consistent size for all
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              textAlign: "center",
                              transition:
                                "transform 0.2s ease, box-shadow 0.2s ease",
                              transform: isSelected
                                ? "scale(1.04)"
                                : "scale(1)",
                              boxShadow: isSelected
                                ? "0 8px 20px rgba(0,0,0,0.1)"
                                : "0 2px 8px rgba(0,0,0,0.05)",
                              cursor: "pointer",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "bold",
                                marginBottom: "1rem",
                              }}
                            >
                              {reward.label}
                            </p>
                            <button
                              className="btn btn--primary"
                              style={{
                                backgroundColor: "var(--primary)",
                                border: "none",
                                color: "#fff",
                                padding: "0.5rem 1.25rem",
                                borderRadius: "8px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                              disabled
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>

          <Paper sx={{ padding: "1.5rem", backgroundColor: "var(--card)" }}>
            <h2>Payment</h2>
            <p style={{ color: "var(--body-text)", marginBottom: "1rem" }}>
              Select a payment method:
            </p>

            {/* Confirmed Payment Display */}
            {selectedPayment && !showCardForm && (
              <Box
                sx={{
                  backgroundColor: "#e8f5e9",
                  border: "2px solid #20A612",
                  padding: "1rem",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{ fontWeight: "bold", margin: "0 !important" }}
                  id="selected-payment"
                >
                  ✅ {selectedPayment} selected
                </p>

                <button
                  className="btn btn--outline"
                  onClick={() => {
                    setSelectedPayment(null);
                    setShowCardForm(false);
                  }}
                >
                  Change
                </button>
              </Box>
            )}

            {/* Payment Options */}
            {!selectedPayment && (
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                mb={2}
              >
                <button
                  className="btn btn--primary"
                  style={{
                    flex: 1,
                    backgroundColor: "#000",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setSelectedPayment("Google Pay");
                    setShowCardForm(false);
                    showToast(
                      "success",
                      "Google Pay",
                      "Payment accepted via Google Pay."
                    );
                  }}
                >
                  🧾 Google Pay
                </button>

                <button
                  className="btn btn--primary"
                  style={{
                    flex: 1,
                    backgroundColor: "#ffc439",
                    color: "#111",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setSelectedPayment("PayPal");
                    setShowCardForm(false);
                    showToast(
                      "success",
                      "PayPal",
                      "Payment accepted via PayPal."
                    );
                  }}
                >
                  🅿️ PayPal
                </button>

                <button
                  className="btn btn--outline"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowCardForm(true);
                    setSelectedPayment(null); // Reset any existing payment selection
                  }}
                >
                  💳 Credit / Debit Card
                </button>
              </Box>
            )}

            {/* Card Form */}
            {showCardForm && selectedPayment !== "Card" && (
              <Box
                sx={{
                  backgroundColor: "#f7f7f7",
                  borderRadius: "12px",
                  padding: "1rem",
                  mt: 2,
                  transition: "all 0.3s ease",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>Enter Card Details</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const allFilled = Object.values(cardDetails).every(
                      (v) => v.trim() !== ""
                    );
                    if (allFilled) {
                      setCardProcessing(true);
                      setTimeout(() => {
                        setCardProcessing(false);
                        showToast(
                          "success",
                          "Card Payment",
                          "Payment accepted via card."
                        );
                        setSelectedPayment("Card");
                        setShowCardForm(false);
                        setCardDetails({
                          name: "",
                          number: "",
                          expiry: "",
                          cvv: "",
                        });
                      }, 1000);
                    } else {
                      showToast(
                        "error",
                        "Missing Info",
                        "Please fill in all card fields."
                      );
                    }
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    width="100%"
                  >
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardDetails.name}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, name: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          number: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                      }}
                    />
                    <Box
                      display="flex"
                      gap={2}
                      flexDirection={{ xs: "column", sm: "row" }}
                      width="100%"
                    >
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiry: e.target.value,
                          })
                        }
                        style={{
                          flex: 1,
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value,
                          })
                        }
                        style={{
                          flex: 1,
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                        }}
                      />
                    </Box>

                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={cardProcessing}
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        marginTop: "0.5rem",
                        fontWeight: 600,
                        border: "none",
                        padding: "0.5rem 1.25rem",
                        borderRadius: "8px",
                        cursor: cardProcessing ? "not-allowed" : "pointer",
                        opacity: cardProcessing ? 0.7 : 1,
                        width: "100%",
                      }}
                    >
                      {cardProcessing ? "Processing..." : "Submit Payment"}
                    </button>
                  </Box>
                </form>
              </Box>
            )}
          </Paper>
          <button
            className="btn btn--primary"
            style={{
              width: "100%",
              padding: "0.75rem 1.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--primary)",
              color: "var(--button-text)",
              border: "none",
              cursor: confirming || !selectedPayment ? "not-allowed" : "pointer",
              opacity: confirming || !selectedPayment ? 0.6 : 1,
            }}
            onClick={handleConfirm}
            disabled={confirming || !selectedPayment}
          >
            {confirming ? "Placing Order..." : "Confirm Order"}
          </button>

        </Box>
      )}
    </Box>
  );
}

export default ConfirmOrder;
