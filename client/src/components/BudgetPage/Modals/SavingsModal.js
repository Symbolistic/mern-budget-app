import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const SavingsModal = (props) => {
  const [newCategory, setNewCategory] = useState({});

  // This handles the inputs for the modal element that will add a new category
  const handleNewSavings = (e) => {
    const { name, value } = e.target;

    setNewCategory({
      ...newCategory,
      [name]: value,
    });
    console.log(newCategory);
  };

  const addGroup = (event) => {
    event.preventDefault();

    const data = {
      ...props.variables,
      categoryType: event.target.name,
      budgetType: "Monthly",
      ...newCategory,
    };
    console.log(data);

    // This is a check to see if someone is putting too high a value, if its true, set to 1 cent
    if (data.budgetedAmount > 999999999999999999) {
      data.budgetedAmount = 0.01;
    }

    // This is a check to see if someone is putting too high a value, if its true, set to 1 cent
    if (data.actualAmount > 999999999999999999) {
      data.actualAmount = 0.01;
    }

    if (data.categoryType === "cancel") {
      setNewCategory({});
      props.setSavingsModalDisplay(false);
    } else {
      axios.post("/api/savings/addSavingsGroup", data).then((response) => {
        if (response.data.success) {
          setNewCategory({});
          props.setSavingsModalDisplay(false);
          props.fetchBudget();
        } else {
          console.log("Failed to add category");
        }
      });
    }
  };

  return (
    <div className={props.savingsModalDisplay ? "modal" : "modal hide"}>
      <div className="modal-header">
        <h3>Add Savings</h3>
      </div>
      <div className="modal-body">
        <form>
          <label>
            Savings Name:
            <input
              type="text"
              name="savingsName"
              maxLength="40"
              placeholder="Emergency Fund"
              value={
                newCategory["savingsName"] ? newCategory["savingsName"] : ""
              }
              onChange={handleNewSavings}
            />
          </label>

          <label>
            Budgeted Amount:
            <input
              type="text"
              name="budgetedAmount"
              maxLength="30"
              placeholder="Expected Amount"
              value={
                newCategory["budgetedAmount"]
                  ? newCategory["budgetedAmount"]
                  : ""
              }
              onChange={handleNewSavings}
            />
          </label>

          <label>
            Actual Amount:
            <input
              type="text"
              name="actualAmount"
              maxLength="30"
              placeholder="How much you actually put in"
              value={
                newCategory["actualAmount"] ? newCategory["actualAmount"] : ""
              }
              onChange={handleNewSavings}
            />
          </label>

          <div className="modal-buttons">
            <input
              name="incomeCategory"
              type="submit"
              value="Submit"
              onClick={addGroup}
            />
            <button name="cancel" onClick={addGroup}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingsModal;
