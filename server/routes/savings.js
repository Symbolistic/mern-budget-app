const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { SavingsGroup } = require("../models/SavingsGroup");
const { auth } = require("../middleware/auth");
const { json } = require("body-parser");

//=================================
//             Income
//=================================


// router.post("/getIncome", auth, (req, res) => {
//     const { userFrom, month, year } = req.body;

// 	// Grab logged in users income data
// 	IncomeGroup.find({ userFrom: userFrom, month: month, year: year }).exec((err, income) => {
// 		if (err) return res.status(400).send({ success: false, err });
// 		res.status(200).json({ success: true, income });
// 	});
// });

router.post("/getSavings", auth, (req, res) => {
    const { userFrom, month, year } = req.body;

	// Grab logged in users income data
	SavingsGroup.find({ userFrom: userFrom, month: month, year: year }).exec((err, groups) => {
        if (err) return res.status(400).send({ success: false, err });
        res.json({ success: true, groups: groups, entries: groups });
	});
});


router.post("/addSavingsGroup", auth, (req, res) => {
	const {
		userFrom,
		budgetType,
		month,
		year,
        savingsName,
        budgetedAmount,
        actualAmount,
    } = req.body;
    
    console.log(req.body)

	const savings = new SavingsGroup({
		userFrom: userFrom,
		budgetType: budgetType,
		month: month,
		year: year,
        name: savingsName,
        budgetedAmount: budgetedAmount,
        actualAmount: actualAmount,
	});

	// Save everything in the database
	savings.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});


router.post("/editSavings", auth, (req, res) => {
	const { groupID, budgetedAmount, actualAmount } = req.body;

	let params = {
        budgetedAmount: budgetedAmount,
        actualAmount: actualAmount
    };
    

    console.log(req.body)

    /* Find any null/undefined values and delete them so they wont get passed into the database and
    wont replace any values */
    for (let prop in params) if (!params[prop]) delete params[prop];

	SavingsGroup.findByIdAndUpdate({ _id: groupID }, params, (err, doc) => {
        console.log(doc)
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

router.post("/deleteSavingsGroup", auth, (req, res) => {
	SavingsGroup.findByIdAndDelete({ _id: req.body.groupID}).exec((err,doc) => {
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

module.exports = router;
