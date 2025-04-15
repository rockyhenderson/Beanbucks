import React from "react";

function ManageMenu() {
  return (
    <div style={{ display: 'flex' }}>
      <div className="main-page-content" style={{ flexGrow: 1, padding: '30px' }}>
        <h1>Manage Menu ☕📋</h1>
        <p>
          This section allows you to manage the availability of menu items and customizations. 
          Permissions are based on your role:
        </p>

        <h2>Admins</h2>
        <ul>
          <li>Can toggle individual menu items <strong>in or out of stock</strong>.</li>
          <li>Can toggle customizations (e.g., milk options, flavors) <strong>in or out of stock</strong>.</li>
          <li>Cannot edit seasonal menus or change item details.</li>
        </ul>

        <h2>Managers</h2>
        <ul>
          <li>Can do everything admins can: toggle items and customizations in/out of stock.</li>
          <li>Can manage <strong>seasonal menu rotations</strong> (e.g., switching between winter/spring menus).</li>
          <li>May have access to modify item metadata like pricing, images, or tags (TBD).</li>
        </ul>

        <p style={{ marginTop: '20px' }}>
          Menu items and customizations will be listed below with controls to update their availability.
          Seasonal rotation options will also be visible for managers.
        </p>
      </div>
    </div>
  );
}

export default ManageMenu;
