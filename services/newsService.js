const axios = require('axios');
const cacheService = require('./cacheService');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';

function buildCacheKey(preferences) {
    return [...preferences].sort().join(',');
}

function addIds(articles) {
    return articles.map((article, index) => ({ id: index + 1, ...article }));
}

async function fetchNewsByPreferences(preferences) {
    if (!NEWS_API_KEY) {
        console.warn('NEWS_API_KEY is not set — returning empty news list');
        return [];
    }

    if (!preferences || preferences.length === 0) {
        return [];
    }

    const cacheKey = buildCacheKey(preferences);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(NEWS_API_BASE_URL, {
        params: {
            q: preferences.join(' OR '),
            apiKey: NEWS_API_KEY,
            pageSize: 10,
            language: 'en',
            sortBy: 'publishedAt'
        }
    });

    const articles = addIds(response.data.articles);
    cacheService.set(cacheKey, articles);
    return articles;
}

async function searchNewsByKeyword(keyword) {
    if (!NEWS_API_KEY) {
        console.warn('NEWS_API_KEY is not set — returning empty news list');
        return [];
    }

    const response = await axios.get(NEWS_API_BASE_URL, {
        params: {
            q: keyword,
            apiKey: NEWS_API_KEY,
            pageSize: 10,
            language: 'en',
            sortBy: 'relevancy'
        }
    });

    return addIds(response.data.articles);
}

function getArticleFromCache(preferences, id) {
    const cacheKey = buildCacheKey(preferences);
    const articles = cacheService.get(cacheKey);
    if (!articles) return null;
    return articles.find(a => a.id === id) || null;
}

module.exports = { fetchNewsByPreferences, searchNewsByKeyword, getArticleFromCache };

