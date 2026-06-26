import {
  optimizationTableThreeHeaderData,
  optimizationTableTwoHeaderData,
} from "../utils/data";
import Navbar from "../components/Navbar";
import { FormEvent, useState } from "react";
import Optimization from "../components/Optimization";
import OptimizationTableTwo from "../components/OptimizationTableTwo";
import EbaySearchReportTable from "../components/EbaySearchReportTable";
import OptimizationTableThree from "../components/OptimizationTableThree";
import { useSellerDetailQuery } from "../Redux/features/search/searchApi";
import { useParams, useNavigate } from "react-router";
import { useFilterFitmentMutation } from "../Redux/features/summary/summaryApi";
import { ArrowLeft } from "lucide-react"; // Import the back arrow icon
import ProgressBar from "../components/ProgressBar";
import SingleListingScore from "../components/SingleListingScore";

type FitmentType = {
  engine: string;
  make: string;
  model: string;
  year: string;
  trim: string;
};

const EbaySearchReport = () => {
  const [year, setYear] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [filteredFitments, setFilteredFitments] = useState<
    FitmentType[] | null
  >(null); // Modified state to null initially
  const [filterFitment, { isLoading }] = useFilterFitmentMutation();
  const { id } = useParams();
  const navigate = useNavigate();
  const sellerId = id;

  const { data: sellerDetail, isLoading: loadingDetail } =
    useSellerDetailQuery(sellerId);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      detailID: id,
      year: year || undefined,
      make: make || undefined,
      model: model || undefined,
      trim: null,
      engine: null,
      pageNo: 1,
      pageSize: 10,
    };

    try {
      const response = await filterFitment(requestData).unwrap();
      setFilteredFitments(response.length ? response : []); // If response is empty, set an empty array
    } catch (error) {
      console.error("Error fetching fitments:", error);
      setFilteredFitments([]); // Set empty array if an error occurs
    }
  };

  if (loadingDetail) return <div>Loading...</div>;

  const firstImageUrl = sellerDetail?.imageURL?.split(",")[0]?.trim();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="grid grid-cols-4 items-center sticky mb-0 mt-3">
  {/* Empty space to push "Item Information" to the center */}
  <div className="grid grid-cols-2"></div>
  

  {/* Centered Heading */}
  <div className="text-secondary capitalize ml-3 text-left font-semibold text-lg">
    Item Information
  </div>
  <div className="grid grid-cols-3"></div>

  {/* Back Button on Extreme Right */}
  <button
    onClick={() => navigate(-1)}
    className="ml-auto flex items-center gap-1 text-xs text-secondary bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
  >
    <ArrowLeft size={15} /> Back
  </button>
</div>


<div className="p-[15px] mt-0">
  {/* Two-Column Layout */}
  <div className="grid grid-cols-4 gap-5 mb-3 h-full">
    
    {/* Left Column */}
    <div className="flex flex-col gap-4 min-h-full justify-between">
      {/* Overall Optimization Score */}
      <div className="border text-center border-borderColor rounded-[10px] p-3 flex flex-col items-center justify-between">
        <div className="w-full text-center font-semibold text-lg capitalize">
          Overall Optimization Score
        </div>
        <ProgressBar
          optimizationScore={sellerDetail?.score}
          optimizationOpportunity={100 - sellerDetail?.score}
        />
      </div>

      {/* Single Product Details */}
      <div className="w-full flex flex-col items-center gap-4 border border-borderColor rounded-[10px] py-4">
        <h4 className="text-sm text-[#0E6698] font-bold text-center">
          {sellerDetail?.title}
        </h4>
        <img
          className="w-[200px] h-[200px]"
          src={firstImageUrl}
          alt={sellerDetail?.title}
        />
        <h3 className="text-sm font-semibold bg-red-500 text-white px-3 py-0.3 rounded-full text-center">
          {sellerDetail?.compatibility} GBP
        </h3>
        <div className="w-full text-sm font-semibold bg-[#f6f6f6] text-black px-3 py-0.5 rounded-full text-center">
          MPN: <span className="text-secondary">{sellerDetail?.mpn}</span>
        </div>
        <div className="w-full text-sm font-semibold bg-[#f6f6f6] text-black px-3 py-0.5 rounded-full text-center">
          Brand: <span className="text-secondary">{sellerDetail?.brand}</span>
        </div>
        <div className="w-full text-sm font-semibold bg-[#f6f6f6] text-black px-3 py-0.5 rounded-full text-center">
          Category ID: <span className="text-secondary">{sellerDetail?.categoryID}</span>
        </div>
        <div className="w-full text-sm font-semibold bg-[#f6f6f6] text-black px-3 py-0.5 rounded-full text-center">
          Listing date: <span className="text-secondary">{sellerDetail?.listingDate}</span>
        </div>
      </div>

      {/* Single Listing Score Gauge Chart */}
      <div className="border border-borderColor rounded-[10px] py-4 flex flex-col items-center">
        <div className="text-center font-semibold text-lg capitalize">
          Item Optimization Score
        </div>
        <SingleListingScore />
      </div>
    </div>

    {/* Right Column */}
    <div className="col-span-3 flex flex-col gap-5 min-h-full">
     

      {/* Item Information Table */}
      <EbaySearchReportTable bodyItems={sellerDetail} />

      {/* Optimization Table */}
      <div className="mt-[2%]">      <Optimization
        optimizeData={sellerDetail?.score}
        EbayReportData={sellerDetail}
      />
      </div>


      {/* Single Listing Table */}
      <div className="text-lg text-secondary font-semibold leading-none mt-[3%] mb-0">Recommended Item Specifics</div>

      <OptimizationTableTwo
        headerItems={optimizationTableTwoHeaderData}
        bodyItems={sellerDetail?.itemSpecifics}
      />
    </div>
  </div>

  {/* Fitment Table - Full Width */}
  <div className="mt-5 border border-r-2 p-3 w-full rounded-[20px]">
    <h3 className="text-xl text-secondary font-rajdhani font-bold mb-1">
      Fitments
    </h3>

    <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-5">
      <input
        id="year"
        type="text"
        name="year"
        className="px-1.5 py-1.5 rounded-full border border-black"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <input
        id="make"
        name="make"
        type="text"
        className="px-1.5 py-1.5 rounded-full border border-black"
        placeholder="Make"
        value={make}
        onChange={(e) => setMake(e.target.value)}
      />
      <input
        id="model"
        name="model"
        type="text"
        className="px-1.5 py-1.5 rounded-full border  border-black"
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <button
        type="submit"
        className="text-white bg-primary rounded-[5px] px-2.5 py-1.5"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>

    <OptimizationTableThree
      headerItems={optimizationTableThreeHeaderData}
      bodyItems={
        filteredFitments !== null
          ? filteredFitments
          : sellerDetail?.fitments || []
      }
    />
  </div>
</div>

    </>
  );
};

export default EbaySearchReport;
