import React from 'react';

function Admin() {
    return (
        <div class="main-page-content">
            <h1>Admin Dashboard 🔧🕵️</h1>
            <ul>
                <li>Allow admins to log in securely with role-based access control.</li>
                <li>Enable CRUD operations for menu management (add, edit, remove items).</li>
                <li>Provide stock level updates with notifications for low stock.</li>
                <li>Allow bulk updates for prices, stock, and promotions.</li>
                <li>Display sales and customer engagement analytics with real-time updates.</li>
                <li>Enable baristas to update order status ('Ordered' → 'Ready for Pickup').</li>
                <li>Track all admin activities (menu updates, stock changes) in an audit log.</li>
                <li>Ensure secure role-based permissions for sensitive features.</li>
                <li>Open and close stores when needed</li>
            </ul>
        </div>
    );
}

export default Admin;
