import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import hooks for navigation and state
import CircularProgressBarTwo from "../components/CircularProgressBarTwo";
import Navbar from "../components/Navbar";
import SummaryFitmentTable from "../components/summaryFitmentTable/summaryFitmentTable";
import SupportMessage from "../components/SupportMessage"; // Adjust the import path as necessary
import {
  useSummaryFitmentQuery,
  useSummaryQuery,
} from "../Redux/features/summary/summaryApi";
import { useAppSelector } from "../Redux/hooks";
import Pagination from "../components/Pagination"; // Import Pagination component
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import FitmentScoreChart from "../components/FitmentScoreChart";

import {useDispatch, useSelector} from "react-redux";
import {setCategoryFilter, setCountryFitmentScore, setSummaryFitmentCategories} from "../Redux/features/fitmentScoreSlice";

const FitmentAdoptionSummary = () => {
  const { data: summaryData } = useSummaryQuery({});
  // const { data: inboxData } = useInboxQuery({});

  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpenModal } = useAppSelector((state) => state.paymentModal);

  // Restore `isToggle` from the state or default it to `false`
  const isToggle = useState(location.state?.isToggle || false);
  const [, setScore] = useState(summaryData?.score);
  // const [dataCheck, setDatacheck] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const { data: summaryFitmentData, refetch } = useSummaryFitmentQuery({
    pageNumber: currentPage,
    pageSize: 50,
  });

  const selectedSite = useSelector((state: any) => state.fitment.selectedSite || "");
  const selectedCategory = useSelector((state: any) => state.fitment.selectedCategory || "");
  const selectedPath = useSelector((state: any) => state.fitment.selectedPath || "");

  useEffect(() => {
    if (summaryData) {
      setScore(summaryData.score);
    }
  }, [summaryData]);

  // Refresh the data whenever the page number changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  // Handle page change for pagination
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
  }) => {
    try {
      //debugger;
      const numericCategoryID = categoryID?.match(/^\d+/)?.[0] || "";

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        site: site || "",
        categoryID: numericCategoryID || "",
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
        dispatch(setCountryFitmentScore(data.categoryFitmentScore))
      }
      return data;
    } catch (error) {
      console.error("Error fetching fitment summary:", error);
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
                <p className="text-md text-center text-[#0F0C22] font-poppins font-medium">
                  Fitment Adoption
                  <Tooltip title="This identifies and confirms your auto parts listings that specifies compatible vehicle makes, models, and years, as a % of your store">
                    <InfoIcon style={{ fontSize: 11, color: "grey" }} />
                  </Tooltip>
                </p>
                <CircularProgressBarTwo
                  percentage={summaryFitmentData?.fitmentScore}
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
               
                <FitmentScoreChart />
              </div>
            </div>
          </div>

          {/* Right Table: eBay Seller Details */}

          <div className="border border-borderColor rounded-[15px] p-[25px] min-w-[950px] min-h-[330px] static z-[0]">
            <SummaryFitmentTable
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

export default FitmentAdoptionSummary;
