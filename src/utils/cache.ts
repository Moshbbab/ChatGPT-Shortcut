export const CACHE_TTL = 3600 * 1000; // 1 hour

export function getCache<T = any>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`aishort_${key}`);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(`aishort_${key}`);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

export function setCache<T = any>(key: string, value: T, ttlMs: number = CACHE_TTL): void {
  try {
    const item = {
      value,
      expiry: Date.now() + ttlMs,
    };
    localStorage.setItem(`aishort_${key}`, JSON.stringify(item));
  } catch (e) {
    console.warn("Failed to set cache:", e);
  }
}

export function cleanupLegacyCache(): void {
  try {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("aishort_")) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "");
          if (item && item.expiry && now > item.expiry) {
            localStorage.removeItem(key);
          }
        } catch {
          // ignore non-json
        }
      }
    }
  } catch {
    // ignore
  }
}
