const { NODEMAIL_USER } = require("./dev");

module.exports = {
    mongoURI: process.env.MONGO_URI,
    JWT_ACC_ACTIVATE: process.env.JWT_ACC_ACTIVATE,
    CLIENT_URL: process.env.CLIENT_URL,
    RESET_PASSWORD_KEY: process.env.RESET_PASSWORD_KEY,
    NODEMAIL_USER: process.env.NODEMAIL_USER,
    NODEMAIL_PASS: process.env.NODEMAIL_PASS,
}