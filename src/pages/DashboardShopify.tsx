import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom"; // Import hooks for navigation and state
import CircularProgressBar from "../components/CircularProgressBar";
import CircularProgressBarTwo from "../components/CircularProgressBarTwo";
import Navbar from "../components/Navbar";
import SummaryFitmentTable from "../components/summaryFitmentTable/summaryFitmentTable";
import SupportMessage from "../components/SupportMessage"; // Adjust the import path as necessary
import {
  useSummaryFitmentQuery,
  useSummaryQuery,
  // useSummaryFitmentDetailsMutation
} from "../Redux/features/summary/summaryApi";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
// import {   useSelector} from "react-redux";
import Pagination from "../components/Pagination"; // Import Pagination component
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import FitmentScoreChart from "../components/FitmentScoreChart";
import { setCategoryFitmentScore, setListingOptimizationScore, setSummaryFitmentCategories} from "../Redux/features/fitmentScoreSlice";
import WelcomeUser from "./WelcomeUser";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import shopifyLogo from "../assets/images/shopify-logo.png"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';


const DashboardShopify = () => {
  const { data: summaryData } = useSummaryQuery({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isOpenModal } = useAppSelector((state) => state.paymentModal);

  // Hardcoded values for display
  const HARDCODED_VALUES = {
    listingOptimizationScore: 78,
    fitmentAdoptionScore: 65,
    totalListings: 1247,
    optimizedListings: 973,
    unoptimizedListings: 274,
    totalStores: 3,
    activeStores: 2,
    monthlyViews: 15420,
    conversionRate: 4.2
  };

  // Restore `isToggle` from the state or default it to `false`
  const [isToggle, setIsToggle] = useState(location.state?.isToggle || false);
  // const [dialName] = useState("Listings");
  const [, setScore] = useState(summaryData?.score || HARDCODED_VALUES.listingOptimizationScore);
  const [isTableVisible, setIsTableVisible] = useState(true); // Toggle for DashboardTableTwo visibility
  const [isRepositioned, setIsRepositioned] = useState(false); // Toggle for positioning CircularProgressBarTwo
  const [, setListingOpDashboardScore] = useState(HARDCODED_VALUES.listingOptimizationScore);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const { data: summaryFitmentData, refetch } = useSummaryFitmentQuery({
    pageNumber: currentPage,
    pageSize: 50,
  });
  // const isAdmin = localStorage.getItem("isAdmin") === 'true' ? true : false;
  // console.log(isAdmin)


  const optimizationHistory = [
  {
    date: '22/05/2025 15:24',
    description: 'Optimize Listings Request',
    status: 'Not Started',
    action: 'View'
  },
//   {
//     date: '22/04/2025 15:04',
//     description: 'Optimize Listings Request',
//     status: 'Completed',
//     action: 'View'
//   },
//   {
//     date: '22/04/2025 14:42',
//     description: 'Optimize Listings Request',
//     status: 'Completed',
//     action: 'View'
//   }
];


  // Hardcoded fitment data
  const hardcodedFitmentData = {
    fitmentScore: HARDCODED_VALUES.fitmentAdoptionScore,
    fitmentCount: 3,
    categories: [
      {
        id: 1,
        categoryName: "Engine Parts",
        totalListings: 345,
        fitmentListings: 298,
        fitmentPercentage: 86.4,
        avgViews: 1250
      },
      {
        id: 2,
        categoryName: "Brake Systems",
        totalListings: 234,
        fitmentListings: 187,
        fitmentPercentage: 79.9,
        avgViews: 980
      },
      {
        id: 3,
        categoryName: "Suspension Parts",
        totalListings: 198,
        fitmentListings: 123,
        fitmentPercentage: 62.1,
        avgViews: 756
      }
    ]
  };



  useEffect(() => {
    const newUser = localStorage.getItem("isNewUser") === "true";
    if (newUser) {
      setIsNewUser(true);
      localStorage.removeItem("isNewUser"); // remove after detecting
    }
  }, []);

  useEffect(() => {
    // const isNewUser = sessionStorage.getItem("isNewUser");
    // if (isNewUser) {
      setShowWelcomeDialog(true);
      // sessionStorage.removeItem("isNewUser"); // Avoid showing again
    // }
  }, []);

  useEffect(() => {
    if (summaryData) {
      setScore(summaryData.score);
    } else {
      // Use hardcoded value if no data
      setScore(HARDCODED_VALUES.listingOptimizationScore);
    }
  }, [summaryData]);

  const handleNotSellerDetails = () => {
    setIsToggle((prev: boolean) => !prev);

    // Pass the updated `isToggle` value in the state when navigating
    navigate("/fitmentAdoptionSummary", { state: { isToggle: !isToggle } });
    setIsTableVisible(!isTableVisible); // Toggle DashboardTableTwo visibility
    setIsRepositioned(!isRepositioned); // Toggle CircularProgressBarTwo position
  };

  // Refresh the data whenever the page number changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  // Handle page change for pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // You can make API calls or handle pagination logic based on the page number here
  };

  // new code after UAT
  const fetchSummaryFitment = async ({
                                       pageNumber = 1,
                                       pageSize = 50,
                                       site = "",
                                       categoryID = "",
                                       level = "",
                                       path = "",
                                     }) => {
    try {
      //  debugger;
      const numericCategoryID = categoryID?.match(/^\d+/)?.[0] || "";

      if (numericCategoryID == "") {
        // All selected
        const numericLevel = parseInt(level) - 1;
        level = numericLevel.toString();
      }

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        site: site || "",
        categoryID: numericCategoryID || "",
        path: path || "",
      });

      if (level !== null && numericCategoryID) {
        params.append("level", level);
      }

      const url = `https://api.help-on-time.com/api/datacube/summary/fitment?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      dispatch(setCategoryFitmentScore(data.fitmentScore || HARDCODED_VALUES.fitmentAdoptionScore));

      if (data.categories) {
        dispatch(setSummaryFitmentCategories(data.categories));
      }

      const formattedArray = data.categoryFilter.map((item: string) => {
        const label = item;
        const value = item.replace(/[()]/g, '').replace(/\s+/g, '_').replace(/,/g, '');
        return { label, value };
      });
      formattedArray.unshift({ label: "All", value: "" });

      return data;
    } catch (error) {
      console.error("Error fetching fitment summary:", error);
      // Return hardcoded data on error
      return hardcodedFitmentData;
    }
  };

  useEffect(() => {
    fetchSummaryFitment({
      pageNumber: 1,
      pageSize: 50,
      site: "",
      categoryID: "",
      level: "",
    });
  }, []);

  const fetchListingOptimizationScore = async ({
    pageNumber = 1,
    pageSize = 50,
    site = "",
    categoryID = "",
    level = "",
  }) => {
    try {
      //debugger;
      const numericCategoryID = categoryID?.match(/^\d+/)?.[0] || "";

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        site: site || "",
        categoryID: numericCategoryID || "",
        optimizedListing: "true", 
      });

      if (level !== null && numericCategoryID) {
        params.append("level", level);
      }

      const url = `https://api.help-on-time.com/api/datacube/summary/fitment?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setListingOpDashboardScore(data.fitmentScore || HARDCODED_VALUES.listingOptimizationScore)
      dispatch(setListingOptimizationScore(data.fitmentScore || HARDCODED_VALUES.listingOptimizationScore))
      
      // console.log("Fitment Summary Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching fitment summary:", error);
      // Use hardcoded value on error
      setListingOpDashboardScore(HARDCODED_VALUES.listingOptimizationScore);
      dispatch(setListingOptimizationScore(HARDCODED_VALUES.listingOptimizationScore));
    }
  };
  
  useEffect(() => {
    //debugger;
    const fetchData = async () => {
      await fetchListingOptimizationScore({
        pageNumber: 1,
        pageSize: 50,
        site: "", // 
        categoryID: "", 
        // optimizedListing: "true", 
      });
    };
  
    fetchData();
  }, []); // Add 

  const handleLinkEbay = () => {
    setShowWelcomeDialog(false);
    navigate("/connect-ebay"); // Or your eBay OAuth route
  };

  type Platform = 'ebay' | 'shopify' | 'temu' | 'allegro';
const handleChange = (event:any) => {
    const selectedPlatform = event.target.value as Platform;

  const platformUrls = {
    ebay: 'https://auth.ebay.com/oauth2/authorize?state=GUID:8258dd0a-e29a-49a4-92dc-35308e7a8df2&client_id=AndrewRo-Emotived-PRD-3786bc793-b1c0583d&response_type=code&redirect_uri=Andrew_Rowson-AndrewRo-Emotiv-hnvajdx&scope=https://api.ebay.com/oauth/api_scope/sell.marketing.readonly%20https://api.ebay.com/oauth/api_scope/sell.marketing%20https://api.ebay.com/oauth/api_scope/sell.inventory.readonly%20https://api.ebay.com/oauth/api_scope/sell.inventory%20https://api.ebay.com/oauth/api_scope/sell.account.readonly%20https://api.ebay.com/oauth/api_scope/sell.account%20https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly%20https://api.ebay.com/oauth/api_scope/sell.fulfillment%20https://api.ebay.com/oauth/api_scope/sell.analytics.readonly%20https://api.ebay.com/oauth/api_scope/sell.finances%20https://api.ebay.com/oauth/api_scope/sell.payment.dispute%20https://api.ebay.com/oauth/api_scope/commerce.identity.readonly&prompt=login',
    shopify: 'https://accounts.shopify.com/store-login',
    temu: 'https://www.temu.com/login.html',
      allegro: 'https://allegro.com/log-in'
  };

  const url = platformUrls[selectedPlatform];

  if (url) {
    window.open(url, '_blank'); // open in a new tab
  }
};


  // Use hardcoded data as fallback

  const displayFitmentData = summaryFitmentData || hardcodedFitmentData;


  return (
    <div
      className={isOpenModal ? "overflow-y-hidden" : ""}
      //  className='overflow-y-hidden'
    >
      {/* Navbar Section */}  
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6 ">
        <Navbar />
      </div>
  
      <div className="p-[25px] ">
        <div className="flex gap-[30px] flex-row">
          {/* Listing Optimization Section */}
          <div
            className={`${isToggle ? "flex flex-col gap-4" : "flex flex-row"}`}
          >
            <div
              // className="flex flex-col gap-[30px] w-[270px]"
              className={`${
                isToggle ? "hidden" : "flex flex-col gap-[30px] w-[270px]"
              }`}
            >
              <div className="w-full flex gap-[30px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105 ">
                <div className="flex flex-col w-[250px] items-center">
                  <div className="border border-borderColor rounded-[15px] p-2.5 flex flex-col h-[350px]">
                    <p className="text-lg text-center text-[#0F0C22] font-poppins font-medium">
                      Listing Optimization
                      <Tooltip title="This identifies and confirms your enhanced eBay listings with strong titles, images, item specifics, and pricing to show you what changes you can make to improve sales">
                        <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                      </Tooltip>
                    </p>
                    <CircularProgressBar 
                      percentage={22} 
                    />
                    <div className="flex gap-[10px] mt-10 relative top-20 text-center justify-center">
                      <Link
                        to="/listingOptimizationSummary"
                        className="px-5 py-2.5 font-semibold mt-3 bg-[#ED1F24] text-white font-poppins text-xs rounded-[15px]"
                      >
                        View Optimization Summary
                        <Tooltip title="Free - more detailed analysis of your Listing Optimization Score">
                          <InfoIcon style={{ fontSize: 11 }} />
                        </Tooltip>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FITMENT ADOPTION Section */}
            <div
              className={`${
                isToggle ? "flex flex-col w-[260px]" : "flex flex-col w-[270px]"
              }`}
            >
              <div className="border border-borderColor p-2.5 flex flex-col h-[350px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <p className="text-lg text-center text-[#0F0C22] font-poppins font-medium ">
                  Fitment Adoption
                  <Tooltip title="This identifies and confirms your auto parts listings that specifies compatible vehicle makes, models, and years, as a % of your store">
                    <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                  </Tooltip>
                </p>
                <CircularProgressBarTwo
                  percentage={37}
                />
                {/* <FitmentScoreChart /> */}
                <div className="flex gap-[10px] mt-10 relative top-20 text-center justify-center">
                  <button
                    onClick={handleNotSellerDetails}
                    className="px-5 py-2.5 font-semibold mt-3 bg-[#ED1F24] text-white font-poppins text-xs rounded-[15px]"
                  >
                    {isToggle ? "View Summary Table" : "View Fitment Summary"}{" "}
                    <Tooltip
                      title="Free - more detailed analysis of your Fitment Adoption score"
                    >
                      <InfoIcon style={{ fontSize: 11 }} />
                    </Tooltip>
                  </button>
                </div>
              </div>

              {/* fitment score chart */}
              {isToggle ? (
                <div className="border  mt-6 border-borderColor p-2.5 flex flex-col h-[300px] rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                  <FitmentScoreChart />
                </div>
              ) : (
                " "
              )}
            </div>
          </div>

          {/* Right Table: eBay Seller Details */}
          {!isToggle ? (
            <div
              className={`border border-borderColor rounded-[15px] p-[25px] min-h-[350px] mb-10 bg-[#F4FFF1] ${
                isToggle ? "min-w-[950px]" : "min-w-[650px]"
              } static z-[0]`}
            >
              <>
                <div className="flex justify-between  w-full mb-6">
                  {/* eBay Seller Details (Left) */}
                  <p className="text-lg text-[#0F0C22] font-poppins font-medium">
                   <img src={shopifyLogo} alt="ebay Logo" width={100} height={30} />
                  </p>

                  <div className="flex flex-col items-end gap-y-4">
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: 220,
                        bgcolor: "#fff",
                        color: "#0F0C22",
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        borderRadius: "15px",
                        boxShadow: 1,
                        "& .MuiInputBase-root": {
                          borderRadius: "15px",
                        },
                        "& .MuiInputLabel-root": {
                          borderRadius: "15px",
                          backgroundColor: "white",
                          px: 1,
                          mx: 1,
                        },
                      }}
                      style={{ minWidth: 220 }}
                      className="bg-white rounded-[10px] shadow-sm"
                    >
                      <InputLabel id="platform-select-label" style={{ color: "#0F0C22",
                          fontFamily: "Poppins",
                          fontWeight: 500,}}>Link Your Store</InputLabel>
                      <Select
                        labelId="platform-select-label"
                        // value={platform}
                        label="Link Your Store"
                        onChange={handleChange}
                      >
                        <MenuItem value="ebay">Link with eBay Store</MenuItem>
                        <MenuItem value="shopify">Link with Shopify Store</MenuItem>
                        <MenuItem value="temu">Link with Temu Store</MenuItem>
                          <MenuItem value="allegro">Link with Allegro Store</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                 <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500  tracking-wider border-b">
              Shopify Seller
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500  tracking-wider border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ShipFast Express
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            Listing Download Pending
              </td>
            </tr>
            {/* <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Savings Account
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $8,750.50
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Credit Card
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-red-600">
                -$1,234.75
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
              </>
            </div>
          ) : (
            <div className="border border-borderColor rounded-[15px] p-[25px] min-w-[950px] min-h-[330px] static z-[0]">
              <SummaryFitmentTable
                categories={displayFitmentData?.categories}
                setPaginationCurrentPage={setCurrentPage}
              />

              {/* Pagination for Fitment Table */}
              {(displayFitmentData?.fitmentCount || 0) > 1 && (
                <div className="flex flex-col items-end mt-[18px]">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={displayFitmentData?.fitmentCount || 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* New row for Dashboard Table Two */}
        {!isToggle && (
          <div
            className={`${
              isTableVisible ? "block" : "hidden"
            } w-full mt-1 relative overflow-hidden`}
          >
           <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
      <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: '1px solid #ccc' }}><strong>Date</strong></TableCell>
            <TableCell sx={{ border: '1px solid #ccc' }}><strong>Description</strong></TableCell>
            <TableCell sx={{ border: '1px solid #ccc' }}><strong>Status</strong></TableCell>
            <TableCell sx={{ border: '1px solid #ccc' }}><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {optimizationHistory.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: '1px solid #ccc' }}>{row.date}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{row.description}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{row.status}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>
                <Button variant="outlined" size="small">{row.action}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </div>
        )}
      </div>

      {/* Support Message */}
      <div style={{ position: "sticky", zIndex: "2000" }}>
        <SupportMessage />
      </div>
      
      <div>
        {isNewUser && (
          <WelcomeUser
            open={showWelcomeDialog}
            onClose={() => setShowWelcomeDialog(false)}
            onLinkEbay={handleLinkEbay}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardShopify;