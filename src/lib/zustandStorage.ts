import { StateStorage, createJSONStorage } from 'zustand/middleware';
import { idbGetKV, idbRemoveKV, idbSetKV } from './idb';

function createIdbStateStorage(keyNamespace: string): StateStorage {
  return {
    getItem: async (name: string) => {
      const value = await idbGetKV<string>(`${keyNamespace}:${name}`);
      return value ?? null;
    },
    setItem: async (name: string, value: string) => {
      await idbSetKV(`${keyNamespace}:${name}`, value);
    },
    removeItem: async (name: string) => {
      await idbRemoveKV(`${keyNamespace}:${name}`);
    },
  } as StateStorage;
}

export function idbJsonStorage(namespace: string) {
  return createJSONStorage(() => createIdbStateStorage(namespace));
}


