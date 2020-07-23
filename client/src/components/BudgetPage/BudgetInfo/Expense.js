import React, { useState } from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";

function Expense({
	setExpenseModalDisplay,
	fetchBudget,
	expense,
	totalExpense,
	variables,
	editEntry,
	currentlyEditing,
	setCurrentlyEditing,
	setEditEntry,
}) {
	const [newEntry, setNewEntry] = useState({});


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

	};

	const editExpense = (expenseEntryID) => {
		const data = {
			expenseEntryID: expenseEntryID,
			editDescription: editEntry[`description${expenseEntryID}`],
			editAmount: editEntry[`amount${expenseEntryID}`],
		};

		if (data.editDescription || data.editAmount) {
			axios.post("/api/expense/editExpenseEntry", data).then((response) => {
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

	const deleteExpense = (expenseEntryId) => {
		const data = {
			expenseEntryID: expenseEntryId,
		};

		axios.post("/api/expense/deleteExpenseEntry", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to delete to expense");
			}
		});
	};

	// This will add an expense to a specific category
	const addExpense = (id, name) => {

		const data = {
			entryFrom: id,
			description: newEntry[id],
			budgetedAmount: newEntry[id + "budgetedAmount"],
		};

		axios.post("/api/expense/addExpenseEntry", data).then((response) => {
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
			groupID: categoryId,
		};

		axios.post("/api/expense/deleteExpenseGroup", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to remove to expense group");
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
					Add Group
				</button>
			</div>

			<div className="data-wrapper">
				{expense.length > 0
					? expense.map((category, index) => (
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
											<tr>
												<th>Description</th>
												<th>Budgeted</th>
                                            	<th>Actual</th>
												<th></th>
												<th></th>
											</tr>
                                            
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
																		name={`budgetedAmount${expenseEntry._id}`}
																		onChange={handleExpenseEdit}
																		value={
																			editEntry[`budgetedAmount${expenseEntry._id}`]
																				? editEntry[`budgetedAmount${expenseEntry._id}`]
																				: expenseEntry.budgetedAmount
																		}
																	/>
																) : (
																	expenseEntry.budgetedAmount
																)}
															</td>
															<td className="data">
																{currentlyEditing[expenseEntry._id] === true ? (
																	<input
																		name={`actualAmount${expenseEntry._id}`}
																		onChange={handleExpenseEdit}
																		value={
																			editEntry[`actualAmount${expenseEntry._id}`]
																				? editEntry[`actualAmount${expenseEntry._id}`]
																				: expenseEntry.actualAmount
																		}
																	/>
																) : (
																	expenseEntry.actualAmount
																)}
															</td>
															<td className="expense-icon1">
																{currentlyEditing[expenseEntry._id] === true ? (
																	<DoneIcon
																		id={expenseEntry._id}
																		onClick={() =>
																			editExpense(
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

									<form className="add-entry">
										{/* The reason I use val._id is because I want to search by id, not name
                            just incase 2 categories have the same name, it will cause bugs. */}
										<input
											className="entry-description entry-data"
											type="text"
											name={category._id}
											onChange={handleChange}
											value={newEntry[category.name]}
											placeholder="Description"
										/>
										<div className="entry-price">
											<input
												className="entry-data"
												type="text"
												name={category._id + "budgetedAmount"}
												onChange={handleChange}
												value={newEntry[category.name + "budgetedAmount"]}
												placeholder="Budget Amount"
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
