const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { IncomeGroup } = require("../models/IncomeGroup");
const { ExpenseGroup } = require("../models/ExpenseGroup");
const { SavingsGroup } = require("../models/SavingsGroup");
const { ExpenseEntry } = require("../models/ExpenseEntry");
const passport = require("passport");


// //=================================
// //             Budget
// //=================================


router.post("/createBudget", passport.authenticate("jwt", {session: false}), async (req, res) => {
	const {
		userFrom,
		budgetType,
		month,
		year,
    } = req.body;
    

	const income = new IncomeGroup({
		userFrom: userFrom,
		budgetType: budgetType,
		month: month,
		year: year,
		name: "Main Job",
    });
    
    const savings = new SavingsGroup({
		userFrom: userFrom,
		budgetType: budgetType,
		month: month,
		year: year,
        name: "Emergency Fund",
        budgetedAmount: 0,
        actualAmount: 0,
    });

    // Save income in the database
	await income.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, doc });
    });

    // Save everything in the database
	await savings.save((err, doc) => {
		if (err) return res.json({ success: false, err });
	});
    
    // List of expense group names
    const names = ["Utilities", "Transportation", "Foods", "Subscriptions", "Lifestyle", "Credit Card Payment", "Miscellaneous"]

    await names.map(name => {
        const expense = new ExpenseGroup({
            userFrom: userFrom,
            budgetType: budgetType,
            month: month,
            year: year,
            name: name,
        });
    
        // Save everything in the database
        expense.save((err, doc) => {
            if (err) return res.json({ success: false, err });
            console.log(doc)
        });
    })
});


module.exports = router;
