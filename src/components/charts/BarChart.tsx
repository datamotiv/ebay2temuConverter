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
	labels: string[];
};

const BarChart: React.FC<BarChartProps> = ({ data, labels }) => {
	const chartData = {
		labels,
		datasets: [
			{
				label: "Monthly Data",
				data,
				backgroundColor: "#FF7980",
				// borderColor: "#FF7980",
				// borderWidth: 1,
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

export default BarChart;
