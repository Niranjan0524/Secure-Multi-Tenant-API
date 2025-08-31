const User = require('../models/User');

const generateApiKey = () => {
    return require('crypto').randomBytes(32).toString('hex');
};


//to test the api key is valid format or not..
const validateApiKeyFormat = (apiKey) => {
    const regex = /^[a-f0-9]{32}$/; 
    return regex.test(apiKey);
}

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const hashPassword = async (password) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (password, hashedPassword) => {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hashedPassword);
};

//we need to check if the user is first user for particular organization so that he can be admin
const checkIfFirstUser = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments({ organizationId: req.body.organizationId });
        if (userCount === 0) {
            req.body.role = 'admin';
            next();
        } else {
            return res.status(403).json({ message: 'First user already exists, you dont have access for this event' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error checking user count', error: error.message });
    }
}

module.exports = {
    generateApiKey,
    validateEmail,
    validateApiKeyFormat,
    hashPassword,
    comparePasswords,
    checkIfFirstUser
};