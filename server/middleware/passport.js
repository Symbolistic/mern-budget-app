const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const {User} = require("../models/User");

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["access_token"]; 
    }

    return token;
}

// Authorization: This basically protects private areas that logged out users shouldn't see (Admin panel/App Area)
passport.use(new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "Symbol"
}, (payload, done) => {
    User.findById({_id: payload.sub}, (err, user) => {
        if(err)
            return done(err, false);

        if(user)
            return done(null, user);

        else
            return done(null, false);
    });
}));


// Authenicated Local Strategy using username and password (Basically used when we login)
passport.use(new LocalStrategy((email, password, done) => {

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        // Something went wrong with database
        if(err)
            return done(err);

        // If no user exists
        if(!user)
            return done(null, false);

        // Check if password is correct
        user.comparePassword(password, done);
    });
}));