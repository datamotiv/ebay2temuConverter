import {
  Chart as ChartJS,
  ArcElement,
  // Tooltip,
  Legend,
  CategoryScale,
  BarElement,
} from "chart.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AcquistionNumber from "../components/salesInsightsCharts/acquistionNumber";
import TotalUsers from "../components/salesInsightsCharts/totalUsers";
import Navbar from "../components/Navbar";
import CircularProgressBarTwo from "../components/CircularProgressBarTwo";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CircularProgressBar from "../components/CircularProgressBar";
import { ReactNode } from "react";
// import { Card, Typography, CardContent, Box } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  useSummaryQuery,
  useSummaryFitmentQuery,
} from "../Redux/features/summary/summaryApi";
import ShipmentChart from "../components/salesInsightsCharts/ShipmentChart";
import SalesProgressBarChart from "../components/salesInsightsCharts/SalesProgressBarChart";

// Register chart.js components
ChartJS.register(ArcElement, Legend, CategoryScale, BarElement);

interface LockedContentProps {
  children: ReactNode;
}

// locked content on premium features
const LockedContent = ({ children}: LockedContentProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowY: 'hidden',
      }}
    >
      {/* Blurred background content */}
      <Box sx={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
        {children}
      </Box>

      {/* Gray overlay centered and 75% width */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          bottom:'70%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%', // Gray overlay width
          height: '70%',
          bgcolor: 'rgba(128, 128, 128, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          // borderRadius: '12px',
          padding: '20px',
        }}
      >
        <button>
          <a
            href="https://emotivonline.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 font-semibold mt-3 bg-[#ED1F24] text-white font-poppins text-sm rounded-[15px]"
            style={{
              padding: '10px 20px',
              backgroundColor: '#ED1F24',
              color: 'white',
              borderRadius: '15px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              textAlign:'center'
            }}
          >

Sales Insight not included with Free Trial. <br /> Contact EMOTIV for full services
            <Tooltip title="Contact us for more information">
              <CallMadeIcon fontSize="small" />
            </Tooltip>
          </a>
        </button>
      </Box>
    </Box>
  );
};



const SalesInsights = () => {
  const navigate = useNavigate();
  const { data: summaryFitmentData } = useSummaryFitmentQuery({
    pageNumber: 1,
    pageSize: 50,
  });
  const { data: summaryData } = useSummaryQuery({});
  const [score, setScore] = useState(summaryData?.score);
  const tasks = [
    { task: "Arrange", text: "Order recieved", time: "12:24" },
    { task: "Shipment", text: "Shipment Created", time: "13:09" },
    { task: "Make List", text: "Item lists prepared", time: "14:56" },
    { task: "Review", text: "Reviewed details", time: "17:23" },
    { task: "Dispatch", text: "Shipment Dispatched", time: "17:23" },
    { task: "Arrived", text: "Shipment Arrived", time: "20:45" },
  ];

  useEffect(() => {
    if (summaryData) {
      setScore(summaryData.score);
    }
  }, [summaryData]);

  return (
    <>
      <div className="overflow-x-hidden  ">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
          <Navbar />
        </div>

        <LockedContent > 
        {/* Top Section */}
        <Grid style={{padding:'4rem'}}>
        <Grid container spacing={2} padding={2} >
          <Grid
            container
            spacing={2}
            size={{ lg: 5 }}
            sx={{ flexWrap: "nowrap", display: "flex", margin: 0 }}
          >
            {/* Overall Fitment Adoption Score */}
            <Grid>
              <Card
                sx={{
                  p: 2,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                  boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
                  borderRadius: "12px", // Smooth edges
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)", // Slight pop-up effect
                    boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Typography
                  className="font-semibold"
                  variant="h6"
                  textAlign="center"
                  gutterBottom
                >
                  Fitment Adoption
                  <Tooltip title="This identifies and confirms your auto parts listings that specifies compatible vehicle makes, models, and years, as a % of your store">
                    <InfoIcon sx={{ fontSize: "0.75rem" }} color="action" />
                  </Tooltip>
                </Typography>
                <CircularProgressBarTwo
                  percentage={summaryFitmentData?.fitmentScore}
                />
                {/* <FitmentScoreChart /> */}
                <div className="flex gap-[10px] mt-5 relative top-20 text-center justify-center">
                  <button
                    // onClick={handleNotSellerDetails}
                    onClick={() => navigate("/fitmentAdoptionSummary")}
                    className="px-5 py-2.5 font-semibold mt-3 bg-[#ED1F24] text-white font-poppins text-sm rounded-[15px]"
                  >
                    View Fitment Summary
                    <Tooltip
                      title="Free - more detailed analysis of your Fitment Adoption score
"
                    >
                      <InfoIcon style={{ fontSize: 11 }} />
                    </Tooltip>
                  </button>
                </div>
              </Card>
            </Grid>

            {/* Listing Optimization */}
            <Grid>
              <Card
                sx={{
                  p: 2,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                  boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
                  borderRadius: "12px", // Smooth edges
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)", // Slight pop-up effect
                    boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Listing Optimization
                  <Tooltip title="This identifies and confirms your enhanced eBay listings with strong titles, images, item specifics, and pricing to show you what changes you can make to improve sales">
                    <InfoIcon sx={{ fontSize: "0.75rem" }} color="action" />
                  </Tooltip>
                </Typography>
                <CircularProgressBar percentage={score} />
                <a
                  href="https://emotivonline.com/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 font-semibold mt-3 bg-[#ED1F24] text-white font-poppins text-sm rounded-[15px]"
                  style={{
                    marginTop: "auto",
                    padding: "10px 20px",
                    backgroundColor: "#ED1F24",
                    color: "white",
                    borderRadius: "15px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  Contact Emotiv
                  <Tooltip title="Contact us for more information">
                    <CallMadeIcon fontSize="small" />
                  </Tooltip>
                </a>
              </Card>
            </Grid>
          </Grid>

          {/* Three Cards Row */}
          <Grid size={{ lg: 7 }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
                borderRadius: "12px", // Smooth edges
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)", // Slight pop-up effect
                  boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                {/* Overall Store GMV */}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <div className="text-center font-semibold text-lg text-gray-400">
                    Overall Store GMV
                  </div>
                  <Typography
                    variant="h6"
                    sx={{ color: "#ff7f7f", fontWeight: "bold" }}
                  >
                    1,500,000
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    ▲ 1020 ▼ 1020
                  </Typography>
                </Box>

                {/* Category GMV */}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <div className="text-center font-semibold text-lg text-gray-400">
                    Category GMV
                  </div>
                  <Typography
                    variant="h6"
                    sx={{ color: "#ff7f7f", fontWeight: "bold" }}
                  >
                    1,200,000
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    ▲ 1020 ▼ 1020
                  </Typography>
                </Box>

                {/* Item Sales GMV */}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <div className="text-center font-semibold text-lg text-gray-400">
                    Item Sales GMV
                  </div>
                  <Typography
                    variant="h6"
                    sx={{ color: "#ff7f7f", fontWeight: "bold" }}
                  >
                    900,000
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    ▲ 1020 ▼ 1020
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Monthly Revenue Bar Chart */}
            <Grid size={{ lg: 12 }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                
                  height: 150, // Match height with Doghunt charts
                  boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
                  borderRadius: "12px", // Smooth edges
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)", // Slight pop-up effect
                    boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
                  },
                  marginTop:'1rem',
                }}
              >
                <AcquistionNumber />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        {/* bottom section */}
        <Grid container spacing={2} padding={1} size={{ lg: 12 }} >
          <Grid size={{ lg: 5 }}>
          <Card
  sx={{
                maxHeight: "23vh", // Decreased height
    display: "flex",
    flexDirection: "column",
                mx: "auto",
  width: "100%",
    boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
    borderRadius: "12px", // Smooth edges
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)", // Slight pop-up effect
      boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
    },
  }}
>

              <CardContent sx={{ padding: "8px" }}>
                {" "}
                {/* Reduce CardContent padding */}
                <div className=" text-left font-semibold text-lg text-gray-500">
                  Todays Task
                </div>
                <TableContainer>
                  <Table>
                    {/* <TableHead>
            <TableRow sx={{ height: "28px" }}>
              <TableCell sx={{ py: 0, padding: "2px", minHeight: "unset" }}></TableCell>
              <TableCell sx={{ py: 0, padding: "2px", minHeight: "unset" }}>Task</TableCell>
              <TableCell sx={{ py: 0, padding: "2px", minHeight: "unset" }}>Details</TableCell>
              <TableCell sx={{ py: 0, padding: "2px", minHeight: "unset" }}>Time</TableCell>
            </TableRow>
          </TableHead> */}
                    <TableBody>
                      {tasks.map((row, index) => (
                        <TableRow key={index} sx={{ height: "28px" }}>
                          {" "}
                          {/* Reduce row height */}
                          <TableCell sx={{ py: 0, padding: "2px" }}>
                            <Checkbox size="small" />
                          </TableCell>
                          <TableCell
                            sx={{ py: 0, padding: "2px", color: "#FF476C" }}
                          >
                            {row.task}
                          </TableCell>
                          <TableCell
                            sx={{ py: 0, padding: "2px", color: "gray" }}
                          >
                            {row.text}
                          </TableCell>
                          <TableCell
                            sx={{ py: 0, padding: "2px", color: "gray" }}
                          >
                            {row.time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Three Charts Row */}
          <Grid
            container
            size={{ lg: 7, md: 7 }}
            spacing={2}
            sx={{ display: "flex", flexWrap: "nowrap", alignItems: "stretch" }}
          >
            <Grid size={{ lg: 4, md: 3, xs: 12 }}>
            <Card
  sx={{
 height: "55%" ,
    display: "flex",
    flexDirection: "column",
    boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
    borderRadius: "12px", // Smooth edges
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)", // Slight pop-up effect
      boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
    },
  }}
>

                <CardContent sx={{ flexGrow: 1 }}>
                  <div className="text-center font-semibold text-lg text-gray-500">
                    {" "}
                    Progress
                  </div>
                  <SalesProgressBarChart />
                  <div className="text-center font-semibold text-2xl pt-2 text-[#5674B9]">
                    {" "}
                    $150,000
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ lg: 4, md: 3, xs: 12 }}>
            <Card
  sx={{
 display: "flex",
                  flexDirection: "column",
                  height: "55%",
                  position: "relative",
    boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
    borderRadius: "12px", // Smooth edges
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)", // Slight pop-up effect
      boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
    },
  }}
>

                <CardContent>
                  <div className="text-center font-semibold text-lg text-gray-500 mb-10">
                    {" "}
                    Shipments
                  </div>
                  <ShipmentChart />
                  <div className=" absolute bottom-3 left-[25%] text-center font-semibold text-2xl  text-[#FF474C]">
                    {" "}
                    $250,000
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ lg: 4, md: 3, xs: 12 }}>
            <Card
  sx={{
display: "flex",
 flexDirection: "column",
 height: "55%",

    boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.15)", // Adds depth
    borderRadius: "12px", // Smooth edges
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)", // Slight pop-up effect
      boxShadow: "15px 15px 30px rgba(0, 0, 0, 0.2)",
    },
  }}
>

                <CardContent>
                  <div className="text-center font-semibold text-lg text-gray-500 mb-10">
                    {" "}
                    Revenue Per Hour
                  </div>
                  <TotalUsers percentage={33} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        </Grid>
        </LockedContent>
      </div>
    </>
  );
};

export default SalesInsights;
