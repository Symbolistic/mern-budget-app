import React, { useState, useEffect } from "react";
import "./Budget.css";
import axios from "axios";
import IncomeModal from "./Modals/IncomeModal";
import ExpenseModal from "./Modals/ExpenseModal";
import Income from "./BudgetInfo/Income";
import Expense from "./BudgetInfo/Expense";

const Budget = () => {
    const [budget, setBudget] = useState([]);
    const [totalIncome, setTotalIncome] = useState('');
    const [totalExpense, setTotalExpense] = useState('');

	const [editEntry, setEditEntry] = useState({});

	const [incomeModalDisplay, setIncomeModalDisplay] = useState(false);
	const [expenseModalDisplay, setExpenseModalDisplay] = useState(false);
	const [currentlyEditing, setCurrentlyEditing] = useState(false);

	const variables = { userFrom: localStorage.getItem("userId") };

	useEffect(() => {
		fetchBudget();
	}, []);

	const calculateIncome = (budget) => {

        if (budget[0]) {
            const totalIncome = budget[0].incomeCategories.reduce((acc, currVal) => {
                const paySchedule = currVal.incomeInfo.paySchedule;
                const netIncome = currVal.incomeInfo.netIncome;
                const extraIncome = currVal.incomeInfo.extraIncome;
                // Checks how many times a payment comes per months and calculates
                switch(paySchedule) {
                    case "Weekly":
                        return acc + ((netIncome + extraIncome) * 52 / 12);

                    case "Bi-Weekly":
                        return acc + ((netIncome + extraIncome) * 26 / 12);

                    case "Monthly":
                        return acc + (netIncome + extraIncome);

                    default:
                        break;

                }
                return acc;
            }, 0);
            setTotalIncome(totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
    };
    
    const calculateExpense = (budget) => {

        if (budget[0]) {
            const totalExpense = budget[0].expenseCategories.reduce((acc, currVal) => {

                // Get the total sum of this categories expense entries
                const entriesTotal = currVal.expenseEntries.reduce((accEntries, currEntry) => {
                    return accEntries + currEntry.amount;
                }, 0)     
                return acc + entriesTotal;
            }, 0);
            setTotalExpense(totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
	};

	const fetchBudget = () => {
		axios.post("/api/budget/getBudget", variables).then((response) => {
			if (response.data.success) {
                setBudget(response.data.budget.templates);
                calculateIncome(response.data.budget.templates);
                calculateExpense(response.data.budget.templates);
			} else {
				console.log("Failed to get budget");
			}
		});
	};

	return (
		<div className="dashboard-container">
			<div id="chart-data">
				<h3>Graphs and Main Data will go here!</h3>
			</div>

			<Income
				setIncomeModalDisplay={setIncomeModalDisplay}
                budget={budget}
                totalIncome={totalIncome}
                calculateIncome={calculateIncome}
                calculateExpense={calculateExpense}
				setBudget={setBudget}
				variables={variables}
				editEntry={editEntry}
				setEditEntry={setEditEntry}
				currentlyEditing={currentlyEditing}
                setCurrentlyEditing={setCurrentlyEditing}
			/>

			<Expense
				setExpenseModalDisplay={setExpenseModalDisplay}
                budget={budget}
                totalExpense={totalExpense}
                calculateIncome={calculateIncome}
                calculateExpense={calculateExpense}
				setBudget={setBudget}
				variables={variables}
				editEntry={editEntry}
				setEditEntry={setEditEntry}
				currentlyEditing={currentlyEditing}
				setCurrentlyEditing={setCurrentlyEditing}
			/>

			<IncomeModal
				incomeModalDisplay={incomeModalDisplay}
				setIncomeModalDisplay={setIncomeModalDisplay}
                setBudget={setBudget}
                calculateIncome={calculateIncome}
			/>
			<ExpenseModal
				expenseModalDisplay={expenseModalDisplay}
				setExpenseModalDisplay={setExpenseModalDisplay}
                setBudget={setBudget}
                calculateIncome={calculateIncome}
			/>
		</div>
	);
};

export default Budget;
