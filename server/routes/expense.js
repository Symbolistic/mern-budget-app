const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { ExpenseGroup } = require("../models/ExpenseGroup");
const { ExpenseEntry } = require("../models/ExpenseEntry");
const passport = require("passport");

//=================================
//             Expense
//=================================

router.post("/getExpense", passport.authenticate("jwt", {session: false}), (req, res) => {
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

router.post("/addExpenseGroup", passport.authenticate("jwt", {session: false}), (req, res) => {
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

router.post("/addExpenseEntry", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { entryFrom, description, budgetedAmount } = req.body;

	const entry = new ExpenseEntry({
		entryFrom: entryFrom,
		description: description,
		budgetedAmount: budgetedAmount,
		actualAmount: 0
	});

	entry.save((err) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

router.post("/deleteExpenseGroup", passport.authenticate("jwt", {session: false}), (req, res) => {
	ExpenseGroup.findByIdAndDelete({ _id: req.body.groupID }).exec((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

router.post("/deleteExpenseEntry", passport.authenticate("jwt", {session: false}), (req, res) => {
	ExpenseEntry.findByIdAndDelete({ _id: req.body.expenseEntryID }).exec(
		(err, doc) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({ success: true });
		}
	);
});

router.post("/editExpenseEntry", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { expenseEntryID, editDescription, editBudgetedAmount, editActualAmount } = req.body;

	let params = {
        description: editDescription,
		budgetedAmount: editBudgetedAmount,
		actualAmount: editActualAmount
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
