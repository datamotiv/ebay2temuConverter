import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CountryWiseSales = ({ percentage }: { percentage: number }) => {
  const data = {
    labels: ["US", "UK", "Bulgaria"],
    datasets: [
      {
        data: [[percentage, 100 - percentage, 0]],
        backgroundColor: ["#6baae7", "#d75b5b", "#5bc8d7"],
        borderWidth: 0,
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   cutout: "70%",
  //   plugins: {
  //     tooltip: { enabled: false },
  //     legend: {
  //       display: true,
  //       position: "bottom", // Moves legend below the chart
  //       align: "center", // Aligns legends vertically
  //       labels: {
  //         boxWidth: 10, // Adjusts the size of the color box
  //         padding: 10, // Adds spacing between legend items
  //         pointStyle: "circle",
  //         usePointStyle: true,
  //       },
  //     },
  //   },
  // };

  return (
    <div className="relative flex flex-col justify-between items-center w-60 h-60">
    <h3 className="text-center font-poppins text-lg text-[#b95cf4] mb-10 font-semibold">
      Countrywise Sales
    </h3>
    <Doughnut data={data}  />
    <div className="flex flex-col items-center w-full">
      {/* Legend is automatically placed here by Chart.js */}
    </div>
  </div>
  );
};

export default CountryWiseSales;
