// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   IconButton,
//   Typography,
//   Button,
//   useMediaQuery,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// const roles = ["none", "customer", "admin", "manager"];

// function DevToolsPanel() {
//   const [open, setOpen] = useState(false);
//   const isDark = document.documentElement.getAttribute("data-theme") === "dark";
//   const isMobile = useMediaQuery("(max-width: 600px)");
//   const [selectedRole, setSelectedRole] = useState("none");

//   useEffect(() => {
//     // On mount, read role from sessionStorage if it exists
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         setSelectedRole(parsed.role || "none");
//       } catch {
//         setSelectedRole("none");
//       }
//     }
//   }, []);

//   const toggleTheme = () => {
//     const html = document.documentElement;
//     const current = html.getAttribute("data-theme");
//     html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
//   };

//   const handleRoleChange = (event) => {
//     const role = event.target.value;
//     setSelectedRole(role);

//     sessionStorage.clear();

//     if (role === "none") return;

//     const mockUser = {
//       id: 999,
//       name: "Dev User",
//       role,
//     };

//     sessionStorage.setItem("token", "mock-dev-token");
//     sessionStorage.setItem("user", JSON.stringify(mockUser));

//     window.location.reload(); // Refresh to apply changes
//   };

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: "40%",
//         left: 0,
//         zIndex: 9999,
//         display: "flex",
//         flexDirection: "row",
//         transition: "all 0.3s ease-in-out",
//         transform: open ? "translateX(0)" : "translateX(-220px)",
//       }}
//     >
//       {/* Panel */}
//       <Box
//         sx={{
//           width: 220,
//           backgroundColor: "#222",
//           color: "#FFF",
//           padding: "12px",
//           borderTopRightRadius: "8px",
//           borderBottomRightRadius: "8px",
//           boxShadow: "4px 0 12px rgba(0,0,0,0.4)",
//           fontFamily: "Poppins, sans-serif",
//         }}
//       >
//         <Typography
//           variant="subtitle1"
//           sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
//         >
//           Dev Tools
//         </Typography>

//         <Button
//           variant="contained"
//           size="small"
//           onClick={toggleTheme}
//           sx={{
//             width: "100%",
//             fontSize: "12px",
//             fontWeight: "bold",
//             textTransform: "none",
//             backgroundColor: "#FD6100",
//             "&:hover": {
//               backgroundColor: "#d44f00",
//             },
//           }}
//         >
//           Toggle Theme ({isDark ? "Light" : "Dark"})
//         </Button>

//         <Button
//           variant="outlined"
//           size="small"
//           component="a"
//           href="/quarry"
//           sx={{
//             width: "100%",
//             fontSize: "12px",
//             fontWeight: "bold",
//             textTransform: "none",
//             color: "#FFF",
//             borderColor: "#FFF",
//             mt: 1,
//             "&:hover": {
//               borderColor: "#FFE7D2",
//               color: "#FFE7D2",
//             },
//           }}
//         >
//           Open Quarry
//         </Button>

//         {/* Role Switcher */}
//         <Box sx={{ mt: 2 }}>
//         <Typography
//             variant="body2"
//             sx={{
//               mb: 1,
//               fontSize: "12px",
//               color: "#00FF90",
//               fontWeight: "bold",
//               textAlign: "center",
//             }}
//           >
//             {selectedRole === "none"
//               ? "Not Logged In"
//               : `Current Role: ${selectedRole.toUpperCase()}`}
//           </Typography>
//           <FormControl fullWidth size="small">
//             <InputLabel sx={{ color: "#FFF" }}>User Role</InputLabel>
//             <Select
//               value={selectedRole}
//               onChange={handleRoleChange}
//               sx={{
//                 color: "#FFF",
//                 backgroundColor: "#333",
//                 ".MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#666",
//                 },
//                 "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#FD6100",
//                 },
//                 "&:hover .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#FD6100",
//                 },
//               }}
//               label="User Role"
//             >
//               {roles.map((role) => (
//                 <MenuItem key={role} value={role}>
//                   {role === "none" ? "Not Logged In" : role.charAt(0).toUpperCase() + role.slice(1)}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

         
//         </Box>
//       </Box>

//       {/* Toggle Tab */}
//       <IconButton
//         onClick={() => setOpen(!open)}
//         sx={{
//           borderRadius: "0 8px 8px 0",
//           backgroundColor: "#FD6100",
//           color: "#FFF",
//           ml: "2px",
//           height: "48px",
//           width: "32px",
//           "&:hover": {
//             backgroundColor: "#d44f00",
//           },
//         }}
//       >
//         {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
//       </IconButton>
//     </Box>
//   );
// }

// export default DevToolsPanel;
import React from "react";

const DevTools = () => {
  return <div style={{ padding: "2rem" }}></div>;
};

export default DevTools;
