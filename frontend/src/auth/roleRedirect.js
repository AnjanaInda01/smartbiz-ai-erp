const normalizeRole = (role) => {
  if (!role) return "";
  const r = String(role).toUpperCase();
  return r.startsWith("ROLE_") ? r.replace("ROLE_", "") : r;
};

export const roleHome = (role) => {
  const r = normalizeRole(role);

  if (r === "ADMIN") return "/admin";
  if (r === "OWNER") return "/owner";
  if (r === "STAFF") return "/staff";

  return "/login";
};

export const isAllowedRole = (role, allowRoles = []) => {
  const r = normalizeRole(role);
  return allowRoles.map(normalizeRole).includes(r);
};

export { normalizeRole };