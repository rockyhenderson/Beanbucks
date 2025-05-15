import React, { useState, useMemo } from "react";
import {
    Box,
    Paper,
    Button,
    IconButton,
    Collapse,
    TextField,
} from "@mui/material";
import { ExpandMore, ExpandLess, Add, Remove } from "@mui/icons-material";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "./RetryFallback";
import Toast from "./Toast";
import { ReportProblemOutlined } from "@mui/icons-material";
import BulkOrderConfirmationModal from "./BulkOrderConfirmationModal";


function BulkUpdateView({ onBulkSave }) {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [orderList, setOrderList] = useState([]); // Store the items to be ordered
    const storeId = sessionStorage.getItem("selectedStoreId") || user?.store_id || "1";
    const [massUpdateQuantity, setMassUpdateQuantity] = useState(500); // Set initial quantity
    const [orderSectionExpanded, setOrderSectionExpanded] = useState(true); // State to control the collapsible section
    const toggleOrderSection = () => {
        setOrderSectionExpanded((prev) => !prev);
    };


    const { data, error, isLoading, retry } = useFetchWithRetry(
        `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/read_grouped_ingredients.php?store_id=${storeId}`
    );

    const [orderQuantities, setOrderQuantities] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({});
    const [toast, setToast] = useState(null);
    const [showOverview, setShowOverview] = useState(false);

    const toggleGroup = (group) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }));
    };
    const handleMassUpdate = (quantity) => {
        // Create an array of updates for each ingredient
        const massUpdateItems = Object.entries(grouped).flatMap(([group, items]) =>
            items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: quantity, // Set the quantity for all ingredients to the provided quantity
                unit: item.unit,
            }))
        );

        // Set the order list with the mass update items
        setOrderList(massUpdateItems);

        // Open the confirmation modal
        setModalOpen(true);
    };


    const handleChange = (id, newQuantity) => {
        const qty = parseInt(newQuantity);
        if (isNaN(qty)) return;
        const nearest100 = Math.round(qty / 100) * 100;
        setOrderQuantities((prev) => ({ ...prev, [id]: Math.max(nearest100, 0) }));
    };

    const handleSubmit = () => {
        const itemsToOrder = Object.entries(orderQuantities)
            .filter(([, val]) => parseFloat(val) > 0)
            .map(([id, qty]) => {
                const item = data.data.find(item => item.ingredient_id === id); // Find the full item
                return {
                    id,
                    name: item.ingredient_name, // Get the ingredient name
                    quantity: qty, // The ordered quantity
                    unit: item.unit, // Get the ingredient unit
                };
            });

        if (itemsToOrder.length === 0) {
            setToast({
                type: "warning",
                title: "No Items",
                message: "Enter at least one quantity before submitting.",
            });
            return;
        }

        setOrderList(itemsToOrder); // Store the full items for the modal
        setModalOpen(true); // Open the modal for confirmation
    };


    const handleModalConfirm = async () => {
        setModalOpen(false); // Close the modal

        const user = JSON.parse(sessionStorage.getItem("user") || "{}");

        const payload = {
            store_id: storeId,
            admin_id: user.id, // ✅ Include admin ID for logging
            ingredients: orderList.map(item => ({
                ingredient_id: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await fetch(
                "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/update_bulk_stock.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (result.status === "success") {
                setToast({
                    type: "success",
                    title: "Order Successful",
                    message: result.message || "The stock has been updated successfully.",
                });

                // Wait for 2 seconds and then refresh the page
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error(result.message || "Failed to update stock.");
            }
        } catch (error) {
            setToast({
                type: "error",
                title: "Order Failed",
                message: error.message || "An error occurred while updating the stock.",
            });
        }
    };


    const handleModalCancel = () => {
        setModalOpen(false); // Close the modal without saving
    };

    const grouped = useMemo(() => {
        const result = {};
        if (Array.isArray(data?.data)) {
            for (const item of data.data) {
                const group = item.ingredient_group || "Other";
                if (!result[group]) result[group] = [];
                result[group].push({
                    id: item.ingredient_id,
                    name: item.ingredient_name,
                    unit: item.unit,
                    isBelowThreshold: parseInt(item.stock_quantity) < parseInt(item.threshold),
                });
            }
        }
        return result;
    }, [data]);

    const getGroupBackground = (group) => {
        // Check if there are any low stock items in this group
        const items = grouped[group];
        return items.some(item => item.isBelowThreshold) ? "#fff3cd" : "var(--card)";  // Light yellow for low stock
    };

    const lowStockItems = useMemo(() => {
        if (!Array.isArray(data?.data)) return [];

        return data.data.filter(
            (item) => parseInt(item.stock_quantity) < parseInt(item.threshold)
        );
    }, [data]);
    const orderedItems = Object.entries(orderQuantities).filter(([, val]) => parseFloat(val) > 0);
    const itemCount = orderedItems.length;
    const totalUnits = orderedItems.reduce((sum, [, qty]) => sum + parseInt(qty), 0);
    const getItemBackground = (isBelowThreshold) => {
        return isBelowThreshold ? "var(--warning-bg)" : "var(--card)";  // Apply yellow for low-stock items
    };
    return (
        <Box sx={{ mt: 2 }}>
            {lowStockItems.length > 0 && (
                <Box
                    sx={{
                        backgroundColor: "var(--warning-bg)",
                        color: "#856404",
                        border: "2px solid #ffeeba",
                        borderRadius: "10px",
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        display: "flex",
                        alignItems: "flex-start", // Align to the top to make space for wrapping text
                        gap: "1.25rem",
                        flexDirection: "row", // Default row for larger screens
                        justifyContent: "space-between", // Keep space between icon, text, and button
                        flexWrap: "wrap", // Allows content to stack on mobile
                    }}
                >
                    <ReportProblemOutlined sx={{ fontSize: "2.5rem", color: "#ffc107" }} />
                    <Box sx={{ flex: 1 }}>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "1.35rem",
                                fontWeight: "bold",
                                whiteSpace: "normal", // Allow the text to wrap
                                overflow: "hidden",
                                textOverflow: "ellipsis", // Add ellipsis if text is too long
                                color: "var(--warning-text)"
                            }}
                        >
                            {lowStockItems.length} Ingredient{lowStockItems.length > 1 ? "s" : ""} Below Threshold
                        </h2>
                        <p
                            style={{
                                marginTop: "0.4rem",
                                fontSize: "1rem",
                                lineHeight: 1.4,
                                wordWrap: "break-word", 
                                color: "var(--warning-text)"
                            }}
                        >
                            These ingredients are below their stock threshold. Quick order them now to replenish.
                        </p>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#ffc107",
                            color: "#212529",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            padding: "0.7rem 1.2rem",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "#fb8c00", // hover color
                            },
                        }}
                        onClick={() => {
                            console.log('Resolve Now clicked, preparing to add items to cart.');

                            const updates = {};
                            for (const item of lowStockItems) {
                                updates[item.ingredient_id] = 500; // Quick order all low stock items
                            }

                            console.log('Updates prepared:', updates);

                            // Set order quantities based on low-stock items
                            setOrderQuantities((prev) => {
                                const newQuantities = { ...prev, ...updates };
                                console.log('Order quantities updated:', newQuantities); // Debug order quantities
                                return newQuantities;
                            });

                            // Trigger the toast in the parent component
                            setToast({
                                type: "success",
                                title: "Quick Order Added",
                                message: `${lowStockItems.length} low-stock ingredients added to the cart.`,
                            });
                        }}
                    >
                        Resolve Now
                    </Button>




                </Box>
            )}


            <Box sx={{ mb: 3, borderRadius: 2, border: "1px solid var(--component-border)", backgroundColor: "var(--card)" }}>
                <Box
                    onClick={toggleOrderSection}
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column", // Stack on mobile
                            sm: "row",    // Row layout on larger screens
                        },
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        cursor: "pointer",
                        padding: "1rem",
                        backgroundColor: "var(--card)",
                        gap: 1.5, // Adds spacing between items when stacked
                    }}
                >
                    <h2 style={{ margin: 0, color: "var(--heading-color)" }}>
                        Place a Bulk Ingredient Order
                    </h2>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            borderColor: "var(--primary)",
                            color: "var(--primary)",
                            backgroundColor: "var(--card)",
                            minWidth: 220,
                            padding: "0.6rem 1.5rem",
                            fontSize: "1.2rem",
                            alignSelf: {
                                xs: "stretch", // Full width on mobile
                                sm: "auto",
                            },
                            "&:hover": {
                                backgroundColor: "var(--primary-light, #f7f7f7)",
                            },
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent collapsing when clicking button
                            handleMassUpdate(massUpdateQuantity);
                        }}
                    >
                        Mass Update Stock
                    </Button>
                    {orderSectionExpanded ? (
                        <ExpandLess sx={{ color: "var(--primary)" }} />
                    ) : (
                        <ExpandMore sx={{ color: "var(--primary)" }} />
                    )}
                </Box>


                <Collapse in={orderSectionExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>
                        {/* Button aligned with the text */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                        </Box>

                        {/* Simplified Explanation text below */}
                        <p style={{ marginTop: "1rem", fontSize: "1rem", lineHeight: 1.6, color: "var(--text)" }}>
                            Quickly update the stock for ingredients in bulk by adjusting the quantity for all ingredients in a group.
                        </p>
                        <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text)" }}>
                            <strong>Expiry dates</strong> are automatically updated based on the <strong>ingredient group</strong> and the amount of stock added.
                        </p>
                        <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text)" }}>
                            If you add <strong>50% or more</strong> of the current stock, the <strong>expiry date</strong> will be updated according to the default expiry rules for that ingredient. If the stock was <strong>0</strong> to begin with, it will also receive a new expiry date.
                        </p>
                        <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text)" }}>
                            If you add less than <strong>50%</strong> of the stock, the <strong>expiry date remains unchanged</strong>.
                        </p>

                    </Box>
                </Collapse>
            </Box>







            {isLoading && <p>Loading ingredients...</p>}
            {error && <RetryFallback onRetry={retry} />}

            {!isLoading &&
                !error &&
                Object.entries(grouped).map(([group, items]) => {
                    const lowStockCount = items.filter(item => item.isBelowThreshold).length;
                    return (
                        <Paper
                            key={group}
                            sx={{
                                mb: 3,
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid var(--component-border)",
                                backgroundColor: "var(--card)",
                            }}
                        >
                            <Box
                                onClick={() => toggleGroup(group)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <h2 style={{ margin: 0, color: "var(--text)" }}>
                                    {group}
                                    {lowStockCount > 0 && (
                                        <span style={{ color: "var(--warning-text)" }}> ({lowStockCount} Below Threshold)</span>
                                    )}
                                </h2>



                                {expandedGroups[group] ? (
                                    <ExpandLess sx={{ color: "var(--primary)" }} />
                                ) : (
                                    <ExpandMore sx={{ color: "var(--primary)" }} />
                                )}
                            </Box>

                            <Collapse in={expandedGroups[group]} timeout="auto" unmountOnExit>
                                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                                    {items.map((item) => {
                                        const quantity = orderQuantities[item.id] || 0;
                                        return (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    flex: "1 1 160px",
                                                    maxWidth: "220px",
                                                    minHeight: "120px",
                                                    borderRadius: 2,
                                                    backgroundColor: getItemBackground(item.isBelowThreshold), // Apply background color to the item
                                                    border: "1px solid var(--component-border)",
                                                    padding: 2,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Box sx={{ mb: 1 }}>
                                                    <p
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: "1rem",
                                                            margin: 0,
                                                            color: item.isBelowThreshold ? "var(--warning-text)" : "var(--text)",
                                                            whiteSpace: "normal", // Allow text to wrap
                                                            overflow: "visible", // Allow text to overflow if it's too long
                                                            textOverflow: "clip", // Remove the ellipsis
                                                        }}
                                                        title={item.name} // optional: show full name on hover
                                                    >
                                                        {item.name}
                                                    </p>


                                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "gray" }}>{item.unit}</p>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        mt: "auto",
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleChange(item.id, Math.max((orderQuantities[item.id] || 0) - 100, 0))
                                                        }
                                                    >
                                                        <Remove sx={{ color: "var(--primary)" }} />
                                                    </IconButton>
                                                    <p style={{ margin: "0 10px", fontWeight: 500 }}>
                                                        {quantity}
                                                    </p>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleChange(item.id, quantity + 100)
                                                        }
                                                    >
                                                        <Add sx={{ color: "var(--primary)" }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Collapse>
                        </Paper>
                    );
                })}



            {/* Sticky Cart Controls */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: {
                        xs: "center", // center on mobile
                        sm: "flex-end", // right on desktop
                    },
                    width: {
                        xs: "100%",
                        sm: "auto",
                    },
                    px: {
                        xs: 2,
                        sm: 0,
                    },
                }}
            >


                {/* Cart Toggle Button */}


                {/* Submit Button */}
                <Button
                    disabled={orderedItems.length === 0}
                    onClick={handleSubmit}
                    sx={{
                        px: 4,
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: "1rem",
                        borderRadius: 2,
                        textTransform: "none",
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                        maxWidth: "360px",
                        "&:hover": {
                            backgroundColor: "var(--primary-hover, #cc5c00)",
                        },
                    }}
                >
                    Submit Order Request
                </Button>
            </Box>

            {toast && (
                <Box
                    sx={{
                        position: "fixed", // Fix the position
                        top: 16, // Position it at the top of the page
                        left: "50%", // Center horizontally
                        transform: "translateX(-50%)", // Adjust for centering
                        zIndex: 1500, // Ensure it appears above other elements
                    }}
                >
                    <Toast
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onClose={() => setToast(null)} // Close the toast
                    />
                </Box>
            )}
            {modalOpen && (
                <BulkOrderConfirmationModal
                    title="Confirm Bulk Order"
                    text={`You are about to order ${orderList.length} ingredients.`}
                    ingredients={orderList.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        unit: item.unit,
                    }))}
                    confirmLabel="Confirm Order"
                    cancelLabel="Cancel"
                    onConfirm={handleModalConfirm} // Pass the function here
                    onCancel={handleModalCancel} // Handle cancel action
                />
            )}


        </Box>
    );
}

export default BulkUpdateView;
