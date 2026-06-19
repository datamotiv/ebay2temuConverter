import CategoryTable from "./CategoryTable";
import CircularProgressBarTwo from "./CircularProgressBarTwo";
import { categoryDetailsTableHead } from "../utils/data";
import { useParams, useNavigate } from "react-router";
import {
  // useSummaryFitmentDetailsMutation,
  // useFitmentOptimizedMutation,
  useSummaryFitmentQuery,
} from "../Redux/features/summary/summaryApi";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react"; 
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import FitmentScoreChart from "./FitmentScoreChart";
import { loadStripe } from "@stripe/stripe-js";
import {useSelector, useDispatch} from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { setCategoryFitmentScore, setSummaryFitmentCategories } from "../Redux/features/fitmentScoreSlice";


const CategoryDetails = () => {
  const { id, categoryId, site } = useParams();
  const navigate = useNavigate();
  // const [getFitmentDetails, { data, isLoading, isSuccess, isError }] =
  //   useSummaryFitmentDetailsMutation();
  const { data: summaryFitmentData } = useSummaryFitmentQuery({
    pageNumber: 1,
    pageSize: 50,
  });
  // const [, { isLoading: isOptimizing }] =
  //   useFitmentOptimizedMutation();
  const [bodyItems, setBodyItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage] = useState(() => 1); // avoids inference warning
  const [, setTotalPages] = useState<number>(1);
  const [fitmentFilter, setFitmentFilter] = useState(2); // Default fitmentFilter
  const selectedLevel = useSelector((state: any) => 
    state.setSelectedLevel?.selectedLevel
  );
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [couponCode, setCouponCode] = useState("");
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);


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

  // useEffect(() => {
  //   debugger;
  //   getFitmentDetails({
  //     searchResultId: id,
  //     pageNo: currentPage,
  //     pageSize,
  //     categoryId,
  //     site,
      
  //   });
  // }, [id, getFitmentDetails, currentPage, pageSize,]);

  // useEffect(() => {
  //   if (isSuccess && data) {
  //     setBodyItems(data || []);
  //     const totalItems = data.totalItems || data.length;
  //     setTotalPages(Math.ceil(totalItems / pageSize));
  //   }
  // }, [data, isSuccess,fitmentFilter]);
 

  useEffect(() => {
    // debugger;
    if (id && categoryId && site && fitmentFilter) {
      // You can call an initial API here if needed
      fetchSummaryFitmentDetails(id, categoryId, site, fitmentFilter);
    }
  }, [id, categoryId, site, fitmentFilter])

    
  if( selectedLevel ){
    useEffect(()=> {
      fetchSelectedCategoryScore({
        pageNumber: 1,
        pageSize: 50,
        categoryID: categoryId, 
        level: selectedLevel,         
        getPageOnly: false,
        path: "",       
      })
    },[selectedLevel, categoryId])
  }

    // new code after UAT
     const fetchSummaryFitmentDetails = async (id: string, categoryId: string, site: string, fitmentFilter: number) => 
      {
        const token = localStorage.getItem("accessToken");
        // debugger;
        try {
        const response = await fetch("https://api.help-on-time.com/api/datacube/summary/fitment/detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            searchResultId: id,
            pageNo: currentPage,
            pageSize,
            categoryId,
            site,
            fitmentFilter,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Error fetching fitment details");
        }
    
        const data = await response.json();
        // console.log(data, 'cat data')
        setBodyItems(data || [])
        const totalItems = data.totalItems || data.length || 0;
        setTotalPages(Math.ceil(totalItems / pageSize));

        // Get the score for the category
        const scoreResponse = await fetch(`https://api.help-on-time.com/api/datacube/summary/fitment?categoryID=${categoryId}&level=-1`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });

        if (!scoreResponse.ok) {
          throw new Error("Error fetching fitment details");
        }

        const scoreData = await scoreResponse.json();
        dispatch(setCategoryFitmentScore(scoreData.categoryFitmentScore))
// console.log(data, 'non fit,e')
        return data; // You can handle the data accordingly
        
      } catch (error) {
        console.error("Error fetching fitment details:", error);
        throw error; // You can throw the error to handle it in your UI as needed
      }
    };
    


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
  const stripePromise = loadStripe(
    "pk_live_arybZQDhMxwpvEOWhEgeqLF5"
  );

  // Strip checkout logic here
  // const handleCheckout = async () => {
  //   //debugger;

  //   try {
  //     const token = localStorage.getItem("accessToken");
      
  //     const response = await fetch(
  //       "https://api.help-on-time.com/api/datacube/create-checkout-session",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           all: true,
  //           ids: selectedItems,
  //           categoryId: categoryId,
  //           site: site,
  //           searchId: id,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const session = await response.json(); // Get session ID from backend
  //     // console.log(session, 'sessionbck')

  //     const stripe = await stripePromise;

  //     if (!stripe) {
  //       console.error("Stripe failed to load.");
  //       return;
  //     }

  //      if (session.free) {
  // navigate("/payment-success-page"); 
  // return;}

  //     await stripe.redirectToCheckout({ sessionId: session.sessionId }); // Redirect to Stripe Checkout
  //   } catch (error) {
  //     console.error("Checkout failed:", error);
  //   }
  // };

  const optimizationTypes = selectedItems.reduce((acc:any, itemId:any) => {
  acc[String(itemId)] = ["Item Specifics"];
  return acc;
}, {});


  const handleCheckoutForSelectedItems = async () => {
    // debugger;

     if (!couponCode.trim()) {
    setOpenCouponDialog(true);
    return;
  }

  setIsLoading(true); 

    try {
      const token = localStorage.getItem("accessToken");

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
            optimizationTypes
            // coupon: "ebay-2025"
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
  if (session.free) {
    setIsLoading(false);
  navigate("/payment-success-page"); 
  return;}
  
      await stripe.redirectToCheckout({ sessionId: session.sessionId }); // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  if (isError) return <div>Error loading data</div>;
  // if (isLoading) return <div>Loading...</div>;


  //new call
    const fetchSelectedCategoryScore = async ({
      pageNumber = 1,
      pageSize = 50,
      // site = "",
      categoryID = "",
      level = "",
      getPageOnly = false,
      path = "",
    }) => {
      try {
        const numericCategoryID = categoryID?.match(/^\d+/)?.[0] || "";
  
        const params = new URLSearchParams({
          page: pageNumber.toString(),
          size: pageSize.toString(),
          // site: "",
          categoryID: numericCategoryID || "",
          getPageOnly: getPageOnly.toString(),
          path: path,
          level: selectedLevel
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
        if (data.categories) {
          dispatch(setSummaryFitmentCategories(data.categories));
        }
  
        if (!getPageOnly) {
          dispatch(setCategoryFitmentScore(data.categoryFitmentScore))
        }
        return data;
      } catch (error) {
        console.error("Error fetching fitment summary:", error);
        setIsError(true);
      } finally{
        setIsLoading(false);
      }
    };

 

  return (
    <div>
        {isLoading && (
  <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
    <div className="bg-white px-6 py-4 rounded-md shadow-lg text-sm font-medium">
    Redirecting to the secure payment page. Please wait…
    </div>
  </div>
)}

      <div className="flex flex-col gap-[10px] p-[25px] relative w-full">
        {/* Top Section: CircularProgress + Fitments + Back Button */}
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-[30px]">
            <div className="flex flex-col gap-6">
              {/* CircularProgressBar on Left */}
              <div className="border border-borderColor rounded-[15px] p-2.5 w-[280px] h-[320px]">
                <p className="text-lg text-center text-[#0F0C22] font-poppins font-medium mb-2">
                  Fitment Adoption
                </p>
                <CircularProgressBarTwo
                  percentage={summaryFitmentData?.fitmentScore}
                />
              </div>

              {/* fitment category score chart */}
              <div className="border  border-borderColor p-2.5 w-[280px] h-[320px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <FitmentScoreChart />
              </div>
            </div>

            {/* Right Side: Fitments, Tooltip & Buttons */}
            <div className="flex flex-col gap-3 w-full">
              {/* Typography with Tooltip */}
              <div className="flex items-center gap-2">
                <h6 className="font-medium font-poppins">Fitments</h6>
                <Tooltip title="info" color="white">
                  <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                </Tooltip>
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
                    className={`max-w-[100px] px-3 py-1.5 text-xs font-medium bg-[#2e6f40] font-poppins text-white rounded-[5px] border flex items-center gap-2 transition-all duration-200 ease-in-out
                      `}
                    // disabled={isOptimizing}
                    // disabled={
                    //   selectedItems.length < 1 || selectedItems.length > 5 || isOptimizing
                    // }
                  >
                    <Tooltip title="Add selected items to have fitment adopted">
                      <span>{isOptimizing ? "Adopting..." : "Adopt"}</span>
                    </Tooltip>
                  </button> */}
                  {/* <button
                    // onClick={handleOptimizeAll}
                    onClick={handleCheckout}
                    className="max-w-[100px] px-3 py-1.5 text-xs font-medium font-poppins bg-gray-300 border-gray-400 text-red-600 rounded-[5px] border flex items-center gap-2 cursor-not-allowed"
                    // disabled={isOptimizing}
                    // disabled
                  >
                    <Tooltip title="Add fitment to all items">
                      <span>{isOptimizing ? "Adopting..." : "Adopt All"}</span>
                    </Tooltip>
                  </button> */}

                   <input
      type="text"
      value={couponCode}
            // disabled={!couponCode.trim()}
      placeholder="Enter coupon code"
      onChange={(e) => setCouponCode(e.target.value)}
      className="px-2 py-1 text-xs border border-gray-400 rounded-[5px] outline-none"
    />

    <button
       onClick={handleCheckoutForSelectedItems}
      className="px-3 py-1.5 text-xs font-medium font-poppins bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-all"
    >
      Submit
    </button>

     <span className="text-[11px] text-gray-600 leading-tight mt-2">
    Please enter a coupon code and then click Submit.
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
                <CategoryTable
                  headerItems={categoryDetailsTableHead}
                  bodyItems={bodyItems}
                  onSelectItemsChange={setSelectedItems}
                  id={id!}
                  categoryId={categoryId!}
                  site={site!}
        fitmentFilter={fitmentFilter}
        setFitmentFilterOne={setFitmentFilter}
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
        
      </div>
    </div>
  );
};

export default CategoryDetails;
