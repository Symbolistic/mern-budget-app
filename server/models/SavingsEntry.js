const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savingsEntrySchema = mongoose.Schema({
	entryFrom: {
		type: Schema.Types.ObjectId,
		ref: "SavingsGroup",
		immutable: true
	},
	description: { type: String, required: true },
	amount: { type: Number, required: true },
});

const SavingsEntry = mongoose.model("SavingsEntry", savingsEntrySchema);

module.exports = { SavingsEntry };
