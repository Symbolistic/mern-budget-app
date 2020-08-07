const { NODEMAIL_USER } = require("./dev");

module.exports = {
    mongoURI: process.env.MONGO_URI,
    CLIENT_URL: process.env.CLIENT_URL,
    NODEMAIL_USER: process.env.NODEMAIL_USER,
    NODEMAIL_PASS: process.env.NODEMAIL_PASS,
}