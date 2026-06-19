import Table from "../components/Table";
import Navbar from "../components/Navbar";
import { FormEvent, useEffect, useState } from "react";
import Input from "../components/input/Input";
import Pagination from "../components/Pagination";
import { ebayReportTableHeaderData } from "../utils/data";
import {
  useOtherSearchMutation,
  useSellerSearchMutation,
} from "../Redux/features/search/searchApi";

export type DataType = {
  sellerName: string;
  sellerStatus: string;
  pageNo: number;
  pageSize: number;
};

const EbaySearchHistory = () => {
  const pageSize = 10; // Display 10 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalResults] = useState(0);
  const [ebayReportInfo, setEbayReportInfo] = useState({
    sellerName: "",
    sellerStatus: "",
    pageNo: 1,
    pageSize: pageSize,
    searchValue: "",
    date: "",
  });

  const [getSearchData, { isLoading }] = useSellerSearchMutation();
  const [getOtherSearchData, {  isLoading: isOtherLoading }] = useOtherSearchMutation();
  const [bodyItems, setBodyItems] = useState([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSearchData(currentPage); 
  };

  const fetchSearchData = (page: number) => {
    if (ebayReportInfo.sellerName === "") {
      getSearchData({
        sellerName: "",
        sellerStatus: "all",
        pageNo: page,
        pageSize: 80,
      })
        .unwrap()
        .then((response) => {
          setBodyItems(response.results);
          setTotalResults(response.totalResults); 
          setTotalPages(Math.ceil(response.totalResults / 80)); 
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // console.log(totalResults)
        });
    } else {
      getOtherSearchData({
        sellerName: ebayReportInfo.sellerName || ebayReportInfo.searchValue,
        sellerStatus: "all",
        pageNo: page,
        pageSize: pageSize,
      })
        .unwrap()
        .then((response) => {
          setBodyItems(response);
          setTotalResults(response.length); 
          setTotalPages(Math.ceil(response.length / 80)); 
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSearchData(page);
  };

  useEffect(() => {
    fetchSearchData(currentPage);
  }, [currentPage]);

  if (isLoading || isOtherLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar  />
      <form
        onSubmit={handleSubmit}
        className="px-[25px] py-[15px] flex justify-between items-center gap-2.5"
      >
        <div className="bg-[#F7F7F7] rounded-[10px] w-full min-w-[304.5px]">
          <Input
            type="search"
            id="searchValue"
            name="searchValue"
            className="py-2.5 px-[15px] border-transparent w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
            placeholder="Search..."
            value={ebayReportInfo.searchValue}
            onChange={(newValue) =>
              setEbayReportInfo({
                ...ebayReportInfo,
                searchValue: newValue,
              })
            }
          />
        </div>
        <div className="relative w-full min-w-[304.5px] bg-[#F7F7F7] rounded-[10px]">
          <Input
            type="date"
            name="date"
            className="py-2.5 px-[15px] border-transparent w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
            placeholder="Select Date"
            value={ebayReportInfo?.date || ""}
            onChange={(newValue) =>
              setEbayReportInfo({
                ...ebayReportInfo,
                date: newValue,
              })
            }
          />
        </div>
        <div className="relative w-full min-w-[304.5px] bg-[#F7F7F7] rounded-[10px]">
          <Input
            type="text"
            className="py-2.5 px-[15px] border-transparent w-full text-sm placeholder:text-sm font-poppins placeholder:font-light placeholder:text-[#5E5E5E]"
            name="sellerName"
            placeholder="Seller name"
            value={ebayReportInfo.sellerName}
            onChange={(newValue) =>
              setEbayReportInfo({
                ...ebayReportInfo,
                sellerName: newValue,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="text-sm font-poppins font-medium text-white bg-primary rounded-[5px] px-5 py-2.5"
        >
          Search
        </button>
      </form>
      <hr className="border-borderColor" />
      <div className="p-[25px]">
        <Table headerItems={ebayReportTableHeaderData} bodyItems={bodyItems} />
        <div className="flex flex-col items-end mt-[18px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default EbaySearchHistory;
