import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import hooks for navigation and state
import Navbar from "../components/Navbar";
import SupportMessage from "../components/SupportMessage"; // Adjust the import path as necessary
import {
  useSummaryFitmentQuery,
  useSummaryQuery,
} from "../Redux/features/summary/summaryApi";
import { useAppSelector } from "../Redux/hooks";
import Pagination from "../components/Pagination"; // Import Pagination component
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import ListingCountryCategoryOptimizationScoreChart from "../components/ListingCountryCategoryOptimizationScoreChart";
import ListingOptimizationScore from "./ListingOptimizationScore";
import SummaryListingOptimizationTable from "../components/summaryFitmentTable/summaryListingOptimizationTable";
import {

  setSummaryFitmentCategories,

  setCategoryFilter,

  setListingCountryScore,
  setListingOptimizationScore
} from "../Redux/features/fitmentScoreSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const ListingOptimizationSummary = () => {
  const { data: summaryData } = useSummaryQuery({});
  // const { data: inboxData } = useInboxQuery({});

  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpenModal } = useAppSelector((state) => state.paymentModal);

  // Restore `isToggle` from the state or default it to `false`
  const isToggle = useState(location.state?.isToggle || false);
  const [, setScore] = useState(summaryData?.score);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const { data: summaryFitmentData, refetch } = useSummaryFitmentQuery({
    pageNumber: currentPage,
    pageSize: 50,
  });

  const selectedSite = useSelector((state: any) => state.fitment.selectedSite || "");
    const selectedCategory = useSelector((state: any) => state.fitment.selectedCategory || "");
    const selectedPath = useSelector((state: any) => state.fitment.selectedPath || "");

   const listingOptimizationScore = useSelector((state:RootState) => state.setListingOptimizationScore.listingOptimizationScore  ?? 0);

   useEffect(() => {
    if (summaryData) {
      setScore(summaryData.score);
    }
  }, [summaryData]);

    useEffect(() => {
      refetch();
    }, [currentPage, refetch]);

    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      fetchSummaryFitment({
        pageNumber,
        pageSize: 50,
        site: selectedSite,
        categoryID: selectedCategory,
        getPageOnly: true,
        path: selectedPath,
      });
    };
  

  const fetchSummaryFitment = async ({
    pageNumber = 1,
    pageSize = 50,
    site = "",
    categoryID = "",
    level = "",
    getPageOnly = false,
    path = "",
  }: {
    pageNumber?: number;
    pageSize?: number;
    site?: string;
    categoryID?: string;
    level?: string;
    optimizedListing?: boolean;
    getPageOnly?: boolean; // ✅ Add this
    path?: string;  
  }) => {
    try {
      const numericCategoryID = categoryID?.match(/^\d+/)?.[0] || "";

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        site: site || "",
        categoryID: numericCategoryID || "",
        optimizedListing: "true",
        getPageOnly: getPageOnly.toString(),
        path: path,
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
        dispatch(setCategoryFilter(data.categoryFilter));
        dispatch(setListingCountryScore(data.categoryFitmentScore));
        dispatch(setListingOptimizationScore(data.fitmentScore));
      }
     
      return data;
    } catch (error) {
      console.error("Error fetching listing optimization fitment:", error);
    }
  };

   useEffect(() => {
      fetchSummaryFitment({
        pageNumber: 1,
        pageSize: 50,
        site: "",
        categoryID: "",
        level: "",
        optimizedListing: true,
      });
    }, []);

  return (
    <div className={isOpenModal ? "overflow-y-hidden" : ""}>
      {/* Navbar Section */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-6">
        <Navbar />
      </div>

      <div className="p-[25px]">
        <div className="flex gap-[30px] flex-row">
          {/* Listing Optimization Section */}
          <div
            className={`${
              isToggle ? "flex flex-col gap-4" : "flex flex-col gap-4"
            }`}
          >
            {/* FITMENT ADOPTION Section */}
            <div
              className={`${
                isToggle ? "flex flex-col w-[260px]" : "flex flex-col w-[270px]"
              }`}
            >
              <div className="border  border-borderColor  p-2.5 flex flex-col h-[300px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <p className="text-md text-center text-[#0F0C22] font-poppins font-semibold">
                  Listing Optimization
                  <Tooltip title="This identifies and confirms your auto parts listings that specifies compatible vehicle makes, models, and years, as a % of your store">
                    <InfoIcon
                      style={{
                        fontSize: 11,
                        color: "grey",
                        paddingLeft: "1px",
                      }}
                    />
                  </Tooltip>
                </p>
                <ListingOptimizationScore
                percentage={listingOptimizationScore}
                />
              </div>
            </div>

            {/* fitment score chart */}
            <div
              className={`${
                isToggle ? "flex flex-col w-[260px]" : "flex flex-col w-[270px]"
              }`}
            >
              <div className="border  border-borderColor  p-2.5 flex flex-col h-[330px]  rounded-[12px] transition-all duration-300 ease-in-out hover:scale-105">
                <ListingCountryCategoryOptimizationScoreChart />
              </div>
            </div>
          </div>

          {/* Right Table: eBay Seller Details */}

          <div className="border border-borderColor rounded-[15px] p-[25px] min-w-[950px] min-h-[330px] static z-[0]">
            <SummaryListingOptimizationTable
                 categories={summaryFitmentData?.categories}
                 fetchSummaryFitment={fetchSummaryFitment}
                 setPaginationCurrentPage={setCurrentPage}
            />

            {/* Pagination for Fitment Table */}
            {summaryFitmentData?.fitmentCount > 1 && (
              <div className="flex flex-col items-end mt-[18px]">
                <Pagination
                  currentPage={currentPage}
                  totalPages={summaryFitmentData?.fitmentCount || 1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support Message */}
      <div style={{ position: "sticky", zIndex: "2000" }}>
        <SupportMessage />
      </div>
    </div>
  );
};

export default ListingOptimizationSummary;
