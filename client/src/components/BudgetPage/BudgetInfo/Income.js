import React from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";

function Income({
	setIncomeModalDisplay,
	income,
    totalIncome,
    fetchBudget,
	variables,
	editEntry,
	currentlyEditing,
	setCurrentlyEditing,
	setEditEntry,
	grabChartData,
}) {

	const handleIncomeEdit = (event) => {
		const { name, value } = event.target;

		setEditEntry({
			[name]: value,
		});
	};

	const editIncome = (id, name) => {
		
		const data = {
			userId: variables.userFrom,
			groupID: id,
			name: name,
			editValue: editEntry[name + id],
		};
		// Checks if the field is empty, if its not, then we will run the function
		if (data.editValue) {
			axios.post("/api/income/editIncomeGroup", data).then((response) => {
				if (response.data.success) {
					// Sets editing to false so we get rid of the input field and display data again
					setCurrentlyEditing({ categoryId: false });

					// Clear the editing input field
					setEditEntry({});

					// Update the render
					fetchBudget();
				} else {
					console.log("Failed to edit income information");
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

	return (
		<div id="income-container">

			<div className="header-area">
				<h2 className="budget-income-title">Total Income: ${totalIncome}</h2>
				<button
					className="addCategory"
					name="incomeCategory"
					onClick={() => setIncomeModalDisplay(true)}
				>
					Add Category
				</button>
			</div>

			<div className="data-wrapper">
				{income.length > 0
					? income.map((val, index) => (
							<div key={index} id="data-container">
								<div className="data-header">
									<h4 className="category-header">{val.name}</h4>
									{/* Here I put the ID is so I can pass it to the onClick
                                this way I can target the correct category by ID instead of name */}
									<button
										id={val._id}
										name="income"
										className="close"
										onClick={(event) => deleteCategory(event, val._id)}
									>
										X
									</button>
								</div>

								<table id="income-data">
									<tbody>
										<tr>
											{/* I use ID: RowName (PaySchedule) so I can tell the code to target
                                        this specific category (using the ID) and target this specific row (using its name)*/}
											<td className="description">Pay Schedule:</td>
											<td className="data">
												{currentlyEditing[val._id] === "paySchedule" ? (
													<select
														name={`paySchedule${val._id}`}
														value={
															editEntry[`paySchedule${val._id}`]
																? editEntry[`paySchedule${val._id}`]
																: val.incomeInfo.paySchedule
														}
														onChange={handleIncomeEdit}
													>
														<option value="Weekly">Weekly</option>
														<option value="Bi-Weekly">Bi-Weekly</option>
														<option value="Monthly">Monthly</option>
													</select>
												) : (
													val.incomeInfo.paySchedule
												)}
											</td>
											<td>
												{currentlyEditing[val._id] === "paySchedule" ? (
													<DoneIcon
														id={val._id}
														name="paySchedule"
														onClick={() => editIncome(val._id, "paySchedule")}
													/>
												) : (
													<EditIcon
														onClick={() =>
															setCurrentlyEditing({ [val._id]: "paySchedule" })
														}
													/>
												)}
											</td>
										</tr>

										<tr>
											<td className="description">Net Income:</td>
											<td className="data">
												{currentlyEditing[val._id] === "netIncome" ? (
													<input
														name={`netIncome${val._id}`}
														onChange={handleIncomeEdit}
														value={
															editEntry[`netIncome${val._id}`]
																? editEntry[`netIncome${val._id}`]
																: val.incomeInfo.netIncome
														}
													/>
												) : (
													val.incomeInfo.netIncome
												)}
											</td>
											<td>
												{currentlyEditing[val._id] === "netIncome" ? (
													<DoneIcon
														id={val._id}
														name="netIncome"
														onClick={() => editIncome(val._id, "netIncome")}
													/>
												) : (
													<EditIcon
														onClick={() =>
															setCurrentlyEditing({ [val._id]: "netIncome" })
														}
													/>
												)}
											</td>
										</tr>

										<tr>
											<td className="description">Extra Income:</td>
											<td className="data">
												{currentlyEditing[val._id] === "extraIncome" ? (
													<input
														name={`extraIncome${val._id}`}
														onChange={handleIncomeEdit}
														value={
															editEntry[`extraIncome${val._id}`]
																? editEntry[`extraIncome${val._id}`]
																: val.incomeInfo.extraIncome
														}
													/>
												) : (
													val.incomeInfo.extraIncome
												)}
											</td>
											<td>
												{currentlyEditing[val._id] === "extraIncome" ? (
													<DoneIcon
														id={val._id}
														name="extraIncome"
														onClick={() => editIncome(val._id, "extraIncome")}
													/>
												) : (
													<EditIcon
														onClick={() =>
															setCurrentlyEditing({ [val._id]: "extraIncome" })
														}
													/>
												)}
											</td>
										</tr>

										<tr>
											<td className="description">Savings Percent:</td>
											<td className="data">
												{currentlyEditing[val._id] === "savingsPercent" ? (
													<input
														name={`savingsPercent${val._id}`}
														onChange={handleIncomeEdit}
														value={
															editEntry[`savingsPercent${val._id}`]
																? editEntry[`savingsPercent${val._id}`]
																: val.incomeInfo.savingsPercent
														}
													/>
												) : (
													val.incomeInfo.savingsPercent
												)}
											</td>
											<td>
												{currentlyEditing[val._id] === "savingsPercent" ? (
													<DoneIcon
														id={val._id}
														name="savingsPercent"
														onClick={() =>
															editIncome(val._id, "savingsPercent")
														}
													/>
												) : (
													<EditIcon
														onClick={() =>
															setCurrentlyEditing({
																[val._id]: "savingsPercent",
															})
														}
													/>
												)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
					  ))
					: ""}
			</div>
		</div>
	);
}

export default Income;
