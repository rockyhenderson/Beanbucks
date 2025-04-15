import React from "react";

function AdminLogs() {
  return (
    <div style={{ display: 'flex' }}>
      <div className="main-page-content" style={{ flexGrow: 1, padding: '30px' }}>
        <h1>Admin Logs 📜</h1>
        <p>
          This section provides a detailed log of administrative activity within the system.
          It includes actions such as menu updates, stock changes, store toggles, and more.
        </p>

        <h2>Access Control</h2>
        <ul>
          <li><strong>Only managers</strong> have access to view admin logs.</li>
          <li>Admins cannot view or interact with this section.</li>
          <li>Logs are recorded automatically and updated in real time.</li>
        </ul>

        <p style={{ marginTop: '20px' }}>
          Logs will appear below with filtering and search options for review.
        </p>
      </div>
    </div>
  );
}

export default AdminLogs;
