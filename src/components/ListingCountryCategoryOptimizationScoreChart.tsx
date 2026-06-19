import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const ListingCountryCategoryOptimizationScoreChart = () => {
// new code
const selectedView = useSelector((state:RootState) => state.setCountryFitmentScore.selectedView);
  const countryFitmentScore = useSelector((state: RootState) => state.setListingCountryScore.listingCountryScore ?? 0)
  const listingCategoryScore = useSelector((state:RootState) => state.setListingCategoryScore.listingCategoryScore ?? 0);

  // Example Chart Data

  const score = (selectedView === "country" ? countryFitmentScore : listingCategoryScore) ?? 0;

  const chartData = {
  
    datasets: [
        {
          data: [score || 0, 100 - (score || 0)], // Filling remaining space with 100-score
          backgroundColor:["#3F51B5", "#BBDEFB"],
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
  <>
 <div className="relative flex flex-col items-center w-60 h-48  rounded-2xl">
  {/* Header with Tooltip */}
  <Tooltip title="The score will only update when a category filter is applied.">
    <div className="flex items-center  mt-2">
      <p className="text-md font-semibold text-[#0F0C22] text-center font-poppins">
        {selectedView === "country" ? "Country Optimization" : "Selected Category Optimization"}
      </p>
      <InfoIcon style={{ fontSize: 14, color: "#A0A0A0" }} />
    </div>
  </Tooltip>

  {/* Doughnut Chart */}
  <Doughnut data={chartData} options={options}/>

  {/* Center Label in Chart (Optional — leave empty or add tag/percentage) */}
  <div className="absolute flex flex-col items-center top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <span className="text-md text-gray-500 text-center">Optimization Score</span>
    <span className="text-xl font-bold text-gray-800">{score}%</span>
  </div>

  {/* Score Details */}
  <div className="w-full px-4 mt-4 border-t border-gray-200 pt-3 grid grid-cols-2 gap-2 text-center">
    <div>
    <span className="block text-xs text-black-300 font-semibold">Optimization</span>
    <span className="text-base  font-bold text-black-300">{score}%</span>
    </div>
    <div>
    <span className="block text-xs text-[#00CC00]  font-semibold">Opportunity</span>
    <span className="text-base font-bold text-[#00CC00] ">{100 - score}%</span>
    </div>
  </div>
</div>

        </>
  );
};

export default ListingCountryCategoryOptimizationScoreChart;
