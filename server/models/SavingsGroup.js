const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savingsGroupSchema = mongoose.Schema({
	userFrom: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	budgetType: { type: String, default: "Monthly" },
	month: { type: Number },
	year: { type: Number },
	name: { type: String, default: "Emergency Fund" },
	budgetedAmount: { type: Number, default: 0 },
	actualAmount: { type: Number, default: 0 },
});

const SavingsGroup = mongoose.model("SavingsGroup", savingsGroupSchema);

module.exports = { SavingsGroup };
