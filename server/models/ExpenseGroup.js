const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseGroupSchema = mongoose.Schema({
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  budgetType: { type: String, default: "Monthly" },
  month: { type: Number },
  year: { type: Number },
  name: { type: String, required: true },
});

const ExpenseGroup = mongoose.model("ExpenseGroup", expenseGroupSchema);

module.exports = { ExpenseGroup };
