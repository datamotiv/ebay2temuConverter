import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CircularProgressBarTwo = ({ percentage }: { percentage: number }) => {
  const data = {
    labels: ["Fitment Adoption Score", "Fitment Adoption Opportunity"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#aef0a7  ", "#75e76b"], // Green and Red
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
    <div className="relative flex flex-col items-center w-60 h-40 ">
      <Doughnut data={data} options={options} />
      <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-sm text-gray-500">FITMENTS</span>
        <span className="text-2xl font-semibold">{percentage}%</span>
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex flex-col items-center">
          <span className="text-black-300 text-xs font-semibold">Fitment Adoption Score</span>
          <span className="font-bold text-black-300">{percentage}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#00CC00] text-xs font-semibold">Fitment Adoption Opportunity</span>
          <span className="font-bold text-[#00CC00]">{100 - percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressBarTwo;
