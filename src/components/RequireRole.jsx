import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const RequireRole = ({ allowedRoles, children }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      sessionStorage.setItem(
        "redirectToast",
        JSON.stringify({
          type: "error",
          title: "Access Denied",
          message: "You do not have permission to view this page.",
        })
      );
    }
  }, [role, allowedRoles]);

  return allowedRoles.includes(role) ? children : <Navigate to="/" replace />;
};

export default RequireRole;
