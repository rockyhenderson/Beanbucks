import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Divider,
  Stack,
  MenuItem,
  Select,
  Chip,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import RetryFallback from "../../components/RetryFallback";
import Toast from "../../components/Toast";
import TwoChoicesModal from "../../components/TwoChoices";
import EditIcon from "@mui/icons-material/Edit";
import EditStoreHoursModal from "../../components/EditStoreHours";

const roleLabels = {
  2: "Admin",
  3: "Manager",
};

function ManageStores() {
  const [openCards, setOpenCards] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentStoreHours, setCurrentStoreHours] = useState({
    open_time: "",
    close_time: "",
    store_id: null,
  });
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isManager = user?.role === "manager";
  const isAdmin = user?.role === "admin";
  const userStoreId = user?.store_id;

  const {
    data: stores,
    error,
    isLoading,
    retry,
  } = useFetchWithRetry(
    "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stores/read_store_staff.php"
  );

  const toggleCard = (storeId) => {
    setOpenCards((prev) => ({
      ...prev,
      [storeId]: !prev[storeId],
    }));
  };

  const formatTime = (t) =>
    t
      ? new Date(`1970-01-01T${t}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  useEffect(() => {
    console.log("📦 Store data received:", stores);
  }, [stores]);

  const unassignedGroup = Array.isArray(stores)
    ? stores.find((s) => s.store_id === null)
    : null;

  useEffect(() => {
    if (
      unassignedGroup &&
      Array.isArray(unassignedGroup.staff) &&
      unassignedGroup.staff.length > 0
    ) {
      console.log("Unassigned staff:", unassignedGroup.staff);
      setToast({
        type: "warning",
        title: "Unassigned Staff",
        message: `There are ${unassignedGroup.staff.length} employees not assigned to a store.`,
      });
    }
  }, [stores]);

  const handleReassign = async (userId, newStoreId) => {
    const admin = JSON.parse(sessionStorage.getItem("user"));
    const adminId = admin?.id;

    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stores/update_user_store.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            store_id: newStoreId,
            admin_id: adminId,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setToast({
          type: "success",
          title: "Store Assignment Updated",
          message: "The user has been successfully reassigned.",
        });
        setTimeout(() => {
          retry();
        }, 200);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      setToast({
        type: "error",
        title: "Assignment Failed",
        message: err.message,
      });
    }
  };

  const handleToggleStore = (storeId, isOpen) => {
    setConfirmToggle({ storeId, isOpen });
  };

  const confirmToggleAction = async () => {
    if (!confirmToggle) return;
    const { storeId, isOpen } = confirmToggle;
    setConfirmToggle(null);

    // ✅ Get admin_id from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    const admin_id = user?.id;

    if (!admin_id) {
      setToast({
        type: "error",
        title: "Missing Admin ID",
        message: "Admin not logged in or session expired.",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stores/update_store_status.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id: storeId,
            is_open: isOpen ? 0 : 1,
            admin_id,
          }),
        }
      );
      const result = await response.json();

      console.log("📥 Toggle Store Response:", result);

      if (result.success) {
        setToast({
          type: "success",
          title: "Store Status Updated",
          message: `Store has been ${isOpen ? "closed" : "opened"}.`,
        });
        retry();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Toggle Store Error:", err.message);
      setToast({
        type: "error",
        title: "Toggle Failed",
        message: err.message,
      });
    }
  };

  const handleEditHours = (storeId, openTime, closeTime) => {
    setCurrentStoreHours({
      store_id: storeId,
      open_time: openTime,
      close_time: closeTime,
    });
    setEditModalOpen(true);
  };

  const handleSaveStoreHours = async (store_id, open_time, close_time) => {
    // Retrieve the 'user' object from sessionStorage and parse it
    const user = JSON.parse(sessionStorage.getItem("user"));

    // If user object is missing or doesn't have an 'id', show an error
    if (!user || !user.id) {
      console.error("❌ User ID is missing.");
      setToast({
        type: "error",
        title: "User ID Missing",
        message: "You must be logged in to perform this action.",
      });
      return;
    }

    const admin_id = user.id; // Extracting user.id from the parsed 'user' object
    console.log("Admin ID:", admin_id); // Log the admin ID for debugging
    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stores/update_store_hours.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id,
            open_time,
            close_time,
            admin_id, // Pass the user_id here
          }),
        }
      );

      const result = await response.json();
      console.log("📥 API response:", result);

      if (result.success) {
        setToast({
          type: "success",
          title: "Store Hours Updated",
          message: `Updated to ${open_time} – ${close_time}`,
        });
        setEditModalOpen(false);
        retry();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Error during store hours update:", err.message);
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message,
      });
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          className="main-page-content"
          style={{ flexGrow: 1, padding: "30px" }}
        >
          <h1>Store Options</h1>
          <p>
            This section allows for managing store availability and operating
            hours.
          </p>
          <ul>
            <li>ADD PERMISION FOR MANAGERS AND ADMINS.</li>
            <li>
              CHANGE THE CLOSE AND OPEN TOGGLE SO IF AN ADMIN TOGGLES A STORE
              CLOSED IT HAS TO VERIFY WITH THE MANAGER THAT THEY WANT TO CLOSE
              IT.
            </li>
            <li>ADD A NEW STORE BUTTON?</li>
          </ul>

          {isLoading ? (
            <p>Loading store data...</p>
          ) : error ? (
            <RetryFallback onRetry={retry} />
          ) : (
            <>
              {stores
                .filter((store) => store.store_id !== null)
                .map((store) => {
                  const isOpen = store.is_open;
                  const staffCount = store.staff?.length || 0;

                  return (
                    <Paper
                      key={store.store_id}
                      elevation={2}
                      sx={{
                        marginBottom: 3,
                        padding: 2,
                        border: "1px solid var(--component-border)",
                        borderRadius: "10px",
                        overflow: "auto",
                        backgroundColor: "var(--card)",
                      }}
                    >
                      <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ sm: "center" }}
                      >
                        <Box
                          onClick={() => toggleCard(store.store_id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <Typography variant="h6">
                            {store.store_name}
                          </Typography>
                          <Typography variant="body2" color="var(--body-text)">
                            {staffCount} staff
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={2} // Add space between elements
                          mt={{ xs: 2, sm: 0 }}
                        >
                          {/* Store Hours Display */}
                          <Typography sx={{ fontSize: "0.9rem", flex: 1 }}>
                            {formatTime(store.open_time)} –{" "}
                            {formatTime(store.close_time)}
                          </Typography>

                          {/* Edit Icon for Time */}
                          <Tooltip title="Edit Store Hours">
                            {isManager ||
                            (isAdmin && userStoreId === store.store_id) ? (
                              <Tooltip title="Edit Store Hours">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleEditHours(
                                      store.store_id,
                                      store.open_time,
                                      store.close_time
                                    )
                                  }
                                  sx={{
                                    color: "var(--primary)",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                          </Tooltip>

                          {/* Divider between time and store status */}
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ margin: "0 10px" }}
                          />

                          {/* Store Status Toggle (Open/Close) */}
                          <Chip
                            icon={
                              isOpen ? (
                                <CheckCircleIcon
                                  sx={{ color: "var(--text) !important" }}
                                />
                              ) : (
                                <CancelIcon
                                  sx={{ color: "var(--text) !important" }}
                                />
                              )
                            }
                            label={isOpen ? "Open" : "Closed"}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              color:
                                isManager ||
                                (isAdmin && userStoreId === store.store_id)
                                  ? isOpen
                                    ? "var(--success)"
                                    : "var(--danger)"
                                  : "gray",
                              borderColor:
                                isManager ||
                                (isAdmin && userStoreId === store.store_id)
                                  ? isOpen
                                    ? "var(--success)"
                                    : "var(--danger)"
                                  : "gray",
                              cursor:
                                isManager ||
                                (isAdmin && userStoreId === store.store_id)
                                  ? "pointer"
                                  : "not-allowed",
                              flex: 1,
                              minWidth: "100px",
                              borderWidth: "3px",
                              opacity:
                                isManager ||
                                (isAdmin && userStoreId === store.store_id)
                                  ? 1
                                  : 0.5,
                            }}
                            onClick={
                              isManager ||
                              (isAdmin && userStoreId === store.store_id)
                                ? () =>
                                    handleToggleStore(store.store_id, isOpen)
                                : undefined
                            }
                          />

                          {/* Expand/Collapse Button */}
                          <IconButton
                            size="small"
                            onClick={() => toggleCard(store.store_id)}
                            sx={{
                              color: "var(--primary)",
                              "&:hover": {
                                backgroundColor: "rgba(238, 92, 1, 0.08)",
                              },
                            }}
                          >
                            {openCards[store.store_id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Box>

                      <Collapse
                        in={openCards[store.store_id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ pl: 1 }}>
                          {store.staff && store.staff.length > 0 ? (
                            <Stack spacing={2}>
                              {store.staff.map((user) => (
                                <Box
                                  key={user.user_id}
                                  display="flex"
                                  flexDirection={{ xs: "column", sm: "row" }}
                                  alignItems="center"
                                  gap={2}
                                  sx={{
                                    backgroundColor: "var(--card)",
                                    padding: 2,
                                    borderRadius: "12px",
                                    border: "1px solid var(--component-border)",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <PersonIcon
                                      fontSize="small"
                                      color="action"
                                    />
                                    <Typography>
                                      {user.first_name} {user.last_name} —{" "}
                                      <strong>{roleLabels[user.role]}</strong>
                                    </Typography>
                                  </Box>
                                  {isManager && (
                                    <Select
                                      size="small"
                                      value={store.store_id}
                                      onChange={(e) =>
                                        handleReassign(
                                          user.user_id,
                                          e.target.value
                                        )
                                      }
                                      sx={{
                                        minWidth: 140,
                                        color: "var(--body-text)",
                                        borderColor: "var(--component-border)",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                          borderColor:
                                            "var(--component-border)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                          {
                                            borderColor: "var(--primary)",
                                          },
                                      }}
                                    >
                                      {stores.map((s) => (
                                        <MenuItem
                                          key={s.store_id ?? "none"}
                                          value={s.store_id ?? null}
                                        >
                                          {s.store_name || "Unassigned"}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                </Box>
                              ))}
                            </Stack>
                          ) : (
                            <Typography
                              sx={{ fontStyle: "italic", color: "#999" }}
                            >
                              No staff assigned to this store.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </Paper>
                  );
                })}

              <Paper
                elevation={1}
                sx={{
                  padding: 2,
                  border: "1px dashed var(--component-border)",
                  backgroundColor: "var(--warning)",
                  overflow: "auto",
                  color: "black",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  🕳️ Unassigned Staff
                </Typography>
                {unassignedGroup &&
                Array.isArray(unassignedGroup.staff) &&
                unassignedGroup.staff.length > 0 ? (
                  <Stack spacing={2}>
                    {unassignedGroup.staff.map((user) => (
                      <Box
                        key={user.user_id}
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        alignItems="center"
                        gap={2}
                        sx={{
                          backgroundColor: "var(--card)",
                          padding: 2,
                          borderRadius: "12px",
                          border: "1px solid var(--component-border)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon fontSize="small" color="disabled" />
                          <Typography>
                            {user.first_name} {user.last_name} —{" "}
                            <strong>{roleLabels[user.role]}</strong>
                          </Typography>
                        </Box>
                        <Select
                          size="small"
                          value={null}
                          onChange={(e) =>
                            handleReassign(user.user_id, e.target.value)
                          }
                          sx={{ minWidth: 140 }}
                        >
                          {stores
                            .filter((s) => s.store_id !== null)
                            .map((s) => (
                              <MenuItem key={s.store_id} value={s.store_id}>
                                {s.store_name}
                              </MenuItem>
                            ))}
                          <MenuItem value={null}>Unassigned</MenuItem>
                        </Select>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ fontStyle: "italic", color: "#000" }}>
                    No unassigned staff.
                  </Typography>
                )}
              </Paper>
            </>
          )}
        </div>
      </div>
      {editModalOpen && (
        <EditStoreHoursModal
          store_id={currentStoreHours.store_id}
          open_time={currentStoreHours.open_time}
          close_time={currentStoreHours.close_time}
          onSave={handleSaveStoreHours}
          onCancel={() => setEditModalOpen(false)}
        />
      )}

      {confirmToggle && (
        <TwoChoicesModal
          title={confirmToggle.isOpen ? "Close Store?" : "Open Store?"}
          text={`Are you sure you want to ${
            confirmToggle.isOpen ? "close" : "open"
          } this store?`}
          confirmLabel="Yes"
          cancelLabel="No"
          onConfirm={confirmToggleAction}
          onCancel={() => setConfirmToggle(null)}
        />
      )}

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
    </>
  );
}

export default ManageStores;
