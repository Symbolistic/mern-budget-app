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
});

const IncomeGroup = mongoose.model("IncomeGroup", incomeGroupSchema);

module.exports = { IncomeGroup };
