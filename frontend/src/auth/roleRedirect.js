export const roleHome = (role) => {
  if (role === "ADMIN") return "/admin";
  if (role === "OWNER") return "/owner";
  if (role === "STAFF") return "/staff";
  return "/login";
};
