import React from 'react';

function Order() {
    return (
        <div class="main-page-content">
            <h1>Place Your Order 🍵</h1>
            <ul>
                <li>Display a dynamically updated menu based on real-time stock availability and seasonal items.</li>
                <li>Allow users to customize drinks (size, milk type, syrups, toppings) with dynamic pricing.</li>
                <li>Provide allergen warnings when selected drinks contain known allergens.</li>
                <li>Allow users to select a preferred store for pickup with geolocation services.</li>
                <li>Enable users to schedule a pickup time when placing an order.</li>
                <li>Display real-time order progress, updated by baristas.</li>
            </ul>
        </div>
    );
}

export default Order;
