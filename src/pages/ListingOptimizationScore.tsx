import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

const ListingOptimizationScore = ({ percentage }: { percentage: number }) => {
 


  const data = {
    labels: ["Fitment Adoption Score", "Fitment Adoption Opportunity"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#6baae7", "#d4ebf2"], // light grey for the remaining part
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
    <div className="relative flex flex-col items-center w-60 h-48  rounded-2xl">
    {/* Distinctive Blue Ring Doughnut Chart */}
    <Doughnut data={data} options={options} />
  
    {/* Center Value and Label */}
    <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
      <span  className="text-md text-gray-500 text-center">Overall Listing Optimization</span>
      <span className="text-xl font-bold text-gray-800">{percentage}%</span>
    </div>
  
    {/* Scores Section */}
    <div className="w-full px-4 mt-4 border-t border-gray-200 pt-3 grid grid-cols-2 gap-2 text-center">
      <div>
        <span className="block text-xs text-black-300 font-semibold">Optimization</span>
        <span className="text-base  font-bold text-black-300">{percentage}%</span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-[#00CC00] ">Opportunity</span>
        <span className="text-base font-bold text-[#00CC00] ">{100 - percentage}%</span>
      </div>
    </div>
  </div>
  
  );
};

export default ListingOptimizationScore;
