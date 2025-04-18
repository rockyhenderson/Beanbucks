export function getSessionUser() {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse session user:", err);
      return null;
    }
  }
  
  export function getUserRoleString() {
    const user = getSessionUser();
    return user?.role ?? null; // returns "admin", "manager", "customer", etc.
  }
  
  export function getUserRoleNumber() {
    const roleMap = {
      customer: 1,
      admin: 2,
      manager: 3,
    };
    const roleStr = getUserRoleString();
    return roleMap[roleStr] ?? 1; // default to customer
  }
  