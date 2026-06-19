import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FitmentAdoptionChart = ({ percentage }: { percentage: number }) => {
  const data = {
    labels: ["LISTING OPTIMIZATION SCORE", "LISTING OPTIMIZATION OPPORTUNITY"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#6baae7", "#f0f0f0"], 
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
    <div className="relative flex flex-row items-center w-60 h-40">
      <Doughnut data={data} options={options} />
      <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* <span className="text-sm text-gray-500">LISTINGS</span> */}
        <span className="text-2xl font-poppins  font-semibold">30%</span>
      </div>
      <h1 className="text-justify font-poppins text-lg text-[#b95cf4] font-semibold">Fitment Adoption</h1>      {/* <div className="mt-4 flex flex-col space-y-2">
        <div className="flex flex-col i items-center">
          <span className="text-black-200 text-xs font-semibold">LISTING SCORE</span>
          <span className="font-bold">{percentage}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black-200 text-xs font-semibold">LISTING OPPORTUNITY</span>
          <span className="font-bold">{100 - percentage}%</span>
        </div>
      </div> */}
    </div>
  );
};

export default FitmentAdoptionChart;
