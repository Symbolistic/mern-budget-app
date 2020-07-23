const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { IncomeGroup } = require("../models/IncomeGroup");
const { IncomeEntry } = require("../models/IncomeEntry");
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

router.post("/getIncome", auth, (req, res) => {
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


router.post("/addIncomeGroup", auth, (req, res) => {
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

router.post("/addIncomeEntry", auth, (req, res) => {
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

// router.post("/editIncomeGroup", auth, (req, res) => {
// 	const { groupID, editValue, name } = req.body;

// 	IncomeGroup.findById({ _id: groupID }, (err, doc) => {
//         if (err) return res.json({ success: false, err });

//         // Edit that index
// 		doc.incomeInfo[name] = editValue;
        
//         //After edit, save everything in the database
// 		doc.save((err) => {
// 			if (err) return res.json({ success: false, err });
// 			return res.status(200).json({ success: true });
// 		});
//     });
// });

router.post("/editIncomeEntry", auth, (req, res) => {
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

router.post("/deleteIncomeGroup", auth, (req, res) => {
	IncomeGroup.findByIdAndDelete({ _id: req.body.groupID}).exec((err,doc) => {
        if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
    });
});

router.post("/deleteIncomeEntry", auth, (req, res) => {
	IncomeEntry.findByIdAndDelete({ _id: req.body.incomeEntryID }).exec(
		(err, doc) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({ success: true });
		}
	);
});

module.exports = router;
