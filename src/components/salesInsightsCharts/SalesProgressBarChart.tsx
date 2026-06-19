import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: any = {
  responsive: true,
  maintainAspectRatio: false,
 
  plugins: {
    // legend: {
    //   position: "top",
    //   align: "end",
    //   labels: {
    //     usePointStyle: true,
    //   },
    // },
    // title: {
    //   display: true,
    //   text: "Revenue vs Loss",
    //   align: "start",
    //   font: { size: 16 },
    //   padding: { bottom: 10 },
    // },
    legend: false,
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false }, // Removes x grid
      ticks: { display: false }, // Remove x-axis labels
      border: { display: false }, // Remove x-axis line
      barPercentage: 0.4, // Increases bar width
    //   categoryPercentage: 0.04, // Reduces gap between bars
    },
    y: {
      stacked: true,
      grid: { display: false }, // Removes y grid
      ticks: { display: false }, // Remove x-axis labels
      border: { display: false }, // Remove x-axis line
      barPercentage: 0.4,
      categoryPercentage: 0.4,
    },
  },
  barThickness: 10, // Adjust bar width
};

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const data: any = {
  labels,
  datasets: [
    {
      label: "Revenue",
      data: [2000000, 3500000, 3000000, 28000000, 30050000, 4000000],
      backgroundColor: "#5674B9",
      borderRadius: 10, // Curved bar edges
    //   borderRadius: { bottomLeft: 10, bottomRight: 10 , }, // Curves bottom
      borderSkipped: "false", // Ensures curve applies to bottom only
    },
    {
      label: "Loss",
      data: [5000000, 8000000, 6000000, 9000000, 7000000, 10000000],
      backgroundColor: "white",
//    borderRadius: { bottomLeft: 10, bottomRight: 10 },
borderRadius: 10, // Curved bar edges
      borderSkipped: "false",
      pacborderColor: "gray", // To make white bars visible
      borderWidth: 1, // Adds a slight outline
    },
  ],
};

export default function SalesProgressBarChart() {
  return  (
    <div style={{ height: "200px", width: "100%" }}>
<Bar options={options} data={data} />
    </div>
  )
}
