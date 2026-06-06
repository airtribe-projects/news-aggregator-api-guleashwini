const newsService = require('./newsService');
const usersService = require('./usersService');
const cacheService = require('./cacheService');

const UPDATE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

async function refreshCache() {
    const users = usersService.getAllUsers();
    const seen = new Set();

    for (const user of users) {
        if (!user.preferences || user.preferences.length === 0) continue;

        const key = [...user.preferences].sort().join(',');
        if (seen.has(key)) continue;
        seen.add(key);

        try {
            cacheService.clear(key); // force a fresh fetch
            await newsService.fetchNewsByPreferences(user.preferences);
            console.log(`Cache refreshed for preferences: ${key}`);
        } catch (err) {
            console.error(`Cache refresh failed for key "${key}":`, err.message);
        }
    }
}

const intervalId = setInterval(refreshCache, UPDATE_INTERVAL_MS);

// Export stop so app.js can clean up the interval on shutdown
function stop() {
    clearInterval(intervalId);
}

module.exports = { stop };
