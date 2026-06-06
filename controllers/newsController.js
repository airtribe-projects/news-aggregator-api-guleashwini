const usersService = require('../services/usersService');
const newsService = require('../services/newsService');

async function getNews(req, res) {
    try {
        const user = usersService.getUserById(req.user.id);
        const articles = await newsService.fetchNewsByPreferences(user.preferences);
        res.status(200).json({ news: articles });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

async function searchNews(req, res) {
    try {
        const { keyword } = req.params;
        const articles = await newsService.searchNewsByKeyword(keyword);
        res.status(200).json({ news: articles });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

function markAsRead(req, res) {
    try {
        const user = usersService.getUserById(req.user.id);
        const articleId = parseInt(req.params.id, 10);
        const article = newsService.getArticleFromCache(user.preferences, articleId);

        if (!article) {
            return res.status(404).json({ message: 'Article not found. Fetch your news feed first.' });
        }

        usersService.markArticleAsRead(req.user.id, article);
        res.status(200).json({ message: 'Article marked as read', article });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

function markAsFavorite(req, res) {
    try {
        const user = usersService.getUserById(req.user.id);
        const articleId = parseInt(req.params.id, 10);
        const article = newsService.getArticleFromCache(user.preferences, articleId);

        if (!article) {
            return res.status(404).json({ message: 'Article not found. Fetch your news feed first.' });
        }

        usersService.markArticleAsFavorite(req.user.id, article);
        res.status(200).json({ message: 'Article marked as favorite', article });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

function getReadArticles(req, res) {
    try {
        const articles = usersService.getReadArticles(req.user.id);
        res.status(200).json({ readArticles: articles });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

function getFavoriteArticles(req, res) {
    try {
        const articles = usersService.getFavoriteArticles(req.user.id);
        res.status(200).json({ favoriteArticles: articles });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

module.exports = { getNews, searchNews, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles };

