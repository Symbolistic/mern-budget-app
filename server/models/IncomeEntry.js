const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeEntrySchema = mongoose.Schema({
	entryFrom: {
		type: Schema.Types.ObjectId,
		ref: 'IncomeGroup',
		immutable: true,
	},
	description: { type: String, required: true },
	amount: { type: Number, required: true },
	actual: { type: Number, default: 0 },
});

const IncomeEntry = mongoose.model('IncomeEntry', incomeEntrySchema);

module.exports = { IncomeEntry };
