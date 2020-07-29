import React, { useState, useEffect, useContext } from "react";
import "./Budget.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext"; // To get the global states (user data)
import IncomeModal from "./Modals/IncomeModal";
import ExpenseModal from "./Modals/ExpenseModal";
import SavingsModal from "./Modals/SavingsModal";
import Income from "./BudgetInfo/Income";
import Savings from "./BudgetInfo/Savings";
import Expense from "./BudgetInfo/Expense";
import Charts from "./Charts/Charts";

const Budget = () => {
    // Current Year and Month being displayed. Month is based on 0 index value (So January is 0)
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const allMonths = ["January", "Febuary", "March", "April", "May", "June", "July",
                        "August", "September", "October", "November", "December"];

    // Budget: Income, and Expense info
    const [budget, setBudget] = useState({
        incomeGroup: [],
        expenseGroup: []
    });
    const [income, setIncome] = useState([]);
    const [expense, setExpense] = useState([]);
    const [savings, setSavings] = useState([]);

    const [totalIncome, setTotalIncome] = useState('0');
    const [totalSavings, setTotalSavings] = useState('0')
    const [totalExpense, setTotalExpense] = useState('0');

    // Handles editing of data
	const [editEntry, setEditEntry] = useState({});

    // This data is for the modals
    const [incomeModalDisplay, setIncomeModalDisplay] = useState(false);
    const [savingsModalDisplay, setSavingsModalDisplay] = useState(false);
	const [expenseModalDisplay, setExpenseModalDisplay] = useState(false);
    const [currentlyEditing, setCurrentlyEditing] = useState(false);
    
    // This data is for the pie chart
    const [categoryNames, setCategoryNames] = useState([]);
    const [categoryTotalExpenses, setCategoryTotalExpenses] = useState([]);


    // This is to check which user is currently logged in
    const authContext = useContext(AuthContext);

	const variables = { 
        userFrom: authContext.user.userFrom,
        month: month,
        year: year
    };


	useEffect(() => {
		fetchBudget();
	}, [month]);

	const calculateIncome = (income) => {

        if (income) {
            const totalIncome = income.reduce((acc, currVal) => {

                // Get the total sum of this categories expense entries
                const entriesTotal = currVal.incomeEntries.reduce((accEntries, currEntry) => {
                    return accEntries + currEntry.amount;
                }, 0)     
                return acc + entriesTotal;
            }, 0);
            setTotalIncome(totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
    };

    const calculateSavings = (savings) => {
        if (savings) {
            const totalSavings = savings.reduce((acc, currVal) => {
                return acc + currVal.budgetedAmount;
            }, 0);
            setTotalSavings(totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        };
    };
    
    const calculateExpense = (expense) => {

        if (expense) {
            const totalExpense = expense.reduce((acc, currVal) => {

                // Get the total sum of this categories expense entries
                const entriesTotal = currVal.expenseEntries.reduce((accEntries, currEntry) => {
                    return accEntries + currEntry.budgetedAmount;
                }, 0)     
                return acc + entriesTotal;
            }, 0);
            setTotalExpense(totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
    };

    const combineExpenseGroupsAndEntries = (groups, entries) => {
        const expenseGroups = groups.map(val => {
            val.expenseEntries = [];
            return val;
        });

        entries.map(entry => {
            const index = expenseGroups.findIndex(group => group._id === entry.entryFrom);
            return expenseGroups[index].expenseEntries.push(entry);
        })

        setExpense(expenseGroups);
        calculateExpense(expenseGroups);
        grabChartData(expenseGroups);
    }

    const combineIncomeGroupsAndEntries = (groups, entries) => {
        const incomeGroups = groups.map(val => {
            val.incomeEntries = [];
            return val;
        });

        entries.map(entry => {
            const index = incomeGroups.findIndex(group => group._id === entry.entryFrom);
            return incomeGroups[index].incomeEntries.push(entry);
        })

        setIncome(incomeGroups);
        calculateIncome(incomeGroups);
    }
    
    const grabChartData = (expenseGroups) => {
        // Grab all the data for names of categories and put it into an array
        const categoryNames = expenseGroups.map(category => category.name);
        // Same, but we grab the total expenses (add them all up for each category) and put em into an array
        const categoryTotalExpenses = expenseGroups.map(group => {
             return group.expenseEntries.reduce((accEntries, currEntry) => {
                return accEntries + currEntry.budgetedAmount;
            }, 0);
        });

        // After collecting the data and calculating it up, pass it to state
        setCategoryNames(categoryNames);
        setCategoryTotalExpenses(categoryTotalExpenses);
    }

	const fetchBudget = () => {
        // Fetch INCOME
		axios.post("/api/income/getIncome", variables).then((response) => {
			if (response.data.success) {
                combineIncomeGroupsAndEntries(response.data.groups, response.data.entries)

			} else {
				console.log("Failed to get budget");
			}
        });

        // Fetch SAVINGS
        axios.post("/api/savings/getSavings", variables).then((response) => {
			if (response.data.success) {
                calculateSavings(response.data.groups);
                setSavings(response.data.groups);
			} else {
				console.log("Failed to get budget");
			}
        });
        
        // Fetch EXPENSE
        axios.post("/api/expense/getExpense", variables).then((response) => {
			if (response.data.success) {
                combineExpenseGroupsAndEntries(response.data.groups, response.data.entries);

			} else {
				console.log("Failed to get budget");
			}
        });
    };
    

	return (
		<div className="dashboard-container">
            <div id="calendar">
                <div id="month-year">
                    <h2>{allMonths[month]} 2020</h2>
                </div>

                <div id="months">
                    {allMonths.map((month,index) => (
                        <button key={index} className="month-btn" name={month} onClick={() => setMonth(index)}>{month}</button>
                    ))}
                </div>
            </div>

			<Charts 
                totalExpense={totalExpense}
                totalIncome={totalIncome}
                categoryNames={categoryNames}
                categoryTotalExpenses={categoryTotalExpenses}
            />

			<Income
				setIncomeModalDisplay={setIncomeModalDisplay}
                fetchBudget={fetchBudget}
                income={income}
                totalIncome={totalIncome}
                calculateIncome={calculateIncome}
                calculateExpense={calculateExpense}
				setBudget={setBudget}
				variables={variables}
				editEntry={editEntry}
				setEditEntry={setEditEntry}
				currentlyEditing={currentlyEditing}
                setCurrentlyEditing={setCurrentlyEditing}
                grabChartData={grabChartData}
			/>

            <Savings
				setSavingsModalDisplay={setSavingsModalDisplay}
                fetchBudget={fetchBudget}
                savings={savings}
                totalSavings={totalSavings}
                calculateIncome={calculateIncome}
                calculateExpense={calculateExpense}
				setBudget={setBudget}
				variables={variables}
				editEntry={editEntry}
				setEditEntry={setEditEntry}
				currentlyEditing={currentlyEditing}
                setCurrentlyEditing={setCurrentlyEditing}
                grabChartData={grabChartData}
			/>

			<Expense
				setExpenseModalDisplay={setExpenseModalDisplay}
                budget={budget}
                fetchBudget={fetchBudget}
                expense={expense}
                totalExpense={totalExpense}
                calculateIncome={calculateIncome}
                calculateExpense={calculateExpense}
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
};

export default Budget;
