import React from "react";

function AllergenFeatureAdvert({ isLoggedIn }) {
  return (
    <section className="allergen-feature">
      <h2>🛡️ New Allergen Filter</h2>
      <p>Filter the menu based on your dietary needs.</p>
      {isLoggedIn && <a href="/profile/preferences">Update Your Preferences</a>}
    </section>
  );
}

export default AllergenFeatureAdvert;
