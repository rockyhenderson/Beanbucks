import React, { useEffect, useState } from "react";
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import RetryFallback from "../../components/RetryFallback";
import Toast from "../../components/Toast";
import EditUserModal from "../../components/EditUserModal";
import TwoChoicesModal from "../../components/TwoChoices";
import CreateUserModal from "../../components/CreateUserModal";

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Collapse,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getUserRoleString,
  getUserRoleNumber,
} from "../../utils/sessionHelpers";
import { Add } from "@mui/icons-material";

const baseColumns = [
  { field: "id", headerName: "ID", flex: 0.4 },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1.5 },
  { field: "createdAt", headerName: "Created At", flex: 1.2 },
];

function UserTable({
  title,
  rows,
  includeLoyalty = false,
  onRowClick,
  onDeleteClick,
  onAddClick,
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);

  const deleteColumn = {
    field: "delete",
    headerName: "Delete",
    flex: 0.5,
    sortable: false,
    renderCell: (params) => (
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(params.row);
        }}
      >
        <DeleteIcon style={{ color: "#E51A3C" }} />
      </IconButton>
    ),
  };

  const columns = includeLoyalty
    ? [
        ...baseColumns.slice(0, 4),
        { field: "loyaltyPoints", headerName: "Loyalty Points", flex: 1 },
        ...baseColumns.slice(4),
        deleteColumn,
      ]
    : [...baseColumns, deleteColumn];

  const filteredRows = rows.filter((row) => {
    const combined = Object.values(row).join(" ").toLowerCase();
    return combined.includes(search.toLowerCase());
  });

  return (
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
          {title}
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
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

          <Box sx={{ flexShrink: 0, marginLeft: 2 }}>
            <button
              className="btn btn--primary"
              onClick={onAddClick}
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
              Add User
            </button>
          </Box>
        </Box>

        <Box sx={{ width: "100%", backgroundColor: "var(--card)" }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterPagination
            onRowClick={onRowClick}
            getRowClassName={(params) =>
              params.row.isVerified === 0 ? "row-unverified" : ""
            }
            localeText={{
              noRowsLabel: "No user data with this search criteria",
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
  );
}

function ManageUsers() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(null);

  const showToast = (data) => setToast(data);

  const roleStr = getUserRoleString();
  const roleNum = getUserRoleNumber();

  useEffect(() => {
    if (roleStr === "customer" || roleNum === 1) {
      alert("Access denied: You do not have permission to view this page.");
      navigate("/");
    }
  }, [roleStr, roleNum, navigate]);

  const { data, error, retry, isLoading } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/users/read_user.php?role=${roleNum}`
  );

  // useEffect(() => {
  //   if (data && Array.isArray(data)) {
  //     setToast({
  //       type: "info",
  //       title: "Users Loaded",
  //       message: "User data loaded successfully.",
  //     });
  //   }
  // }, [data]);

  useEffect(() => {
    if (error) {
      setToast({
        type: "error",
        title: "Server Error",
        message: "Could not fetch user data. The server might be down.",
      });
    }
  }, [error]);

  const rows = Array.isArray(data) ? data.map((u) => ({ ...u })) : [];
  const users = rows.filter((u) => u.role === 1);
  const admins = rows.filter((u) => u.role === 2);
  const managers = rows.filter((u) => u.role === 3);

  const handleRowClick = (params) => setSelectedUser(params.row);

  const handleEditSave = async (updatedData) => {
    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/users/update_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedUser.id,
            first_name: updatedData.firstName,
            last_name: updatedData.lastName,
            email: updatedData.email,
            loyalty_points: updatedData.loyaltyPoints,
          }),
        }
      );

      const result = await response.json();
      console.log("Update response:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      if (response.ok && result.success) {
        setToast({
          type: "success",
          title: "User Updated",
          message: result.success,
        });
        setSelectedUser(null);
        retry();
      } else {
        throw new Error("Unexpected server response.");
      }
    } catch (err) {
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Something went wrong.",
      });
    }
  };

  const handleDeleteClick = (user) => setDeleteTarget(user);

  const handleDeleteConfirm = async () => {
    try {
      const adminId = JSON.parse(sessionStorage.getItem("user"))?.id; // Get admin's ID from session storage
      console.log("🟡 [DeleteUser] Admin ID:", adminId);

      if (!adminId) {
        setToast({
          type: "error",
          title: "Authentication Error",
          message: "Admin ID not found. Please log in again.",
        });
        return;
      }

      const payload = { id: deleteTarget.id, admin_id: adminId }; // Prepare payload
      console.log("📦 [DeleteUser] Payload:", payload);

      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/users/delete_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const raw = await response.text();
      console.log("📨 [DeleteUser] Raw response from server:", raw);

      let result;
      try {
        result = JSON.parse(raw);
        console.log("✅ [DeleteUser] Parsed JSON:", result);
      } catch (err) {
        console.error("❌ [DeleteUser] Failed to parse JSON:", err);
        throw new Error("Invalid JSON from server.");
      }

      if (response.ok && result.success) {
        console.log("✅ [DeleteUser] User deletion successful:", result.success);
        setToast({
          type: "success",
          title: "User Deleted",
          message: result.success,
        });
        setDeleteTarget(null);
        retry();
      } else {
        console.warn("⚠️ [DeleteUser] Backend Error:", result.error);
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("🚨 [DeleteUser] Catch:", err);
      setToast({
        type: "error",
        title: "Delete Failed",
        message: err.message,
      });
    }
  };
  
  const handleCreateUser = async (newUser) => {
    const role =
      showCreateModal === "admin" ? 2 : showCreateModal === "manager" ? 3 : 1;

    try {
      console.log("🟡 [CreateUser] Sending request to backend...");
      console.log("📦 Payload:", {
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        email: newUser.email,
        loyalty_points: newUser.loyaltyPoints,
        role,
      });

      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/users/create_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            email: newUser.email,
            loyalty_points: newUser.loyaltyPoints,
            role,
          }),
        }
      );

      const raw = await response.text();
      console.log("📨 Raw response from server:", raw);

      let result;
      try {
        result = JSON.parse(raw);
        console.log("✅ Parsed JSON:", result);
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        throw new Error("Invalid JSON from server.");
      }

      if (result.error) {
        console.warn("⚠️ Backend Error:", result.error);
        throw new Error(result.error);
      }

      if (result.success) {
        console.log("✅ User creation successful:", result.success);
        retry(); // Refresh data
        return result.success;
      }

      console.warn("❓ Unexpected backend response");
      throw new Error("Unknown error occurred");
    } catch (err) {
      console.error("🚨 CreateUser Catch:", err);
      throw err;
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {isLoading && <p>Loading...</p>}

      {error ? (
        <RetryFallback onRetry={retry} />
      ) : (
        <>
          <h1>User Management</h1>
          <Typography sx={{ marginBottom: 2 }}>
            Admins can manage users, but not other admins or managers. Managers
            have access to manage both users and admins.
          </Typography>

          <UserTable
            title="Users"
            rows={users}
            includeLoyalty
            onRowClick={handleRowClick}
            onDeleteClick={handleDeleteClick}
            onAddClick={() => setShowCreateModal("user")}
          />

          <UserTable
            title="Admins"
            rows={admins}
            onRowClick={handleRowClick}
            onDeleteClick={handleDeleteClick}
            onAddClick={() => setShowCreateModal("admin")}
          />

          {roleStr === "manager" && (
            <UserTable
              title="Managers"
              rows={managers}
              onRowClick={handleRowClick}
              onDeleteClick={handleDeleteClick}
              onAddClick={() => setShowCreateModal("manager")}
            />
          )}
        </>
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

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onCancel={() => setSelectedUser(null)}
          onSubmit={handleEditSave}
        />
      )}

      {deleteTarget && (
        <TwoChoicesModal
          title={"Delete User"}
          text={`Are you sure you want to delete ${deleteTarget.email}? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showCreateModal && (
        <CreateUserModal
          onCancel={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          infoText="The user will receive a password setup email upon creation."
          showToast={showToast}
        />
      )}
    </Box>
  );
}

export default ManageUsers;
