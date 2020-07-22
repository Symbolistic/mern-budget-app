const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { IncomeGroup } = require("../models/IncomeGroup");
const { ExpenseGroup } = require("../models/ExpenseGroup");
const { ExpenseEntry } = require("../models/ExpenseEntry");
const { auth } = require("../middleware/auth");
const { json } = require("body-parser");

//=================================
//             Income
//=================================


router.post("/getIncome", auth, (req, res) => {
    const { userFrom, month, year } = req.body;

	// Grab logged in users income data
	IncomeGroup.find({ userFrom: userFrom, month: month, year: year }).exec((err, income) => {
		if (err) return res.status(400).send({ success: false, err });
		res.status(200).json({ success: true, income });
	});
});


router.post("/addIncomeGroup", auth, (req, res) => {
	const {
		userFrom,
		budgetType,
		month,
		year,
		groupName,
		paySchedule,
		netIncome,
		extraIncome,
		savingsPercent,
    } = req.body;
    

	const income = new IncomeGroup({
		userFrom: userFrom,
		budgetType: budgetType,
		month: month,
		year: year,
		name: groupName,
		incomeInfo: {
			paySchedule: paySchedule,
			netIncome: netIncome,
			extraIncome: extraIncome,
			savingsPercent: savingsPercent,
		},
	});

	// Save everything in the database
	income.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});

router.post("/editIncomeGroup", auth, (req, res) => {
	const { groupID, editValue, name } = req.body;

	IncomeGroup.findById({ _id: groupID }, (err, doc) => {
        if (err) return res.json({ success: false, err });

        // Edit that index
		doc.incomeInfo[name] = editValue;
        
        //After edit, save everything in the database
		doc.save((err) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({ success: true });
		});
    });
});

router.post("/deleteIncomeGroup", auth, (req, res) => {
	IncomeGroup.findByIdAndDelete({ _id: req.body.groupID}).exec((err,doc) => {
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

module.exports = router;
