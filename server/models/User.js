const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String, 
    },
    email: {
        type: String, 
        trim: true, 
        unique: true,
        required: true
    },
    password: {
        type: String, 
        minlength: 6
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user"
    },
    resetLink: {
        data: String,
        default: ''
    },
}, {timestamps: true});

userSchema.pre("save", function(next) {
    if (!this.isModified("password"))
        return next();

    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if(err)
            return next(err);
        
        this.password = passwordHash;
        next();
    });
});

userSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err)
            return cb(err);
        else {
            if (!isMatch) 
                return cb(null, isMatch);
            return cb(null, this);
        }
    });
};


const User = mongoose.model("User", userSchema);

module.exports = { User };