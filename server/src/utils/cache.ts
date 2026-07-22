type CacheEntry<T> = {
  value: T;
  expiry: number;
};

const store = new Map<string, CacheEntry<any>>();

export function getCacheValue<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

export function setCacheValue<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, {
    value,
    expiry: Date.now() + ttlMs,
  });
}

export function deleteCacheValue(key: string): void {
  store.delete(key);
}