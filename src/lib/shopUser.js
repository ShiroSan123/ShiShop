import { base44 } from "@/api/base44Client";

const GUEST_STORAGE_KEY = "shishop_guest_id";

const getGuestId = () => {
  if (typeof window === "undefined") {
    return "guest-server";
  }

  const stored = window.localStorage.getItem(GUEST_STORAGE_KEY);
  if (stored) {
    return stored;
  }

  const generated =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? `guest-${crypto.randomUUID()}`
      : `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(GUEST_STORAGE_KEY, generated);
  return generated;
};

export const getShopUserKey = async () => {
  try {
    const user = await base44.auth.me();
    return user?.email || getGuestId();
  } catch {
    return getGuestId();
  }
};

