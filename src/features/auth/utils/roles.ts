// Roles that shop in the PWA. A vendor_pending user is still a customer until
// approved. Everyone else (vendor, admin, super_admin) uses the Seller Dashboard.
const BUYER_ROLES = ["customer", "vendor_pending"];

export const isBuyerRole = (role: string) => BUYER_ROLES.includes(role);
