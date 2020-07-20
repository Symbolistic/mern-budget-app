import React, { useState, useEffect } from "react";
import "./Budget.css";
import axios from "axios";
import IncomeModal from "./Modals/IncomeModal";
import ExpenseModal from "./Modals/ExpenseModal";
import Income from "./BudgetInfo/Income";
import Expense from "./BudgetInfo/Expense";
import { Bar, Doughnut } from 'react-chartjs-2';

const Budget = () => {
    // Budget, Income, and Expense info
    const [budget, setBudget] = useState([]);
    const [totalIncome, setTotalIncome] = useState('0');
    const [totalExpense, setTotalExpense] = useState('0');

    // Handles editing of data
	const [editEntry, setEditEntry] = useState({});

    // This data is for the modals
	const [incomeModalDisplay, setIncomeModalDisplay] = useState(false);
	const [expenseModalDisplay, setExpenseModalDisplay] = useState(false);
    const [currentlyEditing, setCurrentlyEditing] = useState(false);
    
    // This data is for the pie chart
    const [categoryNames, setCategoryNames] = useState([]);
    const [categoryTotalExpenses, setCategoryTotalExpenses] = useState([]);

    // This is to check which user is currently logged in
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
    
    const grabChartData = (budgetData) => {
        // Grab all the data for names of categories and put it into an array
        const categoryNames = budgetData[0].expenseCategories.map(category => category.name);
        // Same, but we grab the total expenses (add them all up for each category) and put em into an array
        const categoryTotalExpenses = budgetData[0].expenseCategories.map(category => {
             return category.expenseEntries.reduce((accEntries, currEntry) => {
                return accEntries + currEntry.amount;
            }, 0);
        });

        // After collecting the data and calculating it up, pass it to state
        setCategoryNames(categoryNames);
        setCategoryTotalExpenses(categoryTotalExpenses);
    }

	const fetchBudget = () => {
		axios.post("/api/budget/getBudget", variables).then((response) => {
			if (response.data.success) {
                setBudget(response.data.budget.templates);
                calculateIncome(response.data.budget.templates);
                calculateExpense(response.data.budget.templates);
                grabChartData(response.data.budget.templates);
			} else {
				console.log("Failed to get budget");
			}
		});
    };
    
    const barData = {
        labels: ['Monthly Expenses', 'Monthly Income'],
        datasets: [
            {
                label: "Monthly Expenses",
                barThickness: 70,
                data: [parseFloat(totalExpense.replace(/,/g, '')), parseFloat(totalIncome.replace(/,/g, ''))],
                borderColor: ['rgb(153, 102, 255)', 'rgb(133,187,101)'],
                backgroundColor:['rgba(153, 102, 255, 0.2)', 'rgba(133,187,101, 0.2)'],
                borderWidth: 1
            }
        ]
    }

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                        max: parseInt(totalIncome.replace(/,/g, '')),
                        stepSize: parseInt(totalIncome.replace(/,/g, '')) / 2,
                        steps: 2,
                    },
                    gridLines: {
                        display: false
                     }
                }
            ]
        }
    }

    const doughnutData = {
        labels: [...categoryNames],
        datasets: [
            {
                label: "Monthly Expenses",
                barThickness: 100,
                data: [...categoryTotalExpenses],
                borderColor: ['rgb(153, 102, 255)', 'rgb(133,187,101)',  
                '#FF6633', '#E666FF', '#22d0f2', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#FFB399', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],

                backgroundColor:['rgba(153, 102, 255)', 'rgba(133,187,101)', 
                '#FF6633', '#E666FF', '#22d0f2', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#FFB399', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                borderWidth: 1,
            }
        ]
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
    }

	return (
		<div className="dashboard-container">
			<div id="chart-data">
                <div id="doughnut-chart-container">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
				<div id="bar-chart-container">
                    <Bar data={barData} options={barOptions} />
                </div>
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
                grabChartData={grabChartData}
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
                grabChartData={grabChartData}
			/>

			<IncomeModal
				incomeModalDisplay={incomeModalDisplay}
				setIncomeModalDisplay={setIncomeModalDisplay}
                setBudget={setBudget}
                calculateIncome={calculateIncome}
                grabChartData={grabChartData}
			/>
			<ExpenseModal
				expenseModalDisplay={expenseModalDisplay}
				setExpenseModalDisplay={setExpenseModalDisplay}
                setBudget={setBudget}
                calculateIncome={calculateIncome}
                grabChartData={grabChartData}
			/>
		</div>
	);
};

export default Budget;
