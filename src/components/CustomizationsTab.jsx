import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Paper,
    Collapse,
    IconButton
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WaterIcon from '@mui/icons-material/Water';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CakeIcon from '@mui/icons-material/Cake';
import StraightenIcon from '@mui/icons-material/Straighten';
import TwoChoicesModal from "./TwoChoices";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";


function CustomizationsTab() {
    const [expanded, setExpanded] = useState({
        sizes: true,
        milks: true,
        beans: true,
        syrups: true,
        toppings: true
    });
    const [disabledReasons, setDisabledReasons] = useState({});

    const [confirmTarget, setConfirmTarget] = useState(null);
    const [toast, setToast] = useState(null);


    const navigate = useNavigate();
    const [outOfStockCount, setOutOfStockCount] = useState(0);

    const [customizationData, setCustomizationData] = useState([]);
    const [hasStockDisabledItems, setHasStockDisabledItems] = useState(false);
    const [activeCustomizations, setActiveCustomizations] = useState({
        // Sizes
        small: true,
        medium: true,
        large: true,
        // Milks
        whole: true,
        oat: true,
        almond: true,
        soy: true,
        // Beans
        normal: true,
        decaf: true,
        // Syrups
        vanilla: true,
        caramel: true,
        hazelnut: true,
        mocha: true,
        pumpkinSpice: true,
        // Toppings
        whippedCream: true,
        flakes: true,
        marshmallows: true,
        cinnamon: true,
        javaChips: true
    });

    const toggleSection = (section) => {
        setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleCustomization = (key) => {
        const currentlyActive = activeCustomizations[key];
        const reason = disabledReasons[key];

        // Always prompt, whether enabling or disabling
        if (reason === "stock" && !currentlyActive) {
            // Only show stock reason if it's off due to stock
            setConfirmTarget({ key, reason: "stock" });
        } else {
            setConfirmTarget({ key, reason: currentlyActive ? "manual" : "manual-enable" });
        }
    };




    const getIconForSection = (section) => {
        switch (section) {
            case 'sizes': return <StraightenIcon sx={{ mr: 1 }} />;
            case 'milks': return <WaterIcon sx={{ mr: 1 }} />;
            case 'beans': return <CoffeeIcon sx={{ mr: 1 }} />;
            case 'syrups': return <LocalCafeIcon sx={{ mr: 1 }} />;
            case 'toppings': return <CakeIcon sx={{ mr: 1 }} />;
            default: return null;
        }
    };

    const renderCustomizationButton = (key, label) => (
        <Button
            key={key}
            variant={activeCustomizations[key] ? "contained" : "outlined"}
            onClick={() => toggleCustomization(key)}
            sx={{
                m: 0.75,
                borderRadius: '6px',
                minWidth: 120,
                padding: '0.75rem 1rem',
                fontWeight: 700,
                textTransform: 'none',
                backgroundColor: activeCustomizations[key] ? '#d4edda' : 'var(--danger-bg)', // light green or light red
                color: activeCustomizations[key] ? 'var(--success)' : 'var(--danger-text)', // dark green or dark red text
                border: `2px solid ${activeCustomizations[key] ? 'var(--success)' : 'var(--danger-border)'}`, // dark green or dark red border
                boxShadow: 'none',
                '&:hover': {
                    backgroundColor: activeCustomizations[key] ? '#c3e6cb' : '#f5c6cb',
                    borderColor: activeCustomizations[key] ? '#218838' : '#c82333',
                }
            }}


        >
            {label}
        </Button>
    );
    const [outOfStockList, setOutOfStockList] = useState([]);

    useEffect(() => {
        fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/read_store_customizations.php?store_id=1")
            .then(res => res.json())
            .then(data => {
                const updated = {};
                const reasons = {};
                const oosNames = [];

                data.forEach(item => {
                    // Normalize backend name to match frontend keys
                    const key = item.name
                        .replace(/ Cup| Milk| Beans| Syrup/gi, '') // Remove type suffixes
                        .replace(/ /g, '')                         // Remove spaces
                        .replace(/^[A-Z]/, c => c.toLowerCase());  // Lowercase first letter

                    updated[key] = item.enabled;
                    reasons[key] = item.reason;

                    if (item.reason === "stock") {
                        oosNames.push(item.name);
                    }
                });

                // ✅ Apply states
                setActiveCustomizations(prev => ({ ...prev, ...updated }));
                setDisabledReasons(reasons);
                setOutOfStockList(oosNames);
                setCustomizationData(data); // 👈 Store raw API data for mapping ID later

                // Optional: Debug output if needed
                console.log("Customization API:", data);
            })
            .catch(err => {
                console.error("Failed to fetch customizations:", err);
            });
    }, []);




    const sections = [
        {
            id: 'sizes',
            title: 'Drink Sizes',
            items: [
                { key: 'small', label: 'Small' },
                { key: 'medium', label: 'Medium' },
                { key: 'large', label: 'Large' }
            ]
        },
        {
            id: 'milks',
            title: 'Milk Options',
            items: [
                { key: 'whole', label: 'Whole Milk' },
                { key: 'oat', label: 'Oat Milk' },
                { key: 'almond', label: 'Almond Milk' },
                { key: 'soy', label: 'Soy Milk' }
            ]
        },
        {
            id: 'beans',
            title: 'Coffee Beans',
            items: [
                { key: 'normal', label: 'Regular' },
                { key: 'decaf', label: 'Decaf' }
            ]
        },
        {
            id: 'syrups',
            title: 'Flavor Syrups',
            items: [
                { key: 'vanilla', label: 'Vanilla' },
                { key: 'caramel', label: 'Caramel' },
                { key: 'hazelnut', label: 'Hazelnut' },
                { key: 'mocha', label: 'Mocha' },
                { key: 'pumpkinSpice', label: 'Pumpkin Spice' }
            ]
        },
        {
            id: 'toppings',
            title: 'Toppings',
            items: [
                { key: 'whippedCream', label: 'Whipped Cream' },
                { key: 'flakes', label: 'Chocolate Flakes' },
                { key: 'marshmallows', label: 'Marshmallows' },
                { key: 'cinnamon', label: 'Cinnamon' },
                { key: 'javaChips', label: 'Java Chips' }
            ]
        }
    ];

    return (
        <Box sx={{
            maxWidth: '1200px',
            mx: 'auto',
            background: 'var(--background)'
        }}>
            <Typography variant="h4" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'var(--heading-color)',
                display: 'flex',
                alignItems: 'center'
            }}>

                Drink Customizations
            </Typography>

            <Typography variant="body1" sx={{
                color: 'var(--body-text)',
                mb: 4,
                fontSize: '1.1rem'
            }}>
                Select which customizations to offer at your store. Toggle options on/off below.
            </Typography>
            {outOfStockList.length > 0 && (
                <div
                    style={{
                        backgroundColor: "var(--danger-bg)",
                        color: "var(--danger-text)",
                        border: "2px solid var(--danger-border)",
                        borderRadius: "10px",
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1.25rem",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    <ReportProblemOutlined
                        style={{
                            fontSize: "2.5rem",
                            color: "#dc3545",
                        }}
                    />

                    <div style={{ flex: 1 }}>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "1.35rem",
                                fontWeight: "bold",
                                whiteSpace: "normal",
                                overflow: "hidden",
                            }}
                        >
                            Heads up! {outOfStockList.length} customization
                            {outOfStockList.length > 1 ? "s are" : " is"} temporarily unavailable
                        </h2>
                        <p
                            style={{
                                marginTop: "0.4rem",
                                fontSize: "1rem",
                                lineHeight: 1.4,
                                color: "var(--danger-text)",
                            }}
                        >
                            The following options are currently hidden from customers due to low stock or manual flagging:
                        </p>
                        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                            {outOfStockList.map((name) => (
                                <li key={name}>{name}</li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("../admin/adminstock")}
                        sx={{
                            backgroundColor: "var(--danger-bg)",
                            color: "var(--danger-text)",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            padding: "0.7rem 1.2rem",
                            borderRadius: "8px",
                            border: "2px solid #dc3545",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "var(--danger-border)",
                                borderColor: "#c82333",
                            },
                        }}
                    >
                        View Stock Panel
                    </Button>
                </div>
            )}



            {sections.map((section) => (
                <Paper
                    key={section.id}
                    elevation={3}
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid var(--component-border)',
                        backgroundColor: 'var(--card)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            cursor: 'pointer',
                            backgroundColor: 'rgba(238, 92, 1, 0.1)'
                        }}
                        onClick={() => toggleSection(section.id)}
                    >
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: 'var(--heading-color)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {getIconForSection(section.id)}
                            {section.title}
                        </Typography>
                        <IconButton size="small">
                            <ExpandMoreIcon sx={{
                                transform: expanded[section.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                color: 'var(--heading-color)'
                            }} />
                        </IconButton>
                    </Box>

                    <Collapse in={expanded[section.id]}>
                        <Box sx={{
                            p: 3,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1
                        }}>
                            {section.items.map(item => (
                                renderCustomizationButton(item.key, item.label)
                            ))}
                        </Box>
                    </Collapse>
                </Paper>
            ))}
            {confirmTarget && (confirmTarget.reason === "manual" || confirmTarget.reason === "manual-enable") && (

                <TwoChoicesModal
                    title={`Disable "${confirmTarget.key}" option?`}
                    text={`You’re about to disable the "${confirmTarget.key}" customization for this store. This will hide it from customers.`}
                    confirmLabel="Yes, Disable It"
                    cancelLabel="No, Keep It"
                    onConfirm={async () => {
                        const customizationMap = {
                            small: "Small Cup",
                            medium: "Medium Cup",
                            large: "Large Cup",
                            whole: "Whole Milk",
                            oat: "Oat Milk",
                            almond: "Almond Milk",
                            soy: "Soy Milk",
                            normal: "Coffee Beans",
                            decaf: "Decaf Coffee Beans",
                            vanilla: "Vanilla Syrup",
                            caramel: "Caramel Syrup",
                            hazelnut: "Hazelnut Syrup",
                            mocha: "Mocha Syrup",
                            pumpkinSpice: "Pumpkin Spice",
                            whippedCream: "Whipped Cream",
                            flakes: "Flakes",
                            marshmallows: "Marshmallows",
                            cinnamon: "Cinnamon",
                            javaChips: "Java Chips"
                        };

                        const name = customizationMap[confirmTarget.key];
                        const customization = customizationData.find(c => c.name === name);

                        if (!customization) {
                            setToast({
                                type: "error",
                                title: "ID Not Found",
                                message: "Couldn't find the customization ID for this item."
                            });
                            setConfirmTarget(null);
                            return;
                        }

                        const adminId = 1; // Replace with actual admin ID from the session or context

                        try {
                            const res = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/toggle_customization.php", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    store_id: 1,
                                    customization_option_id: customization.id,
                                    enabled: confirmTarget.reason === "manual" ? 0 : 1,
                                    admin_id: adminId // Send the admin ID
                                })
                            });

                            const result = await res.json();

                            if (res.ok && result.success) {
                                const isEnabling = confirmTarget.reason === "manual-enable";
                                setActiveCustomizations(prev => ({ ...prev, [confirmTarget.key]: isEnabling }));
                                setToast({
                                    type: "success",
                                    title: isEnabling ? "Customization Enabled" : "Customization Disabled",
                                    message: `"${name}" has been successfully ${isEnabling ? "enabled" : "disabled"} for this store.`
                                });
                            } else {
                                setToast({
                                    type: "error",
                                    title: "Toggle Failed",
                                    message: result.message || "An unknown error occurred while toggling."
                                });
                            }

                        } catch (err) {
                            console.error(err);
                            setToast({
                                type: "error",
                                title: "Network Error",
                                message: err.message || "Could not reach the server."
                            });
                        }

                        setConfirmTarget(null);
                    }}



                    onCancel={() => setConfirmTarget(null)}
                />
            )}

            {confirmTarget && confirmTarget.reason === "stock" && (
                <TwoChoicesModal
                    title={
                        activeCustomizations[confirmTarget.key]
                            ? `Disable "${confirmTarget.key}" option?`
                            : `Enable "${confirmTarget.key}" option?`
                    }
                    text={
                        activeCustomizations[confirmTarget.key]
                            ? `You’re about to disable the "${confirmTarget.key}" customization for this store. This will hide it from customers.`
                            : `You’re about to enable the "${confirmTarget.key}" customization for this store. It will become available to customers.`
                    }
                    confirmLabel={
                        activeCustomizations[confirmTarget.key]
                            ? "Yes, Disable It"
                            : "Yes, Enable It"
                    }
                    cancelLabel="Cancel"
                    onConfirm={async () => {
                        const customizationMap = {
                            small: "Small Cup",
                            medium: "Medium Cup",
                            large: "Large Cup",
                            whole: "Whole Milk",
                            oat: "Oat Milk",
                            almond: "Almond Milk",
                            soy: "Soy Milk",
                            normal: "Coffee Beans",
                            decaf: "Decaf Coffee Beans",
                            vanilla: "Vanilla Syrup",
                            caramel: "Caramel Syrup",
                            hazelnut: "Hazelnut Syrup",
                            mocha: "Mocha Syrup",
                            pumpkinSpice: "Pumpkin Spice",
                            whippedCream: "Whipped Cream",
                            flakes: "Flakes",
                            marshmallows: "Marshmallows",
                            cinnamon: "Cinnamon",
                            javaChips: "Java Chips"
                        };

                        const name = customizationMap[confirmTarget.key];
                        const customization = customizationData.find(c => c.name === name);

                        if (!customization) {
                            setToast({
                                type: "error",
                                title: "ID Not Found",
                                message: "Couldn't find the customization ID for this item."
                            });
                            setConfirmTarget(null);
                            return;
                        }

                        const adminId = 1; // Replace with actual admin ID from the session or context

                        try {
                            const res = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/toggle_customization.php", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    store_id: 1,
                                    customization_option_id: customization.id,
                                    enabled: confirmTarget.reason === "manual" ? 0 : 1,
                                    admin_id: adminId // Send the admin ID
                                })
                            });

                            const result = await res.json();

                            if (res.ok && result.success) {
                                const isEnabling = confirmTarget.reason === "manual-enable";
                                setActiveCustomizations(prev => ({ ...prev, [confirmTarget.key]: isEnabling }));
                                setToast({
                                    type: "success",
                                    title: isEnabling ? "Customization Enabled" : "Customization Disabled",
                                    message: `"${name}" has been successfully ${isEnabling ? "enabled" : "disabled"} for this store.`
                                });
                            } else {
                                setToast({
                                    type: "error",
                                    title: "Toggle Failed",
                                    message: result.message || "An unknown error occurred while toggling."
                                });
                            }

                        } catch (err) {
                            console.error(err);
                            setToast({
                                type: "error",
                                title: "Network Error",
                                message: err.message || "Could not reach the server."
                            });
                        }

                        setConfirmTarget(null);
                    }}

                    onCancel={() => setConfirmTarget(null)}
                />

            )}
            {toast && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999
                }}>


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

export default CustomizationsTab;