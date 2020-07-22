const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { IncomeGroup } = require("../models/IncomeGroup");
const { ExpenseGroup } = require("../models/ExpenseGroup");
const { ExpenseEntry } = require("../models/ExpenseEntry");
const { auth } = require("../middleware/auth");
const { json } = require("body-parser");

//=================================
//             Expense
//=================================

router.post("/getExpense", auth, (req, res) => {
    const { userFrom, month, year } = req.body;

	// Grab logged in users expense data
	ExpenseGroup.find({ userFrom: userFrom, month: month, year: year }).exec((err, groups) => {
		if (err) return res.status(400).send({ success: false, err });

		const entryFrom = groups.map((currGroup) => currGroup._id);

		ExpenseEntry.find({ entryFrom: { $in: entryFrom } }).exec(
			(err, expenseEntries) => {
				if (err) return res.status(400).send({ success: false, err });

				res
					.status(200)
					.json({ success: true, groups: groups, entries: expenseEntries });
			}
		);
	});
});

router.post("/getExpenseEntries", auth, (req, res) => {
	// Grab logged in users expense ENTRIES data for each group/category of expenses
	ExpenseEntry.find({ entryFrom: { $in: req.body.entryFrom } }).exec(
		(err, expense) => {
			console.log(expense);
			if (err) return res.status(400).send({ success: false, err });
			res.status(200).json({ success: true, expense });
		}
	);
});

router.post("/addExpenseGroup", auth, (req, res) => {
	const { userFrom, budgetType, month, year, groupName } = req.body;

	const expense = new ExpenseGroup({
		userFrom: userFrom,
		budgetType: budgetType,
		month: month,
		year: year,
		name: groupName,
	});

	// Save everything in the database
	expense.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});

router.post("/addExpenseEntry", auth, (req, res) => {
	const { entryFrom, description, amount } = req.body;

	const entry = new ExpenseEntry({
		entryFrom: entryFrom,
		description: description,
		amount: amount,
	});

	entry.save((err) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

router.post("/deleteExpenseGroup", auth, (req, res) => {
	ExpenseGroup.findByIdAndDelete({ _id: req.body.groupID }).exec((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

router.post("/deleteExpenseEntry", auth, (req, res) => {
	ExpenseEntry.findByIdAndDelete({ _id: req.body.expenseEntryID }).exec(
		(err, doc) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({ success: true });
		}
	);
});

router.post("/editExpenseEntry", auth, (req, res) => {
	const { expenseEntryID, editDescription, editAmount } = req.body;

	let params = {
        description: editDescription,
        amount: editAmount
	};

    /* Find any null/undefined values and delete them so they wont get passed into the database and
    wont replace any values */
    for (let prop in params) if (!params[prop]) delete params[prop];
    console.log(params)

	ExpenseEntry.findByIdAndUpdate({ _id: expenseEntryID }, params, (err, doc) => {
        console.log(doc)
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

module.exports = router;
