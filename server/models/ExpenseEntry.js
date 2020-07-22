const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseEntrySchema = mongoose.Schema({
	entryFrom: {
		type: Schema.Types.ObjectId,
		ref: "ExpenseGroup",
		immutable: true
	},
	description: { type: String, required: true },
	amount: { type: Number, required: true },
});

const ExpenseEntry = mongoose.model("ExpenseEntry", expenseEntrySchema);

module.exports = { ExpenseEntry };
