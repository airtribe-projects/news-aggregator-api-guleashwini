const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'news-aggregator-secret-key';
const SALT_ROUNDS = 10;

// In-memory user store (replace with a DB in a real application)
const users = [];

async function createUser({ name, email, password, preferences }) {
    if (users.find(u => u.email === email)) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        preferences: Array.isArray(preferences) ? preferences : [],
        readArticles: [],
        favoriteArticles: []
    };

    users.push(user);
    return user;
}

async function verifyCredentials(email, password) {
    const user = users.find(u => u.email === email);
    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    return user;
}

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function getUserById(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
}

function updatePreferences(id, preferences) {
    const user = getUserById(id);
    user.preferences = preferences;
    return user;
}

function markArticleAsRead(userId, article) {
    const user = getUserById(userId);
    if (!user.readArticles.some(a => a.id === article.id)) {
        user.readArticles.push(article);
    }
    return article;
}

function markArticleAsFavorite(userId, article) {
    const user = getUserById(userId);
    if (!user.favoriteArticles.some(a => a.id === article.id)) {
        user.favoriteArticles.push(article);
    }
    return article;
}

function getReadArticles(userId) {
    return getUserById(userId).readArticles;
}

function getFavoriteArticles(userId) {
    return getUserById(userId).favoriteArticles;
}

function getAllUsers() {
    return users;
}

module.exports = {
    createUser, verifyCredentials, generateToken, getUserById, updatePreferences,
    markArticleAsRead, markArticleAsFavorite, getReadArticles, getFavoriteArticles, getAllUsers
};
