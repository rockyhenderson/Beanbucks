import React from "react";

function ManageStores() {
  return (
    <div style={{ display: 'flex' }}>
      <div className="main-page-content" style={{ flexGrow: 1, padding: '30px' }}>
        <h1>Store Options 🏪</h1>
        <p>
          This section allows for managing store availability and operating hours. 
          Access is role-based depending on your permissions:
        </p>

        <h2>Managers</h2>
        <ul>
          <li>Can view and manage all stores.</li>
          <li>Can open or close any store using a toggle switch.</li>
          <li>Can update opening and closing times for all stores.</li>
        </ul>

        <h2>Admins</h2>
        <ul>
          <li>Can open or close <strong>their assigned store</strong> using a toggle switch.</li>
          <li>Cannot modify other store settings (e.g., hours or other stores).</li>
          <li>
            <em>Potential Feature:</em> Instead of directly closing their store, admins may be required
            to send a request to a manager for approval before the store is closed.
          </li>
        </ul>

        <p style={{ marginTop: '20px' }}>
          Each store will be listed below with options to toggle availability and update hours, depending on your role.
        </p>
      </div>
    </div>
  );
}

export default ManageStores;
