const express = require("express");
const router = express.Router();
const { IncomeGroup } = require("../models/IncomeGroup");
const { IncomeEntry } = require("../models/IncomeEntry");
const passport = require("passport");

//=================================
//             Income
//=================================

router.post("/getIncome", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { userFrom, month, year } = req.body;
	
	// Grab logged in users income data
	IncomeGroup.find({ userFrom: userFrom, month: month, year: year }).exec((err, groups) => {
		if (err) return res.status(400).send({ success: false, err });

		const entryFrom = groups.map((currGroup) => currGroup._id);

		IncomeEntry.find({ entryFrom: { $in: entryFrom } }).exec(
			(err, incomeEntries) => {
				if (err) return res.status(400).send({ success: false, err });

				res
					.status(200)
					.json({ success: true, groups: groups, entries: incomeEntries });
			}
		);
	});
});


router.post("/addIncomeGroup", passport.authenticate("jwt", {session: false}), (req, res) => {
	const {
		userFrom,
		budgetType,
		month,
		year,
		groupName,
    } = req.body;
    

	const income = new IncomeGroup({
		userFrom: userFrom,
		budgetType: budgetType,
		month: month,
		year: year,
		name: groupName,
	});

	// Save everything in the database
	income.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});

router.post("/addIncomeEntry", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { entryFrom, description, amount } = req.body;

	const entry = new IncomeEntry({
		entryFrom: entryFrom,
		description: description,
		amount: amount,
	});

	entry.save((err) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

router.post("/editIncomeEntry", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { incomeEntryID, editDescription, editAmount } = req.body;

	let params = {
        description: editDescription,
        amount: editAmount
	};

    /* Find any null/undefined values and delete them so they wont get passed into the database and
    wont replace any values */
    for (let prop in params) if (!params[prop]) delete params[prop];

	IncomeEntry.findByIdAndUpdate({ _id: incomeEntryID }, params, (err, doc) => {
        console.log(doc)
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

router.post("/deleteIncomeGroup", passport.authenticate("jwt", {session: false}), (req, res) => {
	IncomeGroup.findByIdAndDelete({ _id: req.body.groupID}).exec((err,doc) => {
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

router.post("/deleteIncomeEntry", passport.authenticate("jwt", {session: false}), (req, res) => {
	IncomeEntry.findByIdAndDelete({ _id: req.body.incomeEntryID }).exec(
		(err, doc) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({ success: true });
		}
	);
});

module.exports = router;
