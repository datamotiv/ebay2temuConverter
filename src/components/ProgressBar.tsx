import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import Tooltip from "@mui/material/Tooltip";
import CallMadeIcon from "@mui/icons-material/CallMade";

// Register Chart.js components
ChartJS.register(ArcElement, Legend);

type TOptimizationValue = {
  optimizationScore: number;
  optimizationOpportunity: number;
};

const ProgressBar = ({
  optimizationScore,
  // optimizationOpportunity,
}: TOptimizationValue) => {
  // Prepare data for the doughnut chart
  const data = {
    // labels: ['Optimization Score', 'Remaining Opportunity'],
    datasets: [
      {
        label: "Optimization Progress",
        data: [optimizationScore, 100 - optimizationScore], // We subtract the optimization score from 100 to get the remaining opportunity
        backgroundColor: ["#6baae7", "#d4ebf2"], // Color for each section
        borderWidth: 0, // Remove border width for a clean doughnut look
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: function (tooltipItem: any) {
  //           return tooltipItem.label + ": " + tooltipItem.raw + "%";
  //         },
  //       },
  //     },
  //   },
  // };

  return (
    <>
      <div className="flex flex-col">
    


        <div className="h-[150px] w-[150px] mb-3">
          <Doughnut data={data} />
        </div>

        {/* Text on the Right side */}
        {/* <div className="flex flex-col items-start justify-center pl-2 mb-3">
          <span className="text-md font-semibold text-[#6baae7]">
            Your item is {optimizationScore}% Optimized
          </span>
          <hr className="w-full border-0.5 border-gray-200" />
          <span className="text-sm font-semibold text-[#000000]">
            Opportunity {optimizationOpportunity}%
          </span>
        </div> */}
         {/* <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-sm text-gray-500">FITMENTS</span>
        <span className="text-2xl font-semibold">{optimizationScore}%</span>
      </div> */}
      <div className="mt-0 flex flex-col space-y-2">
        <div className="flex flex-col items-center">
          <span className="text-black-300 text-xs font-semibold">Optimization Score</span>
          <span className="font-bold text-black-300">{optimizationScore}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black-200 text-xs capitalize font-semibold text-[#00CC00] ">Optimization Opportunity</span>
          <span className="font-bold text-[#00CC00] ">{100 - optimizationScore}%</span>
        </div>
      </div>
      </div>
      <div className="mb-3 mt-2" >
        <a
          href="https://emotivonline.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 font-semibold mt-3  bg-[#ED1F24] text-white font-poppins text-sm rounded-[15px] cursor-pointer"
        >
          Contact Emotiv
          <Tooltip title="Contact us for more information">
            <CallMadeIcon style={{ fontSize: "1rem" }} />
          </Tooltip>
        </a>
      </div>
    </>
  );
};

export default ProgressBar;
