import React, { useState } from "react";
import axios from "axios";
import './Modal.css';

function ExpenseModal(props) {
	const [newCategory, setNewCategory] = useState({});

	const variables = { userFrom: localStorage.getItem("userId") };

	const fetchBudget = () => {
		axios.post("/api/budget/getBudget", variables).then((response) => {
			if (response.data.success) {
				props.setBudget(response.data.budget.templates);
				props.calculateIncome(response.data.budget.templates);
			} else {
				console.log("Failed to get budget");
			}
		});
	};

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
			categoryType: event.target.name,
			userId: variables.userFrom,
			...newCategory,
		};
		console.log(data);

		if (data.categoryType === "cancel") {
			setNewCategory({}); // Clear input fields
			props.setExpenseModalDisplay(false); // Exit modal
		} else {
			axios.post("/api/budget/addCategory", data).then((response) => {
				if (response.data.success) {
                    setNewCategory({}); // Clear input fields
                    props.setExpenseModalDisplay(false); // Exit Modal after adding data
                    fetchBudget(); // Update the render
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
							name="categoryName"
							value={newCategory["categoryName"] ? newCategory["categoryName"] : ''}
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
