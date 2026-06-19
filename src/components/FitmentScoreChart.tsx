import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const FitmentScoreChart = () => {
//   const fitmentScore= useSelector((state: RootState) => state.setFitmentScore.fitmentScore) 
//   const scoreValue = Number(fitmentScore); // Ensure it's a number
//   console.log(scoreValue)

// old code
const selectedView = useSelector((state:RootState) => state.setCountryFitmentScore.selectedView);
  const countryFitmentScore = useSelector((state: RootState) => state.setCountryFitmentScore.countryFitmentScore);
  const categoryFitmentScore = useSelector((state:RootState) => state.setCategoryFitmentScore.categoryFitmentScore);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };
// new code after UAT

  const score = (selectedView === "country" ? countryFitmentScore : categoryFitmentScore) ?? 0;

  const chartData = {

    datasets: [
        {
          data: [score || 0, 100 - (score || 0)], // Filling remaining space with 100-score
          backgroundColor: ["#36A2EB", "#FFCE56"],
          borderWidth: 0,
        },
      ],
  };

  return (
  <>
     <div className="relative  flex flex-col items-center w-60 h-40 ">
     <Tooltip title="The score will only update when a category filter is applied.">
     <p className="text-md text-center text-[#0F0C22] font-poppins font-medium">
     {selectedView === "country" ? "Country Fitment Adoption" : "Category Fitment Adoption"}
                
                    <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                  
                </p>
                </Tooltip>
         <Doughnut data={chartData} options={options}/>
         <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/5">
            {/* <span className="text-sm text-gray-500">FITMENTS</span> */}
            {/* <span className="text-2xl font-semibold font-poppins">{scoreValue}%</span> */}
            {/* <h3>{selectedView === "country" ? "Country Fitment Score" : "Category Fitment Score"}</h3> */}
            <span className="text-sm text-gray-500">FITMENTS</span>
            <span className="text-2xl font-semibold">{score}%</span>
          </div>
          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex flex-col items-center">
              <span className="text-black-300  text-xs capitalize font-semibold">Fitment Adoption Score</span>
              <span className="font-bold text-black-300">{score}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#00CC00]  text-xs capitalize font-semibold">Fitment Adoption Opportunity</span>
              <span className="font-bold text-[#00CC00] ">{100 - score}%</span>
            </div>
          </div>
        </div>
        </>
  );
};

export default FitmentScoreChart;
