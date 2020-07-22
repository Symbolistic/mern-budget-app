import React, { useState, useEffect } from "react";
import "./Budget.css";
import axios from "axios";
import IncomeModal from "./Modals/IncomeModal";
import ExpenseModal from "./Modals/ExpenseModal";
import Income from "./BudgetInfo/Income";
import Expense from "./BudgetInfo/Expense";
import { Bar, Doughnut } from 'react-chartjs-2';

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
    const [savings, setSavings] = useState(940);

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
	const variables = { 
        userFrom: localStorage.getItem("userId"),
        month: month,
        year: year
    };

	useEffect(() => {
		fetchBudget();
	}, [month]);

	const calculateIncome = (income) => {

        if (income) {
            const totalIncome = income.reduce((acc, currVal) => {
                console.log(currVal)
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
    
    const calculateExpense = (expense) => {

        if (expense) {
            const totalExpense = expense.reduce((acc, currVal) => {

                // Get the total sum of this categories expense entries
                const entriesTotal = currVal.expenseEntries.reduce((accEntries, currEntry) => {
                    return accEntries + currEntry.amount;
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
            expenseGroups[index].expenseEntries.push(entry);
        })

        setExpense(expenseGroups);
        calculateExpense(expenseGroups);
        grabChartData(expenseGroups);
    }
    
    const grabChartData = (expenseGroups) => {
        // Grab all the data for names of categories and put it into an array
        const categoryNames = expenseGroups.map(category => category.name);
        // Same, but we grab the total expenses (add them all up for each category) and put em into an array
        const categoryTotalExpenses = expenseGroups.map(group => {
             return group.expenseEntries.reduce((accEntries, currEntry) => {
                return accEntries + currEntry.amount;
            }, 0);
        });

        // After collecting the data and calculating it up, pass it to state
        setCategoryNames(categoryNames);
        setCategoryTotalExpenses(categoryTotalExpenses);
    }

	const fetchBudget = () => {
		axios.post("/api/income/getIncome", variables).then((response) => {
			if (response.data.success) {
                console.log(response.data)
                setIncome(response.data.income);
                calculateIncome(response.data.income);
                //calculateExpense(response.data.budget.budgets[new Date().getMonth()]);
                //grabChartData(response.data.budget.budgets[new Date().getMonth()]);
			} else {
				console.log("Failed to get budget");
			}
        });
        
        axios.post("/api/expense/getExpense", variables).then((response) => {
			if (response.data.success) {
                console.log(response)
                combineExpenseGroupsAndEntries(response.data.groups, response.data.entries);
                //calculateExpense(response.data.expense);
                //grabChartData(response.data.budget.budgets[new Date().getMonth()]);
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
        labels: ["Savings", ...categoryNames],
        datasets: [
            {
                label: "Monthly Expenses",
                barThickness: 100,
                data: [savings, ...categoryTotalExpenses],
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
