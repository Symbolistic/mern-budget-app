if (process.env.NODE_ENV === "production") {
    module.exports = require("./prod");
} else {
    console.log("YURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    module.exports = require("./dev");
}