import React, { useState, useEffect } from 'react';
import './Budget.css';
import axios from "axios";


const Budget = () => {
    const [budget, setBudget] = useState([]);
    const [newEntry, setNewEntry] = useState({});

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

    const addCategory = (event) => {
        event.preventDefault();

        const data = {
            categoryType: event.target.name,
            userId: variables.userFrom
        }
        console.log(data)

        axios.post('/api/budget/addCategory', data)
                .then(response => {
                    if(response.data.success) {
                        fetchBudget();
                    } else {
                        console.log("Failed to add category")
                    }
                })
    }

    // This will handle all the input elements
    const handleChange = (e) => {
        const {name, value} = e.target

        setNewEntry({
            ...newEntry,
            [name]:value
        })
        console.log(newEntry)
    }


    // This will add an expense to a specific category
    const addExpense = (event) => {
        event.preventDefault();
        const category = event.target.name;
        
        const data = {
            userId: variables.userFrom,
            category: category,
            description: newEntry[category],
            price:  newEntry[category+"Price"]
        }

        axios.post('/api/budget/addToExpenses', data)
                .then(response => {
                    if(response.data.success) {
                        fetchBudget();
                    } else {
                        console.log("Failed to add to expenses")
                    }
                })
    }

    const deleteCategory = (event) => {
        event.preventDefault();
        const categoryId = event.target.id;
        const type = event.target.name
        
        const data = {
            userId: variables.userFrom,
            type: type,
            categoryId: categoryId,
        }

        console.log(data)

        axios.post('/api/budget/deleteCategory', data)
                .then(response => {
                    if(response.data.success) {
                        fetchBudget();
                    } else {
                        console.log("Failed to add to expenses")
                    }
                })
    }


    return (
        <div className="container">
            <div id="info-area">
                <h3>Graphs and Main Data will go here!</h3>
            </div>
            <div id="income">
                <h4 className="budget-title">Income</h4>
                <button name="incomeCategory" onClick={addCategory}>Add Income Category</button>
                <div id="income-container">
                    {budget[0]?.incomeCategories.length > 0 ? budget[0].incomeCategories.map((val, index) => (
                        
                        <div key={index} className="category-container">
                                <div className="header-area">
                                    <h4 className="category-header">{val.name}</h4>
                                    {/* Here I put the ID is so I can pass it to the onClick
                                    this way I can target the correct category by ID instead of name */}
                                    <button id={val._id} name="income" className="close" onClick={deleteCategory}>X</button>
                                </div>
                                <div className="income-info">
                                    <p className="description">Pay Schedule:</p>
                                    <p className="data">{val.incomeInfo.paySchedule}</p>
                                    <p className="description">Net Income:</p>
                                    <p className="data">{val.incomeInfo.netIncome}</p>
                                </div>

                        </div>

                        )) : "" }
                </div>

            </div>

            <div id="expense">
                <h4 className="budget-title">Expense</h4>
                <button name="expenseCategory" onClick={addCategory}>Add Expense Category</button>
                <div id="expense-container">
                {budget[0]?.expenseCategories.length > 0 ? budget[0].expenseCategories.map((val, index) => (

                    <div key={index} className="category-container">
                        <div className="header-area">
                            <h4 className="category-header">{val.name}</h4>
                            {/* Here I put the ID is so I can pass it to the onClick
                            this way I can target the correct category by ID instead of name */}
                            <button id={val._id} name="expense" className="close" onClick={deleteCategory}>X</button>       
                        </div>
                        <div>
                            {val.expenseEntries.length > 0 ? val.expenseEntries.map((val, index) => (
                                <div key={index} className="category-list">
                                    <p>{val.description}: {val.amount}</p>
                                </div>
                            )) : ''}
                        </div>
                        <form>
                            <input type="text" name={val.name} onChange={handleChange} value={newEntry[val.name]} placeholder="Description"/>
                            <input type="text" name={val.name+"Price"} onChange={handleChange} value={newEntry[val.name+"Price"]} placeholder="Amount $$$"/>
                            <input type="submit" name={val.name} value="Add Expense" onClick={addExpense}/>
                        </form>
                    </div>

                    )) : "" }
                    </div>

            </div>

        </div>
    );
};

export default Budget;