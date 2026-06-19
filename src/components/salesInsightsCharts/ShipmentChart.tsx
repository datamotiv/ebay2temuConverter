import  { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import locationIcon from "../../assets/images/location.png";
 
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const ShipmentChart = () => {
    const [icon, setIcon] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        // Load the location pin image
        const img = new Image();
        img.src = locationIcon;
        img.width = 25; // Set width to prevent full coverage
        img.height = 25;
        img.onload = () => setIcon(img);
    }, []);
    
    const options :any = {
        scales: {
            x: {
                display: false, // Hides the x-axis
                grid: {
                    display: false, // Removes x-axis grid lines
                },
                ticks: {
                    display: false, // Hides x-axis labels
                },
            },
            y: {
                display: false, // Hides the y-axis
                grid: {
                    display: false, // Removes y-axis grid lines
                },
                ticks: {
                    display: false, // Hides y-axis labels
                },
            },
        },
        elements: {
            point: {
                radius: 10, // Ensures marker visibility
            },
        },
        plugins: {
            legend: {
                display: false, // Hides the legend if not needed
            },
        },
    };
    

    const data:any = {
        datasets: [
            {
                label: "Shipment Locations",
                data: [
                    { x: 40.7128, y: -74.006 }, // New York
                    { x: 34.0522, y: -118.2437 }, // Los Angeles
                    { x: 51.5074, y: -0.1278 }, // London
                    { x: 10.7128, y: -100.006 }, // New York
                    { x: 224.0522, y: -302.2437 }, // Los Angeles
                    { x: 77.5074, y: -226.1278 }, // London
                ],
                backgroundColor: "rgba(75,192,192,1)",
                pointStyle: icon, // Use the image as a point
                pointRadius: 20, // Adjust size
            },
        ],
        
    };

    return <Scatter data={data} options={options} />;
};

export default ShipmentChart;
