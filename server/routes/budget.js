// const express = require("express");
// const router = express.Router();
// const { User } = require("../models/User");
// const { IncomeGroup } = require("../models/IncomeGroup");
// const { ExpenseGroup } = require("../models/ExpenseGroup");
// const { ExpenseEntry } = require("../models/ExpenseEntry");
// const { auth } = require("../middleware/auth");
// const { json } = require("body-parser");

// //=================================
// //             Budget
// //=================================



// router.post("/addCategory", auth, (req, res) => {
// 	const {
// 		userId,
// 		categoryType,
// 		categoryName,
// 		paySchedule,
// 		netIncome,
// 		extraIncome,
// 		savingsPercent,
// 	} = req.body;

// 	User.findById({ _id: userId }).exec((err, doc) => {
// 		if (err) return res.status(400).send({ success: false, err });
// 		// Check which category to add
// 		if (categoryType === "incomeCategory") {
// 			doc.templates[0].incomeCategories.push({
// 				name: categoryName,
// 				incomeInfo: {
// 					netIncome: netIncome,
// 					paySchedule: paySchedule,
// 					extraIncome: extraIncome,
// 					savingsPercent: savingsPercent,
// 				},
// 			});

// 			// After pushing, save everything in the database
// 			doc.save((err) => {
// 				if (err) return res.json({ success: false, err });
// 				return res.status(200).json({ success: true });
// 			});
// 		} else if (categoryType === "expenseCategory") {
// 			// Check which category to add
// 			doc.templates[0].expenseCategories.push({ name: categoryName });

// 			// After pushing, save everything in the database
// 			doc.save((err) => {
// 				if (err) return res.json({ success: false, err });
// 				return res.status(200).json({ success: true });
// 			});
// 		} else {
// 			res.status(200).json({ success: false });
// 		}
// 	});
// });

// router.post("/deleteCategory", auth, (req, res) => {
// 	const { userId, type, categoryId } = req.body;

// 	User.findById({ _id: userId }).exec((err, doc) => {
// 		if (err) return res.status(400).send({ success: false, err });
// 		console.log();

// 		// Check which category to delete
// 		if (type === "income") {
// 			// Find index to be deleted and save it
// 			const index = doc.templates[0].incomeCategories.findIndex(
// 				(val) => val._id.toString() === categoryId
// 			);

// 			// Delete that index with splice
// 			doc.templates[0].incomeCategories.splice(index, 1);

// 			//After deleting, save everything in the database
// 			doc.save((err) => {
// 				if (err) return res.json({ success: false, err });
// 				return res.status(200).json({ success: true });
// 			});
// 		} else if (type === "expense") {
// 			// This finds the index to delete and saves it/
// 			const index = doc.templates[0].expenseCategories.findIndex(
// 				(val) => val._id.toString() === categoryId
// 			);

// 			if (index === -1) {
// 				res.status(200).json({ success: false });
// 			} else {
// 				// I used splice to remove this index
// 				doc.templates[0].expenseCategories.splice(index, 1);

// 				//After delete, save everything in the database
// 				doc.save((err) => {
// 					if (err) return res.json({ success: false, err });
// 					return res.status(200).json({ success: true });
// 				});
// 			}
// 		} else {
// 			res.status(200).json({ success: false });
// 		}
// 	});
// });

// router.post("/editIncome", auth, (req, res) => {
// 	const { userId, categoryId, categoryName, editValue } = req.body;

// 	User.findById({ _id: userId }).exec((err, doc) => {
// 		if (err) return res.status(400).send({ success: false, err });

// 		// Find index to be edited and save it
// 		const index = doc.templates[0].incomeCategories.findIndex(
// 			(val) => val._id.toString() === categoryId
// 		);

// 		// Edit that index
// 		doc.templates[0].incomeCategories[index].incomeInfo[
// 			categoryName
// 		] = editValue;

// 		//After edit, save everything in the database
// 		doc.save((err) => {
// 			if (err) return res.json({ success: false, err });
// 			return res.status(200).json({ success: true });
// 		});
// 	});
// });

// router.post("/editExpense", auth, (req, res) => {
// 	const {
// 		userId,
// 		categoryId,
// 		expenseId,
// 		editDescription,
// 		editAmount,
// 	} = req.body;

// 	User.findById({ _id: userId }).exec((err, doc) => {
// 		if (err) return res.status(400).send({ success: false, err });

// 		// 1. Find index of the expense Category we want to edit
// 		const categoryIndex = doc.templates[0].expenseCategories.findIndex(
// 			(val) => val._id.toString() === categoryId
// 		);

// 		// 2. Then find the index of the expense ENTRY we want to edit
// 		const expenseEntryIndex = doc.templates[0].expenseCategories[
// 			categoryIndex
// 		].expenseEntries.findIndex((val) => val._id.toString() === expenseId);

// 		// 3. Now edit that badboy
// 		const databaseEntryDescription =
// 			doc.templates[0].expenseCategories[categoryIndex].expenseEntries[
// 				expenseEntryIndex
// 			].description;
// 		const databaseEntryAmount =
// 			doc.templates[0].expenseCategories[categoryIndex].expenseEntries[
// 				expenseEntryIndex
// 			].amount;

// 		if (
// 			editDescription === databaseEntryDescription &&
// 			parseInt(editAmount) === databaseEntryAmount
// 		) {
// 			return res.status(200).json({ success: false });
// 		} else if (editDescription && editAmount) {
// 			// Add both of them to the database
// 			doc.templates[0].expenseCategories[categoryIndex].expenseEntries[
// 				expenseEntryIndex
// 			].description = editDescription;
// 			doc.templates[0].expenseCategories[categoryIndex].expenseEntries[
// 				expenseEntryIndex
// 			].amount = editAmount;
// 		} else if (editDescription || editAmount) {
// 			// Check if editDescription is empty or if editAmount is empty then add the Edit value if its present
// 			if (editDescription) {
// 				doc.templates[0].expenseCategories[categoryIndex].expenseEntries[
// 					expenseEntryIndex
// 				].description = editDescription;
// 			} else if (editAmount) {
// 				doc.templates[0].expenseCategories[categoryIndex].expenseEntries[
// 					expenseEntryIndex
// 				].amount = editAmount;
// 			} else {
// 				return res.status(200).json({ success: false });
// 			}
// 		} else {
// 			return res.status(200).json({ success: false });
// 		}

// 		//4. After edit, save everything in the database
// 		doc.save((err) => {
// 			if (err) return res.json({ success: false, err });
// 			return res.status(200).json({ success: true });
// 		});
// 	});
// });

// router.post("/deleteExpense", auth, (req, res) => {
// 	const { userId, categoryId, expenseId } = req.body;

// 	User.findById({ _id: userId }).exec((err, doc) => {
// 		if (err) return res.status(400).send({ success: false, err });

// 		// 1. Find index of the expense Category we want to delete
// 		const categoryIndex = doc.templates[0].expenseCategories.findIndex(
// 			(val) => val._id.toString() === categoryId
// 		);

// 		// 2. Then find the index of the expense ENTRY we want to delete
// 		const expenseEntryIndex = doc.templates[0].expenseCategories[
// 			categoryIndex
// 		].expenseEntries.findIndex((val) => val._id.toString() === expenseId);

// 		// 3. Use splice to remove it
// 		doc.templates[0].expenseCategories[categoryIndex].expenseEntries.splice(
// 			expenseEntryIndex,
// 			1
// 		);

// 		//4. After edit, save everything in the database
// 		doc.save((err) => {
// 			if (err) return res.json({ success: false, err });
// 			return res.status(200).json({ success: true });
// 		});
// 	});
// });

// module.exports = router;
