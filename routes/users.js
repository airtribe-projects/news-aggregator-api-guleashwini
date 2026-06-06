const { Router } = require('express');
const usersController = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/auth');
const { validateSignup, validateLogin, validatePreferences } = require('../middleware/validate');

const router = Router();

// Auth
router.post('/signup', validateSignup, usersController.signup);
router.post('/login', validateLogin, usersController.login);

// Preferences (protected)
router.get('/preferences', authenticateToken, usersController.getPreferences);
router.put('/preferences', authenticateToken, validatePreferences, usersController.updatePreferences);

module.exports = router;
