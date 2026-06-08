// Syncs the logged-in user's display name and avatar to localStorage so
// SiteHeader can read them via the "auth-change" event without an extra API call.
// Import and call from any client component after any mutation that changes user identity.

export function syncNavUser(name: string, avatarUrl: string | null): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("TRAVELEZ_CURRENT_USER") ?? "{}";
  const prev = JSON.parse(stored);
  localStorage.setItem(
    "TRAVELEZ_CURRENT_USER",
    JSON.stringify({ ...prev, name, fullName: name, avatarUrl }),
  );
  window.dispatchEvent(new Event("auth-change"));
}
