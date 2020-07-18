const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

// Checks if user is logged in by comparing the token
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role
    })
})

router.post("/register", (req, res) => {
    const { email, username, password } = req.body

    const user = new User({
        email: email || "Default Email",
        username: username || "Default Username",
        password: password || "Default Password",
        templates: [{

            name: "Basic Template",
            incomeCategories: [{
            
                name: "Job 1",
                incomeInfo: {
                    netIncome: 1000,
                    paySchedule: "Bi-Weekly",
                } 
            }],
            expenseCategories: [{
                name: "Subscriptions",
                expenseEntries:[{
                    description: "Netflix",
                    amount: 14.99,
                },
                {
                    description: "Spotify",
                    amount: 15.99,
                },
                {
                    description: "Amazon Prime",
                    amount: 9.99,
                }
            ]
            },

            {
                name: "Utilities",
                expenseEntries:[{
                    description: "Rent",
                    amount: 1000,
                },
            ]
            }
        ]
        }]
    });

    user.save((err, doc) => {
        if (err) res.json ({ success: false, err })
        res.status(200).json({
            success:true,
            userData: doc   
        });
    });  
})

router.post("/login", (req, res) => {
    // Find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        // If there is no existing email
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

        // Compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            // If password doesn't match/is incorrect
            if (!isMatch) {
                return res.json ({
                    loginSuccess: false,
                    message: "wrong password"
                });
            }

            // Generate Token
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                console.log(`${user.username} has logged in`)
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                })
            })   
        })  
    })  
})

// Handle logout by removing the token
router.get("/logout", auth, (req, res) => {
    User.findByIdAndUpdate({ _id: req.user._id }, { token: "" }, (err, data) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success:true
        })
    });
})

module.exports = router;
