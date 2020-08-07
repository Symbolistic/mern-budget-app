import React from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";

function Savings({
	setSavingsModalDisplay,
	savings,
	totalSavings,
	fetchBudget,
	editEntry,
	currentlyEditing,
	setCurrentlyEditing,
	setEditEntry,
}) {
	const handleSavingsEdit = (event) => {
		const { name, value } = event.target;

		setEditEntry({
			[name]: value,
		});
	};

	const editSavings = (id) => {
		const data = {
			groupID: id,
			budgetedAmount: editEntry[`budgetedAmount${id}`],
			actualAmount: editEntry[`actualAmount${id}`],
		};
		
		// Checks if the field is empty, if its not, then we will run the function
		if (data.budgetedAmount || data.actualAmount) {
			axios.post("/api/savings/editSavings", data).then((response) => {
				if (response.data.success) {
					// Sets editing to false so we get rid of the input field and display data again
					setCurrentlyEditing({ categoryId: false });

					// Clear the editing input field
					setEditEntry({});

					// Update the render
					fetchBudget();
				} else {
					console.log("Failed to edit savings information");
					setCurrentlyEditing({ categoryId: false });
					setEditEntry({});
				}
			});
		} else {
			// Sets editing to false so we get rid of the input field and display data again
			setCurrentlyEditing({ categoryId: false });

			// Clear the editing input field
			setEditEntry({});
		}
	};

	const deleteGroup = (event, id) => {
		event.preventDefault();

		const data = {
			groupID: id,
		};

		axios.post("/api/savings/deleteSavingsGroup", data).then((response) => {
			if (response.data.success) {
				fetchBudget();
			} else {
				console.log("Failed to remove to group");
			}
		});
	};

	return (
		<div id="income-container">
			<div className="header-area">
				<h2 className="budget-income-title">Total Savings: ${totalSavings}</h2>
				<button
					className="addCategory"
					name="incomeCategory"
					onClick={() => setSavingsModalDisplay(true)}
				>
					Add Savings
				</button>
			</div>

			<div className="data-wrapper">
				{savings.length > 0
					? savings.map((group, index) => (
							<div key={index} className="data-container">
								<div className="data-header">
									<h4 className="category-header">{group.name}</h4>
									{/* Here I put the ID is so I can pass it to the onClick
                                    this way I can target the correct group by ID instead of name */}
									<button
										id={group._id}
										name="income"
										className="close"
										onClick={(event) => deleteGroup(event, group._id)}
									>
										X
									</button>
								</div>

								<ul className="row table-header">
										<li className="flex-item flex1">Budgeted</li>
										<li className="flex-item flex2">Actual</li>
										<li className="flex-item flex4"></li>
									</ul>

									<ul className="row">
										<li className="flex-item flex1">
										{currentlyEditing[group._id] === true ? (
													<input
														className="edit-input"
														name={`budgetedAmount${group._id}`}
														maxLength="30"
														onChange={handleSavingsEdit}
														value={
															editEntry[`budgetedAmount${group._id}`]
																? editEntry[`budgetedAmount${group._id}`]
																: group.budgetedAmount
														}
													/>
												) : (
													group.budgetedAmount
												)}
										</li>
										<li className="flex-item flex2">
										{currentlyEditing[group._id] === true ? (
													<input
														className="edit-input"
														name={`actualAmount${group._id}`}
														maxLength="30"
														onChange={handleSavingsEdit}
														value={
															editEntry[`actualAmount${group._id}`]
																? editEntry[`actualAmount${group._id}`]
																: group.actualAmount
														}
													/>
												) : (
													group.actualAmount
												)}
										</li>
										<li className="flex-item flex4">
										{currentlyEditing[group._id] === true ? (
													<DoneIcon
														id={group._id}
														name="paySchedule"
														onClick={() => editSavings(group._id)}
													/>
												) : (
													<EditIcon
														onClick={() =>
															setCurrentlyEditing({ [group._id]: true })
														}
													/>
												)}
										</li>
									</ul>
							</div>
					  ))
					: ""}
			</div>
		</div>
	);
}

export default Savings;
