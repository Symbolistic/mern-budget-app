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
    User.findOne({ email }, (err, document) => {
        if (err){
            return res.status(500).json({ message: {msgBody: "Error has occured", msgError: true} });
        }
            

        if (document)
            return res.status(400).json({ message: {msgBody: "Email is already in use", msgError: true} });

        else {
            const newUser = new User({name, email, password, role: "user"});
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
