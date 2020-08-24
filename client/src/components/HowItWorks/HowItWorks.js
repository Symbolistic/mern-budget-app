import React from "react";
import "./howitworks.css";
import generatetemplate from "../../assets/generatetemplate.gif"
import addinggroups from "../../assets/addinggroups.gif"
import addingentries from "../../assets/addingentries.gif"
import budgetactual from "../../assets/budgetactual.gif"

function HowItWorks(props) {
	return (
		<div id="container">
			<h1>How It Works</h1>
			<br />
			<h3>Aftering Registering you will be taken to the App</h3>
			<p>
				Just click the generate template button to generate your first basic
				template for the month
			</p>
            <img src={generatetemplate} alt="showing how to generate a template" height="100%" width="80%"/>

			<h3>Adding Groups</h3>
			<p>
				You can add any type of group you want to the Income, Savings, and
				Expense sections
			</p>
            <img src={addinggroups} alt="showing how to add incomes" height="100%" width="80%"/>

			<h3>Adding Entries</h3>
			<p>Entries can be added into the income and expense groups you made.</p>
            <img src={addingentries} alt="showing how to add entries to your income or expenses" height="100%" width="80%"/>

			<h3>Viewing your expected Budget vs Actual Spending Habits</h3>
			<p>
				So usually you'll first set a budget and at the end of each week or
				month you'll add in your actual spending amounts and compare to see if
				you stayed within budget. At the top above the graphs and charts there
				is a radio button you can click to see the data of your budget (expected
				spend) and your actual spent amount.
			</p>
            <img src={budgetactual} alt="showing how to switch between budget data and actual spent data" height="100%" width="80%"/>
		</div>
	);
}

export default HowItWorks;
