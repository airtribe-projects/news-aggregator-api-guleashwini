const { Router } = require('express');
const newsController = require('../controllers/newsController');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

// All news routes require authentication
router.get('/', authenticateToken, newsController.getNews);
router.get('/read', authenticateToken, newsController.getReadArticles);
router.get('/favorites', authenticateToken, newsController.getFavoriteArticles);
router.get('/search/:keyword', authenticateToken, newsController.searchNews);
router.post('/:id/read', authenticateToken, newsController.markAsRead);
router.post('/:id/favorite', authenticateToken, newsController.markAsFavorite);

module.exports = router;
