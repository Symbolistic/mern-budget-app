import React, { useState, useEffect, useContext } from 'react';
import './Budget.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext'; // To get the global states (user data)
import IncomeModal from './Modals/IncomeModal';
import ExpenseModal from './Modals/ExpenseModal';
import SavingsModal from './Modals/SavingsModal';
import Income from './BudgetInfo/Income';
import Savings from './BudgetInfo/Savings';
import Expense from './BudgetInfo/Expense';
import Charts from './Charts/Charts';

const Budget = () => {
	// Current Year and Month being displayed. Month is based on 0 index value (So January is 0)
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth());
	const allMonths = [
		'January',
		'Febuary',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	// Budget: Income, and Expense info
	const [budget, setBudget] = useState({
		incomeGroup: [],
		expenseGroup: [],
	});
	const [income, setIncome] = useState([]);
	const [expense, setExpense] = useState([]);
	const [savings, setSavings] = useState([]);

	const [totalIncome, setTotalIncome] = useState('0');
	const [totalBudgetSavings, setTotalBudgetSavings] = useState('0');
	const [totalActualSavings, setTotalActualSavings] = useState('0');

	const [totalBudgetExpense, setTotalBudgetExpense] = useState('0');
	const [totalActualExpense, setTotalActualExpense] = useState('0');

	// Handles editing of data
	const [editEntry, setEditEntry] = useState({});

	// This data is for the modals
	const [incomeModalDisplay, setIncomeModalDisplay] = useState(false);
	const [savingsModalDisplay, setSavingsModalDisplay] = useState(false);
	const [expenseModalDisplay, setExpenseModalDisplay] = useState(false);
	const [currentlyEditing, setCurrentlyEditing] = useState(false);

	// This data is for the pie chart
	const [groupNames, setGroupNames] = useState([]);
	const [groupTotalBudgetExpenses, setGroupTotalBudgetExpenses] = useState([]);
	const [totalActualExpenses, setTotalActualExpenses] = useState([]);

	// This controls the radio button to show budget and spent
	const [selectedOption, setSelectedOption] = useState('Budget');

	// This is to prevent double clicking
	const [disabled, setDisabled] = useState(false);

	// This is to check which user is currently logged in
	const authContext = useContext(AuthContext);

	const variables = {
		userFrom: authContext.user.userFrom,
		budgetType: 'Monthly',
		month: month,
		year: year,
	};

	useEffect(() => {
		fetchBudget();
	}, [month]);

	const calculateIncome = (income) => {
		if (income) {
			const totalIncome = income.reduce((acc, currVal) => {
				// Get the total sum of this categories expense entries
				const entriesTotal = currVal.incomeEntries.reduce(
					(accEntries, currEntry) => {
						return accEntries + currEntry.amount;
					},
					0
				);
				return acc + entriesTotal;
			}, 0);
			setTotalIncome(
				totalIncome.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
			);
		}
	};

	const calculateBudgetSavings = (savings) => {
		if (savings) {
			const totalBudgetSavings = savings.reduce((acc, currVal) => {
				return acc + currVal.budgetedAmount;
			}, 0);
			setTotalBudgetSavings(
				totalBudgetSavings.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
			);

			return totalBudgetSavings;
		}
	};

	const calculateActualSavings = (savings) => {
		if (savings) {
			const totalActualSavings = savings.reduce((acc, currVal) => {
				return acc + currVal.actualAmount;
			}, 0);
			setTotalActualSavings(
				totalActualSavings.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
			);

			return totalActualSavings;
		}
	};

	const calculateBudgetExpense = (expense) => {
		if (expense) {
			const totalBudgetExpense = expense.reduce((acc, currVal) => {
				// Get the total sum of this categories expense entries
				const entriesTotal = currVal.expenseEntries.reduce(
					(accEntries, currEntry) => {
						return accEntries + currEntry.budgetedAmount;
					},
					0
				);
				return acc + entriesTotal;
			}, 0);
			setTotalBudgetExpense(
				totalBudgetExpense.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
			);
		}
	};

	const calculateActualExpense = (expense) => {
		if (expense) {
			const totalActualExpense = expense.reduce((acc, currVal) => {
				// Get the total sum of this categories expense entries
				const entriesTotal = currVal.expenseEntries.reduce(
					(accEntries, currEntry) => {
						return accEntries + currEntry.actualAmount;
					},
					0
				);
				return acc + entriesTotal;
			}, 0);
			setTotalActualExpense(
				totalActualExpense.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
			);
		}
	};

	const combineExpenseGroupsAndEntries = (groups, entries) => {
		const expenseGroups = groups.map((val) => {
			val.expenseEntries = [];
			return val;
		});

		entries.map((entry) => {
			const index = expenseGroups.findIndex(
				(group) => group._id === entry.entryFrom
			);
			return expenseGroups[index].expenseEntries.push(entry);
		});

		setExpense(expenseGroups);
		calculateBudgetExpense(expenseGroups);
		calculateActualExpense(expenseGroups);
		return expenseGroups;
	};

	const combineIncomeGroupsAndEntries = (groups, entries) => {
		const incomeGroups = groups.map((val) => {
			val.incomeEntries = [];
			return val;
		});

		entries.map((entry) => {
			const index = incomeGroups.findIndex(
				(group) => group._id === entry.entryFrom
			);
			return incomeGroups[index].incomeEntries.push(entry);
		});

		setIncome(incomeGroups);
		calculateIncome(incomeGroups);
	};

	const grabChartData = (
		expenseGroups,
		totalBudgetSavings,
		totalActualSavings
	) => {
		// Grab all the data for names of categories and put it into an array
		const groupNames = expenseGroups.map((group) => group.name);
		// Same, but we grab the total expenses (add them all up for each group) and put em into an array
		const groupTotalBudgetExpenses = expenseGroups.map((group) => {
			return group.expenseEntries.reduce((accEntries, currEntry) => {
				return accEntries + currEntry.budgetedAmount;
			}, 0);
		});

		const totalActualExpenses = expenseGroups.map((group) => {
			return group.expenseEntries.reduce((accEntries, currEntry) => {
				return accEntries + currEntry.actualAmount;
			}, 0);
		});

		// After collecting the data and calculating it up, pass it to state
		setGroupNames(['Savings', ...groupNames]);
		setGroupTotalBudgetExpenses([
			totalBudgetSavings,
			...groupTotalBudgetExpenses,
		]);
		setTotalActualExpenses([totalActualSavings, ...totalActualExpenses]);
	};

	const fetchBudget = async () => {
		try {
			const incomeResponse = await axios.post(
				'/api/income/getIncome',
				variables
			);
			const savingsResponse = await axios.post(
				'/api/savings/getSavings',
				variables
			);
			const expenseResponse = await axios.post(
				'/api/expense/getExpense',
				variables
			);

			// Income
			combineIncomeGroupsAndEntries(
				incomeResponse.data.groups,
				incomeResponse.data.entries
			);

			// Savings
			const totalBudgetSavings = calculateBudgetSavings(
				savingsResponse.data.groups
			);
			const totalActualSavings = calculateActualSavings(
				savingsResponse.data.groups
			);

			setSavings(savingsResponse.data.groups);

			// Expense
			const expenseGroups = combineExpenseGroupsAndEntries(
				expenseResponse.data.groups,
				expenseResponse.data.entries
			);

			grabChartData(expenseGroups, totalBudgetSavings, totalActualSavings);
		} catch (error) {
			console.log('Error: ', error);
		}
	};

	const createBudget = () => {
		if (income.length < 1 && expense.length < 1 && savings.length < 1) {
			setDisabled(true);

			axios.post('/api/budget/createBudget', variables).then((response) => {
				if (response.data.success) {
					fetchBudget();
					setDisabled(false);
				} else {
					console.log('Failed to create budget');
				}
			});
		}
	};

	// Conditional Render is here
	if (income.length < 1 && expense.length < 1 && savings.length < 1) {
		return (
			<div className='dashboard-container'>
				<div id='calendar'>
					<div id='month-year'>
						<h2>{allMonths[month]} 2021</h2>
					</div>

					<div id='months'>
						{allMonths.map((month, index) => (
							<button
								key={index}
								className='month-btn'
								name={month}
								onClick={() => setMonth(index)}
							>
								{month}
							</button>
						))}
					</div>
				</div>

				<div id='create-budget-container'>
					<h2>You haven't created a budget for this month!</h2>
					<p>Lets make one!</p>
					<button
						className='basic-budget-btn'
						onClick={createBudget}
						disabled={disabled}
					>
						Generate Budget Template
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className='dashboard-container'>
				<div id='calendar'>
					<div id='month-year'>
						<h2>{allMonths[month]} 2021</h2>
					</div>

					<div id='months'>
						{allMonths.map((month, index) => (
							<button
								key={index}
								className='month-btn'
								name={month}
								onClick={() => setMonth(index)}
							>
								{month}
							</button>
						))}
					</div>
				</div>

				<Charts
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
					totalBudgetExpense={totalBudgetExpense}
					totalActualExpense={totalActualExpense}
					totalIncome={totalIncome}
					totalBudgetSavings={totalBudgetSavings}
					groupNames={groupNames}
					groupTotalBudgetExpenses={groupTotalBudgetExpenses}
					totalActualExpenses={totalActualExpenses}
				/>

				<Income
					selectedOption={selectedOption}
					setIncomeModalDisplay={setIncomeModalDisplay}
					fetchBudget={fetchBudget}
					income={income}
					totalIncome={totalIncome}
					calculateIncome={calculateIncome}
					calculateBudgetExpense={calculateBudgetExpense}
					setBudget={setBudget}
					variables={variables}
					editEntry={editEntry}
					setEditEntry={setEditEntry}
					currentlyEditing={currentlyEditing}
					setCurrentlyEditing={setCurrentlyEditing}
					grabChartData={grabChartData}
				/>

				<Savings
					selectedOption={selectedOption}
					setSavingsModalDisplay={setSavingsModalDisplay}
					fetchBudget={fetchBudget}
					savings={savings}
					totalBudgetSavings={totalBudgetSavings}
					totalActualSavings={totalActualSavings}
					calculateIncome={calculateIncome}
					setBudget={setBudget}
					variables={variables}
					editEntry={editEntry}
					setEditEntry={setEditEntry}
					currentlyEditing={currentlyEditing}
					setCurrentlyEditing={setCurrentlyEditing}
					grabChartData={grabChartData}
				/>

				<Expense
					selectedOption={selectedOption}
					setExpenseModalDisplay={setExpenseModalDisplay}
					budget={budget}
					fetchBudget={fetchBudget}
					expense={expense}
					totalBudgetExpense={totalBudgetExpense}
					totalActualExpense={totalActualExpense}
					calculateIncome={calculateIncome}
					setBudget={setBudget}
					variables={variables}
					editEntry={editEntry}
					setEditEntry={setEditEntry}
					currentlyEditing={currentlyEditing}
					setCurrentlyEditing={setCurrentlyEditing}
					grabChartData={grabChartData}
				/>

				<IncomeModal
					incomeModalDisplay={incomeModalDisplay}
					variables={variables}
					setIncomeModalDisplay={setIncomeModalDisplay}
					fetchBudget={fetchBudget}
					setBudget={setBudget}
					calculateIncome={calculateIncome}
					grabChartData={grabChartData}
				/>

				<SavingsModal
					savingsModalDisplay={savingsModalDisplay}
					variables={variables}
					setSavingsModalDisplay={setSavingsModalDisplay}
					fetchBudget={fetchBudget}
					setBudget={setBudget}
					calculateIncome={calculateIncome}
					grabChartData={grabChartData}
				/>

				<ExpenseModal
					expenseModalDisplay={expenseModalDisplay}
					variables={variables}
					setExpenseModalDisplay={setExpenseModalDisplay}
					setBudget={setBudget}
					fetchBudget={fetchBudget}
					calculateIncome={calculateIncome}
					grabChartData={grabChartData}
				/>
			</div>
		);
	}
};

export default Budget;
