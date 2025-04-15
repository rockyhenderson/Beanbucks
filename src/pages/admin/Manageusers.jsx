import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1.5 },
  { field: "password", headerName: "Password", flex: 1 },
];
<style>
  {`
  .MuiDataGrid-columnHeaderTitle {
    color: red !important;
  }
`}
</style>;

const users = [
  {
    id: 1,
    firstName: "Jamie",
    lastName: "Brew",
    email: "jamie@example.com",
    password: "••••••",
  },
  {
    id: 2,
    firstName: "Alex",
    lastName: "Carter",
    email: "alex@example.com",
    password: "••••••",
  },
];

const admins = [
  {
    id: 3,
    firstName: "Riley",
    lastName: "Moon",
    email: "riley@beanbucks.com",
    password: "••••••",
  },
];

const managers = [
  {
    id: 4,
    firstName: "Morgan",
    lastName: "Lane",
    email: "morgan@beanbucks.com",
    password: "••••••",
  },
];

function UserTable({ title, rows }) {
  const [search, setSearch] = useState("");

  const filteredRows = rows.filter((row) => {
    const combined = Object.values(row).join(" ").toLowerCase();
    return combined.includes(search.toLowerCase());
  });

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      <TextField
        size="small"
        placeholder="Search..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          marginBottom: 2,
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

      <Box sx={{ width: "100%", backgroundColor: "var(--card)" }}>
        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooterPagination
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

            "& .MuiDataGrid-columnHeaderTitle": {
              color: "var(--text) !important",
            },

            "& .MuiDataGrid-row": {
              borderBottom: "1px solid var(--component-border)",
            },

            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "var(--card)",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer, & .MuiDataGrid-columnHeaderTitle, MuiDataGrid-columnHeaderTitleContainerContent":
              {
                color: "var(--text) !important",
              },
          }}
        />
      </Box>
    </Box>
  );
}

function ManageUsers() {
  return (
    <Box sx={{ padding: 4 }}>
      <h1>User Managment</h1>

      <Typography>
        Admins can manage users, but not other admins or managers. Managers have
        access to manage both users and admins.
      </Typography>

      <UserTable title="Users" rows={users} />
      <UserTable title="Admins" rows={admins} />
      <UserTable title="Managers" rows={managers} />
    </Box>
  );
}

export default ManageUsers;
