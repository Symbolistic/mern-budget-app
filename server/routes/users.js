const express = require('express');
const router = express.Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
const { User } = require("../models/User");
const passportConfig = require("../middleware/passport"); // This is needed for the middleware

//=================================
//             User
//=================================


const signToken = userID => {
    return JWT.sign({
        iss: "Symbol",
        sub: userID,
    }, "Symbol", {expiresIn: "1h"});
}

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email.toLowerCase() }, (err, document) => {
        if (err){
            return res.status(500).json({ message: {msgBody: "Error has occured", msgError: true} });
        }
        
        // Error code if email exists
        if (document)
            return res.status(400).json({ message: {msgBody: "Email is already in use", msgError: true} });

        // Error code if name field is empty/falsy
        if (!name)
            return res.status(400).json({ message: {msgBody: "Please enter your name", msgError: true} });

        // Error code is password is less than 6 characters
        if (password.length < 6) 
            return res.status(400).json({ message: {msgBody: "Password must be at least 6 characters", msgError: true} });
        

        else {
            const newUser = new User({name, email: email.toLowerCase(), password, role: "user"});
            newUser.save(err => {
                if(err)
                    return res.status(500).json({ message: {msgBody: "Error has occured", msgError: true} });

                else 
                    return res.status(201).json({ message: {msgBody: "Account successfully created", msgError: false} });
            });
        }
    });
});


router.post("/login", passport.authenticate("local", {session: false}), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, name, email, role } = req.user;
        const token = signToken(_id);
        res.cookie("access_token", token, {httpOnly: true, sameSite: true});
        res.status(200).json({ isAuthenticated: true, user: { userFrom: _id, name, email, role} });
    }
});


router.get("/logout", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.clearCookie("access_token");
    res.json({user: {name: "", email: "", role: ""}, success: true});
});

router.get("/admin", passport.authenticate("jwt", {session: false}), (req, res) => {
    if(req.user.role === "admin")
        res.status(200).json({ message: {msgBody: "You are an admin", msgError: false} });

    else {
        res.status(403).json({ message: {msgBody: "You are not an admin, go away", msgError: true} });
    }
});

router.get("/authenticated", passport.authenticate("jwt", {session: false}), (req, res) => {
    const { _id, name, email, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { userFrom: _id, name, email, role} });
});


module.exports = router;
