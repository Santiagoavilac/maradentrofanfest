export function createQrCode() {
  const random = crypto.getRandomValues(new Uint32Array(2));
  const token = Array.from(random)
    .map((part) => part.toString(36).toUpperCase().padStart(6, "0"))
    .join("")
    .slice(0, 8);

  return `MA-2026-${token}`;
}

export function storeRegistrationSnapshot(registration: unknown) {
  sessionStorage.setItem("latest-registration", JSON.stringify(registration));
}

export function readRegistrationSnapshot<T>() {
  const raw = sessionStorage.getItem("latest-registration");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
