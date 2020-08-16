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
	totalBudgetExpense,
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
			editBudget: editEntry[`budgetedAmount${expenseEntryID}`],
			editSpent: editEntry[`spentAmount${expenseEntryID}`]
		};

		console.log(data)
		// This is a check to see if someone is putting too high a value, if its true, set to 1 cent
		if (data.editAmount > 999999999999999999) {
			data.editAmount = 0.01;
		}

		if (data.editDescription || data.editBudget || data.editSpent) {
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

		// This is a check to see if someone is putting too high a value, if its true, set to 1 cent
		if (data.budgetedAmount > 999999999999999999) {
			data.budgetedAmount = 0.01;
		}

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
				<h2>Total Expenses: ${totalBudgetExpense}</h2>
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
									<ul className="row table-header">
										<li className="flex-item flex1">Description</li>
										<li className="flex-item flex2">Amount</li>
										<li className="flex-item flex3">Actual</li>
										<li className="flex-item flex4"></li>
										<li className="flex-item flex5"></li>
									</ul>

									{category.expenseEntries.map((expenseEntry, index) => (
										<ul key={expenseEntry+index} className="row">
											<li className="flex-item flex1 description">
												{currentlyEditing[expenseEntry._id] === true ? (
													<input
														className="edit-input"
														name={`description${expenseEntry._id}`}
														maxLength="30"
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
											</li>
											<li className="flex-item flex2">
												{currentlyEditing[expenseEntry._id] === true ? (
													<input
														className="edit-input"
														name={`budgetedAmount${expenseEntry._id}`}
														maxLength="30"
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
											</li>
											<li className="flex-item flex3">
												{currentlyEditing[expenseEntry._id] === true ? (
													<input
														className="edit-input"
														name={`spentAmount${expenseEntry._id}`}
														maxLength="30"
														onChange={handleExpenseEdit}
														value={
															editEntry[`spentAmount${expenseEntry._id}`]
																? editEntry[`spentAmount${expenseEntry._id}`]
																: expenseEntry.spentAmount
														}
													/>
												) : (
													expenseEntry.spentAmount
												)}
											</li>
											<li className="flex-item flex4">
												{currentlyEditing[expenseEntry._id] === true ? (
													<DoneIcon
														id={expenseEntry._id}
														onClick={() => editExpense(expenseEntry._id)}
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
											</li>
											<li className="flex-item flex5">
												<DeleteIcon
													onClick={() => deleteExpense(expenseEntry._id)}
												/>
											</li>
										</ul>
									))}

									<form className="add-entry">
										{/* The reason I use val._id is because I want to search by id, not name
                            just incase 2 categories have the same name, it will cause bugs. */}
										<input
											className="entry-description entry-data"
											type="text"
											name={category._id}
											maxLength="30"
											onChange={handleChange}
											value={newEntry[category.name]}
											placeholder="Description"
										/>
										<div className="entry-price">
											<input
												className="entry-data"
												type="number"
												name={category._id + "budgetedAmount"}
												maxLength="30"
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
