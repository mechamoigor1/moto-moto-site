export function safeAdminRedirect(value: string) {
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}
