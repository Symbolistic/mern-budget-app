import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const IncomeModal = (props) => {
	const [newCategory, setNewCategory] = useState({});



	// This handles the inputs for the modal element that will add a new category
	const handleNewCategory = (e) => {
		const { name, value } = e.target;

		setNewCategory({
			...newCategory,
			[name]: value,
		});
		console.log(newCategory);
	};

	const addCategory = (event) => {
		event.preventDefault();

		const data = {
			...props.variables,
			categoryType: event.target.name,
			budgetType: "Monthly",
			...newCategory,
		};
		console.log(data);

		if (data.categoryType === "cancel") {
			setNewCategory({});
			props.setIncomeModalDisplay(false);
		} else {
			axios.post("/api/income/addIncomeGroup", data).then((response) => {
				if (response.data.success) {
					setNewCategory({});
					props.setIncomeModalDisplay(false);
					props.fetchBudget();
				} else {
					console.log("Failed to add category");
				}
			});
		}
	};

	return (
		<div className={props.incomeModalDisplay ? "modal" : "modal hide"}>
			<div className="modal-header">
				<h3>Add Income Category</h3>
			</div>
			<div className="modal-body">
				<form>
					<label>
						Category Name:
						<input
							type="text"
							name="groupName"
							value={
								newCategory["groupName"] ? newCategory["groupName"] : ""
							}
							onChange={handleNewCategory}
						/>
					</label>

					<label>
						Pay Schedule:
						<select name="paySchedule" value={newCategory["paySchedule"] ? newCategory["paySchedule"] : "Bi-Weekly"} onChange={handleNewCategory}>
							<option value="Weekly">Weekly</option>
							<option value="Bi-Weekly">Bi-Weekly</option>
							<option value="Monthly">Monthly</option>
						</select>
					</label>

					<label>
						Net Income:
						<input
							type="text"
							name="netIncome"
							value={newCategory["netIncome"] ? newCategory["netIncome"] : ""}
							onChange={handleNewCategory}
						/>
					</label>

					<label>
						Extra Bi-Weekly Income:
						<input
							type="text"
							name="extraIncome"
							value={
								newCategory["extraIncome"] ? newCategory["extraIncome"] : ""
							}
							onChange={handleNewCategory}
						/>
					</label>

					<label>
						Savings Percent:
						<input
							type="text"
							name="savingsPercent"
							value={
								newCategory["savingsPercent"]
									? newCategory["savingsPercent"]
									: ""
							}
							onChange={handleNewCategory}
						/>
					</label>
					<div className="modal-buttons">
						<input
							name="incomeCategory"
							type="submit"
							value="Submit"
							onClick={addCategory}
						/>
						<button name="cancel" onClick={addCategory}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default IncomeModal;
