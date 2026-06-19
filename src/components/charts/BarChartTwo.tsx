import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

type BarChartProps = {
	data: number[];
	dataTwo: number[];
	labels: string[];
};

const BarChartTwo: React.FC<BarChartProps> = ({ data, dataTwo, labels }) => {
	const chartData = {
		labels,
		datasets: [
			{
				label: "Dataset 1",
				data: data,
				backgroundColor: "#000000", // Black bars
				borderColor: "#000000",
				borderWidth: 1,
			},
			{
				label: "Dataset 2",
				data: dataTwo,
				backgroundColor: "#FF7980", // Pink bars
				// borderColor: "rgba(255, 99, 132, 1)",
				borderWidth: 1,
			},
		],
	};

	const options = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="w-full max-w-lg mx-auto mt-10">
			<Bar data={chartData} options={options} />
		</div>
	);
};

export default BarChartTwo;
