const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateSignup(req, res, next) {
    const { name, email, password, preferences } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!email) {
        errors.push('Email is required');
    } else if (!EMAIL_REGEX.test(email)) {
        errors.push('Invalid email format');
    }

    if (!password) {
        errors.push('Password is required');
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    if (preferences !== undefined) {
        if (!Array.isArray(preferences)) {
            errors.push('Preferences must be an array');
        } else if (!preferences.every(p => typeof p === 'string')) {
            errors.push('Each preference must be a string');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(', ') });
    }

    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    } else if (!EMAIL_REGEX.test(email)) {
        errors.push('Invalid email format');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(', ') });
    }

    next();
}

function validatePreferences(req, res, next) {
    const { preferences } = req.body;
    const errors = [];

    if (!preferences) {
        errors.push('Preferences are required');
    } else if (!Array.isArray(preferences)) {
        errors.push('Preferences must be an array');
    } else if (!preferences.every(p => typeof p === 'string')) {
        errors.push('Each preference must be a string');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(', ') });
    }

    next();
}

module.exports = { validateSignup, validateLogin, validatePreferences };
