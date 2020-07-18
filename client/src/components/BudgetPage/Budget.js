import React, { useState, useEffect } from 'react';
import './Budget.css';
import axios from "axios";
import IncomeModal from "./Modals/IncomeModal";
import ExpenseModal from "./Modals/ExpenseModal";
import Income from "./BudgetInfo/Income";
import Expense from "./BudgetInfo/Expense";



const Budget = () => {
    const [budget, setBudget] = useState([]);

    const [editEntry, setEditEntry] = useState({});

    const [incomeModalDisplay, setIncomeModalDisplay] = useState(false);
    const [expenseModalDisplay, setExpenseModalDisplay] = useState(false);
    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const variables = { userFrom: localStorage.getItem("userId") }

    useEffect(() => {
        fetchBudget();
    }, []);

    const fetchBudget = () => {
        axios.post("/api/budget/getBudget", variables)
            .then(response => {
                if(response.data.success) {
                    setBudget(response.data.budget.templates);
                } else {
                    console.log("Failed to get budget");
                }
            })
    }


    return (
			<div className="container">
				<div id="info-area">
					<h3>Graphs and Main Data will go here!</h3>
				</div>

				<Income
					setIncomeModalDisplay={setIncomeModalDisplay}
					budget={budget}
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
				/>
				<ExpenseModal
					expenseModalDisplay={expenseModalDisplay}
					setExpenseModalDisplay={setExpenseModalDisplay}
					setBudget={setBudget}
				/>
			</div>
		);
};

export default Budget;