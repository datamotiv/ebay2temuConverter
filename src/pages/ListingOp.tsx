import Navbar from '../components/Navbar';
import { useState } from "react";
import {  Container, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
// import BannerListingOpSales from "../assets/images/BannerListingOpSales.png"
import emotivEventBanner from "../assets/images/emotivEventBanner.png"
import standOutBanner from "../assets/images/standOutBanner.png"
import ProgressBarListingOp from '../components/ProgressBarListingOp';
import {
   
    useSummaryQuery,
  
  } from "../Redux/features/summary/summaryApi";

const ListingOp = () => {
  const { data: summaryData } = useSummaryQuery({});
  const [score] = useState(summaryData?.score);
  return (
  <>
   <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar  />
      </div>  

      <Container maxWidth={false} >
      <Grid container columns={1} spacing={3} justifyContent="center" className="mt-5" size={{ xs: 12,sm:6, md: 4, lg:12, xl:12 }}>
        {/* Box 1 */}
        <Grid  size={{ xs: 12,sm:6, md: 4, lg:12, xl:12 }}>
  <Box sx={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
    {/* Image */}
    <img
      src={standOutBanner}
      alt="Box 1"
      style={{ width: "100%", borderRadius: "8px", display: "block" }}
    />

    {/* Button Positioned on the Image */}
    <a
      href="https://emotivonline.com/contact/"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-2 left-[40px] transform -translate-x-5/3 px-3 py-1 bg-[#ED1F24] text-white text-sm font-semibold rounded-[15px] cursor-pointer"
    >
      Contact Us
    </a>
  </Box>
</Grid>


        {/* Box 2 */}
        <Grid size={{ xs: 12,sm:6, md: 4, lg:12, xl:12 }} >
        <Box
  sx={{
    border: "2px solid rgba(0, 0, 0, 0.2)",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    display: "flex", // Enables horizontal alignment
    justifyContent: "space-evenly", // Space between divs
    alignItems: "center", // Align items vertically
    gap: "20px", // Adds spacing between divs
  }}
>
  {/* Overall Optimization Score */}
  <div className="w-3/4 text-center font-semibold text-lg capitalize">
    <ProgressBarListingOp percentage={score} />
  </div>

  {/* Vertical Border (Divider) */}
  <div className="w-[2px] h-44 bg-gray-400"></div>

 {/* Text Section */}
<div className="w-3/4 font-poppins text-gray-500 leading-5"> {/* Added leading-6 for 1.5x line height */}
  {/* Headline */}
  <p className="font-medium text-md text-justify">
    Dear Seller,
    <br />
    You have {100 - score}% listing opportunity.
  </p>
  <br />
  {/* Body Text */}
  <p className="text-md font-medium text-justify">
    Did you know?
    <br />
    Low score can hurt your ranking & the     sales on eBay.
    <br />
     Improve your listing with expertly curated, data-driven solutions.
  </p>

  {/* Button aligned with text */}
  <div className="text-justify">
    <a
      href="https://emotivonline.com/contact/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 px-2.5 py-1.5 font-semibold bg-[#ED1F24] text-white text-sm rounded-[15px] cursor-pointer"
    >
      Know More
    </a>
  </div>
</div>


</Box>

    </Grid>

        {/* Box 3 */}
        <Grid size={{ xs: 12,sm:6, md: 4, lg:12, xl:12 }}>
          <Box
            // sx={{
            //   border: "2px solid rgba(0, 0, 0, 0.2)",
            //   padding: "20px",
            //   textAlign: "center",
            //   borderRadius: "8px",
            //   minHeight: "200px",
            // }}
          >
            <img
              src={emotivEventBanner}
              alt="emotivevents"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          

          </Box>
        </Grid>
      </Grid>
    </Container>

      {/* <Container maxWidth={false} >
    <Grid size={{xl:12,lg:12,md:12, sm:12, xs:12}}>
      <img src={BannerListingOpSales} alt="marketingBanner" />
    </Grid>
    </Container> */}


  </>
  )
}

export default ListingOp;