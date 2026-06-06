const usersService = require('../services/usersService');

async function signup(req, res) {
    const { name, email, password, preferences } = req.body;

    try {
        await usersService.createUser({ name, email, password, preferences });
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await usersService.verifyCredentials(email, password);
        const token = usersService.generateToken(user);
        res.status(200).json({ token });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

function getPreferences(req, res) {
    try {
        const user = usersService.getUserById(req.user.id);
        res.status(200).json({ preferences: user.preferences });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

function updatePreferences(req, res) {
    const { preferences } = req.body;

    try {
        const user = usersService.updatePreferences(req.user.id, preferences);
        res.status(200).json({ message: 'Preferences updated successfully', preferences: user.preferences });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

module.exports = { signup, login, getPreferences, updatePreferences };
