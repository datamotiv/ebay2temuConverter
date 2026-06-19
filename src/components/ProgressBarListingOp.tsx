import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Typography } from "@mui/material";


ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressBarListingOp = ({ percentage }: { percentage: number }) => {
  
  const data = {
    labels: ["LISTING OPTIMIZATION SCORE", "LISTING OPTIMIZATION OPPORTUNITY"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#6baae7", "#d4ebf2"], 
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="flex items-center">
      {/* Top Section: Doughnut Chart & Title */}
      <div className="flex items-center space-x-4">
        {/* Doughnut Chart with Percentage Inside */}
        <div className="relative flex items-center w-60 h-40">
          <Doughnut data={data} options={options} />
          <div className="absolute flex items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-2xl font-semibold">{percentage}%</span>
          </div>
        </div>

        {/* Title Beside Doughnut */}
    
      </div>

      {/* Bottom Section: Listing Score & Listing Opportunity */}
      <div className="flex items-center space-x-6">
      {/* Doughnut Chart */}
      {/* <div className="relative flex items-center w-60 h-40">
        <Doughnut data={data} options={options} />
        <div className="absolute flex items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-2xl font-semibold">{percentage}%</span>
        </div>
      </div> */}

      {/* Right Section: Title & Scores */}
      <div className="flex flex-col items-center">
        {/* Common Title */}
        <h5 className="text-md font-bold font-poppins mb-2">Overall Listing Optimization Score</h5>

        {/* Listing Score & Listing Opportunity (Side by Side) */}
        <div className="flex justify-center space-x-8">
          {/* Listing Score */}
          <div className="flex flex-col items-center">
            <span className="text-gray-600 text-sm font-semibold">Listing Score</span>
            <span className="text-lg font-bold">{percentage}%</span>
          </div>

          {/* Listing Opportunity */}
          <div className="flex flex-col items-center">
            <span className="text-gray-600 text-sm font-semibold">Listing Opportunity</span>
            <span className="text-lg font-bold">{100 - percentage}%</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProgressBarListingOp;
