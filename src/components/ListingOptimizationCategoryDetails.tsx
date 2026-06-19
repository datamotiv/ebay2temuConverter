import { listingCategoryDetailsTableHead } from "../utils/data";
import { useParams, useNavigate } from "react-router";
import {
  useSummaryFitmentDetailsMutation,
  // useFitmentOptimizedMutation,
} from "../Redux/features/summary/summaryApi";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
// import Tooltip from "@mui/material/Tooltip";
import ListingOptimizationScore from "../pages/ListingOptimizationScore";
import ListingCountryCategoryOptimizationScoreChart from "./ListingCountryCategoryOptimizationScoreChart";
import ListingCategoryTable from "./ListingCategoryTable";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { loadStripe } from "@stripe/stripe-js";

const ListingOptimizationCategoryDetails = () => {
  const { id, categoryId, site } = useParams();
  const navigate = useNavigate();
  const [getFitmentDetails, { data, isLoading, isSuccess, isError }] =
    useSummaryFitmentDetailsMutation();
  // const [, { isLoading: isOptimizing }] =
  //   useFitmentOptimizedMutation();
  const [bodyItems, setBodyItems] = useState([]);
  // const [, setSelectedItems] = useState<number[]>([]);
  const [currentPage] = useState(() => 1); // avoids inference warning
  const [, setTotalPages] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const listingOptimizationScore = useSelector(
    (state: RootState) =>
      state.setListingOptimizationScore.listingOptimizationScore ?? 0
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  //   const [, setIsModalOpen] = useState(false);
  // const [, setOptimizeRequestId] = useState(0);
  // const [, setTotalAmountString] = useState("");
  // const [, setDueNowString] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  // const [, { isLoading: isOptimizing }] = useFitmentOptimizedMutation();
  const [optimizationSelections, setOptimizationSelections] = useState<{
    [listingId: string | number]: string[]; // or number if IDs are numbers
  }>({});
  const [couponCode, setCouponCode] = useState("");
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openLPDialog, setOpenLPDialog] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // const DEFAULT_OPTIMIZATION_TYPE = "Item Specifics";



  // console.log(optimizationSelections, "testddta");

  // const handleCheckout = () => {
  //   setOpen(true); // open the dialog instead of redirecting
  // };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleInputChange = (e: any) => {
  //   const { name, value } = e.target;

  //   setState((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleInputFocus = (e: any) => {
  //   setState((prev) => ({ ...prev, focus: e.target.name }));
  // };

  // const handlePayClick = async () => {
  //   try {
  //     // const result = await acceptOptimize({
  //     //   searchId: optimizeRequestId,
  //     // }).unwrap();
  //     // console.log(result);
  //   } catch (error) {
  //     console.error("Error optimizing:", error);
  //   }
  //   setIsModalOpen(false);
  // };

  const pageSize = 100;

  useEffect(() => {
    getFitmentDetails({
      searchResultId: id,
      pageNo: currentPage,
      pageSize,
      categoryId,
      site,
    });
  }, [id, getFitmentDetails, currentPage, pageSize]);

  useEffect(() => {
    if (isSuccess && data) {
      setBodyItems(data || []);
      const totalItems = data.totalItems || data.length;
      setTotalPages(Math.ceil(totalItems / pageSize));
    }
  }, [data, isSuccess]);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // const handleOptimize = async () => {
  //   try {
  //     const result = await optimizeFitment({
  //       all: false,
  //       ids: selectedItems,
  //       categoryId: categoryId,
  //       site: site,
  //       searchId: id,
  //     }).unwrap();
  //     if (result) {
  //       setTotalAmountString(result?.totalCostString);
  //       setOptimizeRequestId(result?.optimizeRequestId);
  //       setDueNowString(result?.dueNowString);
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error optimizing:", error);
  //   }
  // };

  // const handleOptimizeAll = async () => {
  //   debugger;
  //   try {
  //     const result = await optimizeFitment({
  //       all: true,
  //       ids: selectedItems,
  //       categoryId: categoryId,
  //       site: site,
  //       searchId: id,
  //     }).unwrap();
  //     if (result) {
  //       setTotalAmountString(result?.totalCostString);
  //       setOptimizeRequestId(result?.optimizeRequestId);
  //       setDueNowString(result?.dueNowString);
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error optimizing:", error);
  //   }
  // };

  //stripe publising key here
  const stripePromise = loadStripe("pk_live_arybZQDhMxwpvEOWhEgeqLF5");

  // Strip checkout logic here
  // const handleCheckout = () => {
  //   window.open("https://emotivonline.com/contact/", "_blank", "noopener,noreferrer");
  // };

  // const openDialogBox = () => {
  //   setOpenDialog(true);
  // };

  const handleCheckout = async () => {
    // debugger;

    try {
      const token = localStorage.getItem("accessToken");
      // console.log(token);
      const response = await fetch(
        "https://api.help-on-time.com/api/datacube/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            all: true,
            ids: selectedItems,
            categoryId: categoryId,
            site: site,
            searchId: id,
            coupon: couponCode || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const session = await response.json(); // Get session ID from backend

      const stripe = await stripePromise;

      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
      setOpenDialog(false);

      await stripe.redirectToCheckout({ sessionId: session.sessionId }); // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

// new code when optimization type has not selected
//   const optimizationTypes = selectedItems.reduce((acc:any, itemId:any) => {
//   const key = String(itemId);
//   const selectedTypes = optimizationSelections[key];

//   acc[key] =
//     selectedTypes && selectedTypes.length > 0
//       ? selectedTypes
//       : [DEFAULT_OPTIMIZATION_TYPE];

//   return acc;
// }, {});


  // working code and it is commented temporairly
  const handleCheckoutForSelectedItems = async () => {
    debugger;

   if (!couponCode.trim()) {
    setOpenCouponDialog(true);
    return;
  }

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        all: false,
        ids: selectedItems,
        categoryId: categoryId,
        site: site,
        searchId: id,
        coupon: couponCode || null,
        optimizationTypes: selectedItems.reduce((acc: any, itemId: any) => {
          debugger;
          const key = String(itemId);
          acc[key] = optimizationSelections[key] || [];
          return acc;
        }, {}),
      };

      console.log("Selected Items:", selectedItems);
      console.log("Optimization Selections:", optimizationSelections);
      console.log("Payload being sent to backend:", payload); // 🔍 Log the full payload

      const response = await fetch(
        "https://api.help-on-time.com/api/datacube/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            all: false,
            ids: selectedItems,
            categoryId: categoryId,
            site: site,
            searchId: id,
            coupon: couponCode || null,
            optimizationTypes: selectedItems.reduce((acc: any, itemId: any) => {
              acc[itemId] = optimizationSelections[itemId] || [];
              return acc;
            }, {}),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response, "testctat");
      const session = await response.json(); // Get session ID from backend

      const stripe = await stripePromise;

      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }

      if (session.free) {
  navigate("/payment-success-page"); 
  return;
}
      await stripe.redirectToCheckout({ sessionId: session.sessionId }); // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // letst code for migratuion 
//  const validateMigration = async () => {
//   debugger;
//   try {
//     const response = await fetch(
//       `http://localhost:4000/api/v1/migrations/validate?sellerId=${1}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           listings: selectedItems.map((id) => ({
//             sourceListingId: String(id), // 👈 pass real eBay Item ID
//           })),
//         }),
//       }
//     );

//     const data = await response.json();
//     console.log("API response:", data);
//   } catch (error) {
//     console.error("Error calling API:", error);
//   }
// };

 // TEMP FIX: Showing dialog instead of checkout
// LP is not available in this plan

// const handleTempLPClick = () => {
//   setOpenLPDialog(true);
// };

  if (isError) return <div>Error loading data</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-col gap-[10px] p-[25px] relative w-full">
        {/* Top Section: CircularProgress + Fitments + Back Button */}
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-[30px]">
            <div className="flex flex-col gap-6">
              {/* CircularProgressBar on Left */}
              <div className="border  border-borderColor rounded-[15px] p-2.5 w-[280px] h-[320px]">
                <p className="text-md font-semibold text-[#0F0C22] text-center font-poppins">
                  Listing Optimization
                </p>
                <ListingOptimizationScore
                  percentage={listingOptimizationScore}
                />
              </div>

              {/* fitment category score chart */}
              <div className="border  border-borderColor p-2.5 w-[280px] h-[320px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <ListingCountryCategoryOptimizationScoreChart />
              </div>
            </div>

            {/* Right Side: Fitments, Tooltip & Buttons */}
            <div className="flex flex-col gap-3 w-full">
              {/* Typography with Tooltip */}
              <div className="flex items-center justify-between gap-3">
                {/* <h6 className="font-medium font-poppins">Fitments</h6>
                <Tooltip title="info" color="white">
                  <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                </Tooltip> */}
                <button
                  onClick={() => navigate(-1)}
                  className="ml-auto flex items-center justify-center text-xs gap-1 text-secondary bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              </div>

              {/* Optimize Buttons */}
              <div className="flex items-center justify-between w-full">
                {/* Optimize Buttons Container */}
                <div className="flex gap-2">
                  {/* <button
                    // onClick={handleOptimize}
                    onClick={handleCheckoutForSelectedItems}
                    // className={`max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins  rounded-[5px] border flex items-center border-gray-400 text-red-600 gap-2 transition-all duration-200 ease-in-out
                    //   ${
                    //     selectedItems.length < 1 || selectedItems.length > 5 || isOptimizing
                    //       ? "bg-gray-300 border-gray-400 text-red-600 cursor-not-allowed"
                    //       : "bg-[#2e6f40] hover:bg-green-700 border-green-700"
                    //   }
                    //   `
                    // }
                    className={`max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins  rounded-[5px] border flex items-center bg-gray-300 border-gray-400 text-red-600 gap-2 transition-all duration-200 ease-in-out
          
                      `}
                    // disabled={isOptimizing}
                    // disabled={
                    //   selectedItems.length < 1 || selectedItems.length > 5 || isOptimizing
                    // }
                    // disabled
                  >
                    <Tooltip title="Add selected items for Listing Optimization">
                      <span>{isOptimizing ? "Optimizing..." : "Optimize"}</span>
                    </Tooltip>
                  </button> */}
                  {/* <button
                    // onClick={handleOptimizeAll}
                    onClick={openDialogBox}
                    className="max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins bg-gray-300 border-gray-400 text-red-600 rounded-[5px] border flex items-center gap-2"
                    // disabled={isOptimizing}
                    // disabled
                  >
                    <Tooltip title="Apply Listing Optimization to All Items">
                      <span>
                        {isOptimizing ? "Optimizing..." : "Optimize All"}
                      </span>
                    </Tooltip>
                  </button> */}

                   <input
      type="text"
      value={couponCode}
      // disabled={!couponCode.trim()}
      placeholder="Enter coupon code"
      onChange={(e) => setCouponCode(e.target.value)}
      // className="px-2 py-1 text-xs border border-gray-400 rounded-[5px] outline-none"
      className={`px-3 py-1.5 text-xs font-medium font-poppins rounded-[5px] transition-all 
    ${couponCode.trim()
      ? "text-white hover:bg-blue-600 focus:bg-gray-700"
      : "bg-gray-300 text-gray-500  focus:bg-gray-300"
    }`}
    />

    <button
       onClick={handleCheckoutForSelectedItems}
      // onClick={handleTempLPClick}
      className="px-3 py-1.5 text-xs font-medium font-poppins bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-all"
    >
      Submit
    </button>

    {/* lateest code for migration */}
    <button
      //  onClick={validateMigration}
      className="px-3 py-1.5 text-xs font-medium font-poppins bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-all"
    >
      Migrate 
    </button>

    <span className="text-[11px] text-gray-600 leading-tight mt-2">
    Please select an optimization type for every selected listing, and then click Submit.
  </span>
                </div>

                {/* Back Button on Extreme Right */}
                {/* <button
                  onClick={() => navigate(-1)}
                  className="ml-auto flex items-center justify-center text-xs gap-1 text-secondary bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={15} /> Back
                </button> */}
              </div>

              <div className="mt-1 w-full">
                <ListingCategoryTable
                  headerItems={listingCategoryDetailsTableHead}
                  bodyItems={bodyItems}
                  onSelectItemsChange={setSelectedItems}
                  onOptimizeAll={handleCheckout}
                  optimizationSelections={optimizationSelections}
                  setOptimizationSelections={setOptimizationSelections}
                />

                <div className="flex w-full justify-between items-center mt-5">
                  {/* <div className="flex gap-3">
                    <button
                      onClick={handleOptimize}
                      className="max-w-[120px] px-3 py-1.5 text-xs font-medium font-poppins text-white bg-[#2e6f40] rounded-[5px] border border-borderGreen flex items-center gap-2"
                      disabled={isOptimizing}
                    >
                      <Tooltip title="Add selected items to have fitment adopted ">
                        <span> {isOptimizing ? "Adopting." : "Adopt"}</span>
                      </Tooltip>
                    </button>
                    <button
                      onClick={handleOptimizeAll}
                      className="max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins text-white bg-[#2e6f40] rounded-[5px] border border-borderGreen flex items-center gap-2"
                      disabled={isOptimizing}
                    >
                      <Tooltip
                        title="Add fitment to all items 

"
                      >
                        <span> {isOptimizing ? "Adopting." : "Adopt All"}</span>
                      </Tooltip>
                    </button>
                  </div> */}

                  {/* Right: Pagination */}
                  {/* <div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Table & Pagination */}
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                maxWidth: "450px",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <DialogTitle
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1F2937",
                  pb: 0,
                }}
              >
                Listing Optimization Help
              </DialogTitle>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                color: "#4B5563",
                mt: 1,
              }}
            >
              <Typography>
                {/* Need help improving your listings?{" "} */}
                <strong>
                  Our team can optimize them for better visibility and
                  performance.
                </strong>{" "}
                Just{" "}
                <Link
                  href="https://emotivonline.com/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    fontWeight: 500,
                    color: "#2563EB",
                  }}
                >
                  get in touch with us
                </Link>{" "}
                and we’ll take care of the rest.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ pt: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "#9CA3AF",
                  color: "#374151",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                    borderColor: "#6B7280",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* dialogue for optimization all */}
        <div>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 2,
                textAlign: "center",
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" color="error">
                Apply Optimization to All Selected Listings
              </Typography>
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" sx={{ mt: 1 }}>
                This will apply the following optimizations to all listings:
              </Typography>

              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                <Typography
                  component="li"
                  variant="body2"
                  color="text.secondary"
                >
                  Smart title updates to improve visibility
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="text.secondary"
                >
                  Enhanced descriptions for better engagement
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="text.secondary"
                >
                  Improved item specifics for accurate search results
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
              <Button
                onClick={() => setOpenDialog(false)}
                variant="contained"
                sx={{
                  px: 4,
                  borderRadius: 2,
                  color: "black",
                  backgroundColor: "#fff",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                variant="contained"
                sx={{ px: 4, borderRadius: 2, backgroundColor: "#EB232E" }}
              >
                Optimize All Items
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* dialogue for alert if coupon code is not write */}
        <Dialog open={openCouponDialog} onClose={() => setOpenCouponDialog(false)}>
  <DialogTitle>Coupon Code Required</DialogTitle>

  <DialogContent>
    <p className="text-sm text-gray-700">
      Please enter a coupon code before submitting.
    </p>
  </DialogContent>

  <DialogActions>
    <button
      onClick={() => setOpenCouponDialog(false)}
      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      OK
    </button>
  </DialogActions>
</Dialog>

{/* dialog for temp fix saying LP is not availablbe in this plan */}

<div>
  <Dialog
  open={openLPDialog}
  onClose={() => setOpenLPDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Feature Not Available</DialogTitle>

  <DialogContent>
    <Typography variant="body2">
      Listing Optimization is not available in this plan 
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      variant="contained"
      onClick={() => setOpenLPDialog(false)}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>

</div>

      </div>
    </div>
  );
};

export default ListingOptimizationCategoryDetails;
