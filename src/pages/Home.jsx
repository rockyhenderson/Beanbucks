import React from "react";

function Home() {
  return (
    <div class="main-page-content">
      <h1>Welcome to BeanBucks Home ☕</h1>

      <div class="temp-component-box">
        <strong>Hero Banner with CTA</strong>
        <p>Promotes new menu items, seasonal drinks, or limited-time offers.</p>
        <p>Includes a strong call-to-action (e.g., "Try Now", "Order Today").</p>
      </div>

      <div class="temp-component-box">
        <strong>Featured & Trending Menu Items</strong>
        <p>Displays best-selling drinks based on real-time sales data.</p>
        <p>Helps users quickly see what’s popular.</p>
      </div>

      <div class="temp-component-box">
        <strong>Loyalty Points Advert (If Logged In)</strong>
        <p>Quick preview of earned points and how to redeem them.</p>
        <p>Encourages engagement with the rewards system.</p>
      </div>

      <div class="temp-component-box">
        <strong>New Allergen Feature Advert</strong>
        <p>Highlights the ability to filter the menu based on allergens & dietary preferences.</p>
        <p>If logged in, includes a link to update user preferences.</p>
      </div>

      <div class="temp-component-box">
        <strong>Social Proof</strong>
        <p>Showcases diversity & inclusivity of BeanBucks’ customer base.</p>
        <p>Could include testimonials, reviews, or a “Loved by Many” statement.</p>
      </div>

      <div class="temp-component-box">
        <strong>How It Works</strong>
        <p>Simple, step-by-step guide for new users.</p>
        <p>Example: “Order Online → Pick Up In-Store → Earn Rewards.”</p>
      </div>
    </div>
  );
}

export default Home;
