import React from 'react';

function Cart() {
    return (
        <div class="main-page-content">
            <h1>Your Cart 🛒</h1>
            <ul>
                <li>Display all selected items with customization options (size, milk type, syrups, toppings).</li>
                <li>Show total price with dynamic updates based on user selections.</li>
                <li>Allow users to edit or remove items before checkout.</li>
                <li>Provide allergen warnings for items in the cart.</li>
                <li>Enable users to apply loyalty points or discount codes.</li>
                <li>Proceed to checkout with secure payment processing.</li>
            </ul>
        </div>
    );
}

export default Cart;
