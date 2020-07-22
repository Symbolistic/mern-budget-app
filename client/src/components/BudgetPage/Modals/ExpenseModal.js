import React, { useState } from "react";
import axios from "axios";
import './Modal.css';

function ExpenseModal(props) {
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

		if (data.categoryType === "cancel") {
			setNewCategory({}); // Clear input fields
			props.setExpenseModalDisplay(false); // Exit modal
		} else {
			axios.post("/api/expense/addExpenseGroup", data).then((response) => {
				if (response.data.success) {
                    setNewCategory({}); // Clear input fields
                    props.setExpenseModalDisplay(false); // Exit Modal after adding data
                    props.fetchBudget(); // Update the render
				} else {
					console.log("Failed to add category");
				}
			});
		}
	};

	return (
		<div className={props.expenseModalDisplay ? "modal" : "modal hide"}>
			<div className="modal-header">
				<h3>Add Expense Category</h3>
			</div>
			<div className="modal-body">
				<form>
					<label>
						Category Name:
						<input
							type="text"
							name="groupName"
							value={newCategory["groupName"] ? newCategory["groupName"] : ''}
							onChange={handleNewCategory}
						/>
					</label>

					<div className="modal-buttons">
						<input
							name="expenseCategory"
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
}

export default ExpenseModal;
