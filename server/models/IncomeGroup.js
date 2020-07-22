const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incomeGroupSchema = mongoose.Schema({
	userFrom: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	budgetType: { type: String, default: "Monthly" },
	month: { type: Number },
	year: { type: Number },
	name: { type: String, default: "Job 1" },
	incomeInfo: {
		paySchedule: { type: String, default: "Bi-Weekly" },
		netIncome: { type: Number, default: 0 },
		extraIncome: { type: Number, default: 0 },
		savingsPercent: { type: Number, default: 0 },
	},
});

const IncomeGroup = mongoose.model("IncomeGroup", incomeGroupSchema);

module.exports = { IncomeGroup };
