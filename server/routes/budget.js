const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             Budget
//=================================


router.post("/getBudget", auth, (req, res) => {

    // Find the logged in users favorite movies
    User.findById({ _id: req.body.userFrom })
        .exec(( err, budget ) => {
            if(err) return res.status(400).send({ success:false, err })
            res.status(200).json({ success: true, budget })
        })
});

router.post("/addToExpenses", auth, (req, res) => {
    // Save information about the movie or user ID inside Favorite Collection
    const {userId, category, description, price} = req.body;

    // First we find the user by their ID
    User.findById({ _id: userId }, (err, doc) => {
        if(err) return res.json({ success:false, err });

        // This will find the correct expense category and push the data into the expenseEntries array
        doc.templates[0].expenseCategories.find(val => {
            if (val.name === category) {
                val.expenseEntries.push({description: description, amount: price})
            }
        })

        // After pushing to the array, I save everything in the database
        doc.save((err) => {
            if (err) return res.json({ success:false, err });
            return res.status(200).json({ success:true })
        })      
    })
});

router.post("/addCategory", auth, (req, res) => {
    const {userId, categoryType} = req.body;

    // Find the logged in users favorite movies
    User.findById({ _id: userId })
        .exec(( err, doc ) => {
            if(err) return res.status(400).send({ success:false, err })
            // Check which category to add
            if(categoryType === "incomeCategory") {
                doc.templates[0].incomeCategories.push({name: "I'm a Rapper, they call me FLACKO!"});

                // After pushing, save everything in the database
                doc.save((err) => {
                    if (err) return res.json({ success:false, err });
                    return res.status(200).json({ success:true })
                })  

            } else if(categoryType === "expenseCategory") {

                // Check which category to add
                doc.templates[0].expenseCategories.push({name: "Child Support :("});

                // After pushing, save everything in the database
                doc.save((err) => {
                    if (err) return res.json({ success:false, err });
                    return res.status(200).json({ success:true })
                })  

            } else {
                res.status(200).json({ success: false })
            }
            
        })
});

router.post("/deleteCategory", auth, (req, res) => {
    const {userId, type, categoryId} = req.body;

    // Find the logged in users favorite movies
    User.findById({ _id: userId })
        .exec(( err, doc ) => {
            if(err) return res.status(400).send({ success:false, err })
            console.log()

            // Check which category to delete
            if(type === "income") {
                // This will find the correct expense category and push the data into the expenseEntries array
                doc.templates[0].incomeCategories.find(val => {
                    console.log(val)
                    if (val._id === categoryId) {
                        console.log("hi")
                    }
                })

                // After deleting, save everything in the database
                // doc.save((err) => {
                //     if (err) return res.json({ success:false, err });
                //     return res.status(200).json({ success:true })
                // })  

            } else if(categoryType === "expense") {

                // Check which category to delete
                doc.templates[0].expenseCategories.find(val => {
                    if (val._id === categoryId) {
                        
                    }
                })

                // After delete, save everything in the database
                // doc.save((err) => {
                //     if (err) return res.json({ success:false, err });
                //     return res.status(200).json({ success:true })
                // })  

            } else {
                res.status(200).json({ success: false })
            }
            
            
            //res.status(200).json({ success: true, budget })
        })
});


module.exports = router;
