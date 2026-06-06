const TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map();

function get(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function set(key, data) {
    cache.set(key, { data, fetchedAt: Date.now() });
}

function clear(key) {
    if (key !== undefined) cache.delete(key);
    else cache.clear();
}

function getAllKeys() {
    return [...cache.keys()];
}

module.exports = { get, set, clear, getAllKeys };
