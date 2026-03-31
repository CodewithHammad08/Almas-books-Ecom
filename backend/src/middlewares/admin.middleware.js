// ── admin.middleware.js ───────────────────────────────────────────────────────
// Legacy file preserved for backward compatibility with existing route imports.
// All logic is now in auth.middleware.js → requireAdmin / isAdminRole.
export { requireAdmin as isAdmin } from "./auth.middleware.js";
