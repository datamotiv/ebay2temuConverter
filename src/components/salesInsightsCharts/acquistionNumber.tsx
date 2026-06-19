
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// X-axis Labels (Months)
const labels = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

// Data for 3 datasets (Month, Day, Year)
const data = {
  labels,
  datasets: [
    {
      label: "Month",
      data: [120000, 150000, 180000, 200000, 220000, 250000, 280000, 300000, 330000, 350000, 370000, 400000], 
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Day",
      data: [140000, 160000, 190000, 210000, 240000, 260000, 290000, 310000, 340000, 360000, 380000, 390000], 
      borderColor: "#36A2EB",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Year",
      data: [100000, 130000, 160000, 190000, 210000, 230000, 250000, 270000, 290000, 310000, 330000, 350000], 
      borderColor: "#FFCE56",
      backgroundColor: "rgba(255, 206, 86, 0.5)",
      yAxisID: "y",
    },
  ],
};

// Chart Options
const options:any = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10, // Adjust space between title and chart
      left: 20,   // Adds padding to prevent title touching the card edge
      right: 20,
    },
  },
  plugins: {
    legend: {
      position: "top",
      align: "end", // Move legend to the extreme right
      labels: {
        usePointStyle: true,
      },
    },
    title: {
      display: true,
      text: "Monthly Revenue Progress",
      align:'start',
      color:"#9CA3AF",
      font: {
        size: 16,
       
        
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Months",
      },
      // ticks: {
      //   maxRotation: 0, // Ensures labels stay horizontal
      //   minRotation: 0, // Prevents any rotation
      // },
      grid: {
        drawOnChartArea: false, // ❌ Removes vertical grid lines
        drawBorder: false, // Optional: Removes border line
      },
    },
    y: {
      type: "linear",
      position: "left",
      min: 100000,
      max: 400000,
      title: {
        display: false,
        text: "Value (100K - 400K)",
      },
    },
  },
};

export default function AcquistionNumber() {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
