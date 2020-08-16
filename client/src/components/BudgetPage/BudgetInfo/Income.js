import React, { useState } from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

function Income({
	setIncomeModalDisplay,
	income,
	totalIncome,
	fetchBudget,
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

	const handleIncomeEdit = (event) => {
		const { name, value } = event.target;

		setEditEntry({
			...editEntry,
			[name]: value,
		});
	};

	const editIncomeEntry = (id) => {
		const data = {
			incomeEntryID: id,
			editDescription: editEntry[`description${id}`],
			editAmount: editEntry[`amount${id}`]
		};

		// This is a check to see if someone is putting too high a value, if its true, set to 1 cent
		if (data.editAmount > 999999999999999999) {
			data.editAmount = 0.01;
		}

		if (data.editDescription || data.editAmount) {
			axios.post("/api/income/editIncomeEntry", data).then((response) => {
				if (response.data.success) {
					// Sets editing to false so we get rid of the input field and display data again
					setCurrentlyEditing({ categoryId: false });

					// Clear the editing input field
					setEditEntry({});

					// Update the render
					fetchBudget();
				} else {
					console.log("Failed to edit income entry");
					setCurrentlyEditing({ categoryId: false });
					setEditEntry({});
				}
			});
		} else {
			setCurrentlyEditing({ categoryId: false });
			setEditEntry({});
		}
	};

	const deleteCategory = (event, id) => {
		event.preventDefault();

		const data = {
			groupID: id,
		};

		axios.post("/api/income/deleteIncomeGroup", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to remove to category");
			}
		});
	};

	const deleteIncomeEntry = (id) => {
		const data = {
			incomeEntryID: id,
		};

		axios.post("/api/income/deleteIncomeEntry", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to delete to expense");
			}
		});
	};

	// This will add an expense to a specific category
	const addIncomeEntry = (id) => {
		const data = {
			entryFrom: id,
			description: newEntry[id],
			amount: newEntry[id + "budgetedAmount"],
		};

		// This is a check to see if someone is putting too high a value, if its true, set to 1 cent
		if (data.amount > 999999999999999999) {
			data.amount = 0.1;
		}

		axios.post("/api/income/addIncomeEntry", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to add to income");
			}
		});
	};

	return (
		<div id="income-container">
			<div className="header-area">
				<h2 className="budget-income-title">Total Income: ${totalIncome}</h2>
				<button
					className="addCategory"
					name="incomeCategory"
					onClick={() => setIncomeModalDisplay(true)}
				>
					Add Group
				</button>
			</div>

			<div className="data-wrapper">
				{income.length > 0
					? income.map((group, index) => (
							<div key={index} className="data-container">
								<div className="data-header">
									<h4 className="category-header">{group.name}</h4>
									{/* Here I put the ID is so I can pass it to the onClick
                                this way I can target the correct category by ID instead of name */}
									<button
										id={group._id}
										name="income"
										className="close"
										onClick={(event) => deleteCategory(event, group._id)}
									>
										X
									</button>
								</div>
								<div id="entries-data">

									<ul className="row table-header">
										<li className="flex-item flex1">Description</li>
										<li className="flex-item flex2">Amount</li>
										<li className="flex-item flex4"></li>
										<li className="flex-item flex5"></li>
									</ul>

									{group.incomeEntries.map((incomeEntry, index) => (
										<ul key={incomeEntry+index} className="row">
											<li className="flex-item flex1 description">
												{currentlyEditing[incomeEntry._id] === true ? (
													<input
														className="edit-input"
														name={`description${incomeEntry._id}`}
														maxLength="30"
														onChange={handleIncomeEdit}
														value={
															editEntry[`description${incomeEntry._id}`]
																? editEntry[`description${incomeEntry._id}`]
																: incomeEntry.description
														}
													/>
												) : (
													incomeEntry.description
												)}
											</li>
											<li className="flex-item flex2">
												{currentlyEditing[incomeEntry._id] === true ? (
													<input
														type="number"
														className="edit-input"
														name={`amount${incomeEntry._id}`}
														maxLength="30"
														onChange={handleIncomeEdit}
														value={
															editEntry[`amount${incomeEntry._id}`]
																? editEntry[`amount${incomeEntry._id}`]
																: incomeEntry.amount
														}
													/>
												) : (
													incomeEntry.amount
												)}
												</li>

											<li className="flex-item flex4">
											{currentlyEditing[incomeEntry._id] === true ? (
													<DoneIcon
														onClick={() => editIncomeEntry(incomeEntry._id)}
													/>
												) : (
													<EditIcon
														onClick={() =>
															setCurrentlyEditing({
																[incomeEntry._id]: true,
															})
														}
													/>
												)}
											</li>
											<li className="flex-item flex5">
											<DeleteIcon
													onClick={() => deleteIncomeEntry(incomeEntry._id)}
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
											name={group._id}
											maxLength="30"
											onChange={handleChange}
											value={newEntry[group.name]}
											placeholder="Description"
										/>
										<div className="entry-price">
											<input
												className="entry-data"
												type="text"
												name={group._id + "budgetedAmount"}
												maxLength="30"
												onChange={handleChange}
												value={newEntry[group.name + "budgetedAmount"]}
												placeholder="Income Amount"
											/>
											<AddIcon
												className="data-submit"
												id={group._id}
												type="submit"
												name={group.name}
												value="+"
												onClick={() => addIncomeEntry(group._id, group.name)}
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

export default Income;
