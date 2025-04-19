import React, { useEffect, useState } from "react";
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import RetryFallback from "../../components/RetryFallback";
import Toast from "../../components/Toast";
import { Box, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function AdminLogs() {
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const {
    data: logs,
    error,
    retry,
    isLoading,
  } = useFetchWithRetry(
    user?.role === "manager"
      ? "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/users/read_admin_logs.php"
      : null
  );

  useEffect(() => {
    if (error) {
      console.error("❌ AdminLogs fetch error:", error);
      setToast({
        type: "error",
        title: "Server Error",
        message: "Failed to fetch admin logs. Please try again.",
      });
    }
  }, [error]);

  if (user?.role !== "manager") {
    return (
      <Box sx={{ padding: "30px", textAlign: "center", marginTop: "80px" }}>
        <Typography variant="h5">🚫 Access Denied</Typography>
        <Typography>Only managers can view admin logs.</Typography>
      </Box>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "admin_email",
      headerName: "Admin",
      flex: 1.5,
    },
    {
      field: "action_type",
      headerName: "Action",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Timestamp",
      flex: 1.5,
    },
  ];

  const filteredRows = Array.isArray(logs)
    ? logs.filter((log) =>
        Object.values(log).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  return (
    <Box sx={{ padding: 4 }}>
      <h1>Admin Logs</h1>
      <Typography sx={{ marginBottom: 3 }}>
        This section provides a detailed log of administrative activity within
        the system.
      </Typography>

      {isLoading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <RetryFallback onRetry={retry} />
      ) : (
        <>
          <Box sx={{ marginBottom: 2, maxWidth: 300 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <DataGrid
            rows={filteredRows}
            columns={columns}
            autoHeight
            getRowId={(row) => row.id}
            pageSize={8}
            rowsPerPageOptions={[8, 15, 25]}
            disableSelectionOnClick
            sx={{
              backgroundColor: "var(--card)",
              borderColor: "var(--component-border)",
              color: "var(--text)",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--accent)",
                fontWeight: "bold",
                color: "var(--text)",
              },
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid var(--component-border)",
              },
            }}
          />
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
    </Box>
  );
}

export default AdminLogs;
