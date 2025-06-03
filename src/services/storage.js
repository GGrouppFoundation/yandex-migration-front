class StorageService {
    get(key) {
        const item = localStorage.getItem(key);
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    }

    set(key, value) {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}

export const storage = new StorageService();