import React, { useState } from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";
function Expense({
	setExpenseModalDisplay,
	budget,
	totalExpense,
	calculateIncome,
	calculateExpense,
	setBudget,
	variables,
	editEntry,
	currentlyEditing,
	setCurrentlyEditing,
	setEditEntry,
	grabChartData,
}) {
	const [newEntry, setNewEntry] = useState({});

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

	// This will handle all the input elements
	const handleChange = (event) => {
		const { name, value } = event.target;

		setNewEntry({
			...newEntry,
			[name]: value,
		});
	};

	const handleExpenseEdit = (event) => {
		const { name, value } = event.target;

		setEditEntry({
			...editEntry,
			[name]: value,
		});

		console.log(editEntry);
	};

	const editExpense = (categoryId, expenseId) => {
		const data = {
			userId: variables.userFrom,
			categoryId: categoryId,
			expenseId: expenseId,
			editDescription: editEntry[`description${expenseId}`],
			editAmount: editEntry[`amount${expenseId}`],
		};

		if (data.editDescription || data.editAmount) {
			axios.post("/api/budget/editExpense", data).then((response) => {
				if (response.data.success) {
					// Sets editing to false so we get rid of the input field and display data again
					setCurrentlyEditing({ categoryId: false });

					// Clear the editing input field
					setEditEntry({});

					// Update the render
					fetchBudget();
				} else {
					console.log("Failed to edit expense");
					setCurrentlyEditing({ categoryId: false });
					setEditEntry({});
				}
			});
		} else {
			setCurrentlyEditing({ categoryId: false });
			setEditEntry({});
		}
	};

	const deleteExpense = (categoryId, expenseId) => {
		const data = {
			userId: variables.userFrom,
			categoryId: categoryId,
			expenseId: expenseId,
		};

		axios.post("/api/budget/deleteExpense", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to delete to expense");
			}
		});
	};

	// This will add an expense to a specific category
	const addExpense = (id, name) => {
		const categoryId = id;
		const categoryName = name;

		const data = {
			userId: variables.userFrom,
			categoryId: categoryId,
			categoryName: categoryName,
			description: newEntry[categoryId],
			price: newEntry[categoryId + "Price"],
		};

		axios.post("/api/budget/addToExpenses", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to add to expenses");
			}
		});
	};

	const deleteCategory = (event) => {
		event.preventDefault();
		const categoryId = event.target.id;
		const type = event.target.name;

		const data = {
			userId: variables.userFrom,
			type: type,
			categoryId: categoryId,
		};

		axios.post("/api/budget/deleteCategory", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to remove to category");
			}
		});
	};

	return (
		<div id="expense-container">
			<div className="header-area">
				<h2>Total Expenses: ${totalExpense}</h2>
				<button
					className="addCategory"
					name="expenseCategory"
					onClick={() => setExpenseModalDisplay(true)}
				>
					Add Category
				</button>
			</div>

			<div className="data-wrapper">
				{budget[0]?.expenseCategories.length > 0
					? budget[0].expenseCategories.map((category, index) => (
							<div key={index} className="data-container">
								<div className="data-header">
									<h4 className="category-header">{category.name}</h4>
									{/* Here I put the ID is so I can pass it to the onClick
                            this way I can target the correct category by ID instead of name */}
									<button
										id={category._id}
										name="expense"
										className="close"
										onClick={deleteCategory}
									>
										X
									</button>
								</div>
								<div id="entries-data">
									<table>
										<tbody>
											{category.expenseEntries.map((expenseEntry, index) => (
														<tr key={index} id="expense-data">
															<td className="description">
																{currentlyEditing[expenseEntry._id] === true ? (
																	<input
																		name={`description${expenseEntry._id}`}
																		onChange={handleExpenseEdit}
																		value={
																			editEntry[`description${expenseEntry._id}`]
																				? editEntry[`description${expenseEntry._id}`]
																				: expenseEntry.description
																		}
																	/>
																) : (
																	expenseEntry.description
																)}
															</td>
															<td className="data">
																{currentlyEditing[expenseEntry._id] === true ? (
																	<input
																		name={`amount${expenseEntry._id}`}
																		onChange={handleExpenseEdit}
																		value={
																			editEntry[`amount${expenseEntry._id}`]
																				? editEntry[`amount${expenseEntry._id}`]
																				: expenseEntry.amount
																		}
																	/>
																) : (
																	expenseEntry.amount
																)}
															</td>
															<td className="expense-icon1">
																{currentlyEditing[expenseEntry._id] === true ? (
																	<DoneIcon
																		id={expenseEntry._id}
																		onClick={() =>
																			editExpense(
																				category._id,
																				expenseEntry._id
																			)
																		}
																	/>
																) : (
																	<EditIcon
																		onClick={() =>
																			setCurrentlyEditing({
																				[expenseEntry._id]: true,
																			})
																		}
																	/>
																)}
															</td>
															<td className="expense-icon2">
																<DeleteIcon
																	onClick={() =>
																		deleteExpense(
																			category._id,
																			expenseEntry._id
																		)
																	}
																/>
															</td>
														</tr>
												  ))									
												}
										</tbody>
									</table>

									<form className="add-expense">
										{/* The reason I use val._id is because I want to search by id, not name
                            just incase 2 categories have the same name, it will cause bugs. */}
										<input
											className="expense-description expense-data"
											type="text"
											name={category._id}
											onChange={handleChange}
											value={newEntry[category.name]}
											placeholder="Description"
										/>
										<div className="expense-price">
											<input
												className="expense-data"
												type="text"
												name={category._id + "Price"}
												onChange={handleChange}
												value={newEntry[category.name + "Price"]}
												placeholder="Amount $$$"
											/>
											<AddIcon
												className="data-submit"
												id={category._id}
												type="submit"
												name={category.name}
												value="+"
												onClick={() => addExpense(category._id, category.name)}
											/>
										</div>
									</form>
								</div>
							</div>
					  ))
					: ""}
			</div>
		</div>
	);
}

export default Expense;
