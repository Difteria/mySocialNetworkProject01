// Imports


require('dotenv').config()

const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = process.env.SIGN_TOKEN;

// Exports

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET, {
         
        })
    }
}