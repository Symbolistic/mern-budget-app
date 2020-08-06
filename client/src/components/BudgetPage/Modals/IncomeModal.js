import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const SavingsModal = (props) => {
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
				<h3>Add Income Group</h3>
			</div>
			<div className="modal-body">
				<form>
					<label>
						Group Name:
						<input
							type="text"
							name="groupName"
							maxLength="40"
							value={
								newCategory["groupName"] ? newCategory["groupName"] : ""
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

export default SavingsModal;
