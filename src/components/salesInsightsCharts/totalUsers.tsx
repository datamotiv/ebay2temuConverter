import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TotalUsers = ({ percentage }: { percentage: number }) => {
  const data = {
    labels: ["LISTING OPTIMIZATION SCORE", "LISTING OPTIMIZATION OPPORTUNITY"],
    datasets: [
      {
        data: [percentage, 100-percentage ],
        backgroundColor: ["#75e76b", "#f0f0f0"], 
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
           <span className="text-2xl font-poppins  font-semibold">$150 </span>
         </div>
         {/* <div>
         <h3 className="text-justify font-poppins text-lg text-[#b95cf4] font-semibold">Total number of users</h3>
         </div> */}
         
       </div>
  );
};

export default TotalUsers;
