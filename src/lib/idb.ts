// Lightweight IndexedDB helper without external deps
// Stores: jobs (keyPath 'id'), candidates (keyPath 'id'), assessments (keyPath 'id'), responses (keyPath 'id'), kv (key 'key')

const DB_NAME = 'talentflow';
const DB_VERSION = 1;

type StoreName = 'jobs' | 'candidates' | 'assessments' | 'responses' | 'kv';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('jobs')) db.createObjectStore('jobs', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('candidates')) db.createObjectStore('candidates', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('assessments')) db.createObjectStore('assessments', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('responses')) db.createObjectStore('responses', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv', { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function tx(store: StoreName, mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDb().then(db => db.transaction(store, mode).objectStore(store));
}

export async function idbGetAll<T = any>(store: StoreName): Promise<T[]> {
  const objectStore = await tx(store, 'readonly');
  return new Promise((resolve, reject) => {
    const req = objectStore.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetById<T = any>(store: StoreName, id: string): Promise<T | undefined> {
  const objectStore = await tx(store, 'readonly');
  return new Promise((resolve, reject) => {
    const req = objectStore.get(id);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function idbPut<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
  const objectStore = await tx(store, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = objectStore.put(value);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbBulkPut<T extends { id: string }>(store: StoreName, values: T[]): Promise<void> {
  if (!values.length) return;
  const objectStore = await tx(store, 'readwrite');
  await new Promise<void>((resolve, reject) => {
    let remaining = values.length;
    values.forEach(v => {
      const req = objectStore.put(v);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        remaining -= 1;
        if (remaining === 0) resolve();
      };
    });
  });
}

export async function idbDelete(store: StoreName, id: string): Promise<void> {
  const objectStore = await tx(store, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = objectStore.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbClear(store: StoreName): Promise<void> {
  const objectStore = await tx(store, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = objectStore.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbSetKV<T = any>(key: string, value: T): Promise<void> {
  const objectStore = await tx('kv', 'readwrite');
  return new Promise((resolve, reject) => {
    const payload = { key, value } as any;
    const req = objectStore.put(payload);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetKV<T = any>(key: string): Promise<T | null> {
  const objectStore = await tx('kv', 'readonly');
  return new Promise((resolve, reject) => {
    const req = objectStore.get(key);
    req.onsuccess = () => {
      const rec = req.result as any;
      resolve(rec ? (rec.value as T) : null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function idbRemoveKV(key: string): Promise<void> {
  const objectStore = await tx('kv', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = objectStore.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}


