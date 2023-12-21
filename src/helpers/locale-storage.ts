function createStorage(key: string) {
  let store: Record<string, any> = {};

  if (typeof window !== 'undefined') {
    const localStorageData = window.localStorage.getItem(key);
    store = JSON.parse(localStorageData || '{}');
  }

  const save = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(store));
    }
  };

  const storage = {
    get(key: string) {
      return store[key];
    },
    set(key: string, value: any) {
      store[key] = value;
      save();
    },
    remove(key: string) {
      delete store[key];
      save();
    },
  };

  return storage;
}

export const authStorage = createStorage('auth');
