import React from "react";
import { Bar, Doughnut } from 'react-chartjs-2';

function Charts({
    totalExpense,
    totalIncome,
    categoryNames,
    categoryTotalExpenses
}) {

    const barData = {
        labels: ['Monthly Expenses', 'Monthly Income'],
        datasets: [
            {
                label: "Monthly Expenses",
                barThickness: 70,
                data: [parseFloat(totalExpense.replace(/,/g, '')), parseFloat(totalIncome.replace(/,/g, ''))],
                borderColor: ['rgb(153, 102, 255)', 'rgb(133,187,101)'],
                backgroundColor:['rgba(153, 102, 255, 0.2)', 'rgba(133,187,101, 0.2)'],
                borderWidth: 1
            }
        ]
    }

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                        max: parseInt(totalIncome.replace(/,/g, '')),
                        stepSize: parseInt(totalIncome.replace(/,/g, '')) / 2,
                        steps: 2,
                    },
                    gridLines: {
                        display: false
                     }
                }
            ]
        }
    }

    const doughnutData = {
        labels: [...categoryNames],
        datasets: [
            {
                label: "Monthly Expenses",
                barThickness: 100,
                data: [...categoryTotalExpenses],
                borderColor: ['rgb(153, 102, 255)', 'rgb(133,187,101)',  
                '#FF6633', '#E666FF', '#22d0f2', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#FFB399', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],

                backgroundColor:['rgba(153, 102, 255)', 'rgba(133,187,101)', 
                '#FF6633', '#E666FF', '#22d0f2', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#FFB399', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                borderWidth: 1,
            }
        ]
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
    }

	return (
		<div id="chart-data">
			<div id="doughnut-chart-container">
				<Doughnut data={doughnutData} options={doughnutOptions} />
			</div>
			<div id="bar-chart-container">
				<Bar data={barData} options={barOptions} />
			</div>
		</div>
	);
}

export default Charts;
