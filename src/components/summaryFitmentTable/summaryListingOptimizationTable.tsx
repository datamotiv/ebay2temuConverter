import { useNavigate } from "react-router";
import {
  category,
  listingOptimizationHeaderOptions,
  IFilter,
  levelObj,
} from "./helper";
import { useMemo, useState } from "react";
import FilterListingOptimizationData from "./FilterListingOptimizationData";
import {useSelector} from "react-redux";

// import {
//   MaterialReactTable,
//   useMaterialReactTable,
//   type MRT_ColumnDef,
// } from "material-react-table";

interface SummaryFitmentTableProps {
  fetchSummaryFitment?: (params: any) => Promise<any>;
  setPaginationCurrentPage: (page: number) => void;
  categories:any
}

const SummaryListingOptimizationTable: React.FC<SummaryFitmentTableProps> = ({ fetchSummaryFitment, setPaginationCurrentPage })=> {
  const navigate = useNavigate();
  
    const categories = useSelector((state: any) => state.fitment.summaryFitmentCategories);

  const [filter, setFilter] = useState<IFilter>({
    flag: levelObj,
    firstLevel: levelObj,
    secondLevel: levelObj,
    thirdLevel: levelObj,
    fourthLevel: levelObj,
    fifthLevel: levelObj,
    sixthLevel: levelObj,
    seventhLevel: levelObj,
  });

  const handleRowDoubleClick = (
    searchResultId: number | undefined,
    categoryId: number | undefined,
    site: string | undefined
  ) => {
    navigate(`/listing-category-details/${searchResultId}/${categoryId}/${site}`);
  };

  
const filteredData = useMemo(() => {
    let result = categories ?? [];

    return result.map((item:any) => ({
      ...item,
      icon: item.icon, // Ensure icon exists to prevent errors
    }));
  }, [JSON.stringify(categories)]);

  // const columns = listingOptimizationHeaderOptions.map(({ label, key }) => ({
  //   accessorKey: key, // This key should match with keys of body
  //   header: label,
  //   Cell:
  //     label === "Site"
  //       ? ({ row }) => (
  //           <img
  //             src={row.original.icon} // Get image URL dynamically
  //             alt="icon"
  //             style={{ width: "40px", height: "auto" }} // Adjust as needed
  //           />
  //         )
  //       : undefined,

  //   size:
  //     label === "Site"
  //       ? 40
  //       : label === "Category"
  //       ? 400
  //       : label === "Listings"
  //       ? 40
  //       : label === "Fitments Enabled"
  //       ? 40
  //       : label === "Fitments Not Enabled"
  //       ? 180
  //       : 50, // Default size if none of the conditions match
  // }));

  return (
    <>
      <FilterListingOptimizationData
        categories={categories ?? []}
        filter={filter}
        setFilter={setFilter}
        fetchSummaryFitment={fetchSummaryFitment}
        setPaginationCurrentPage={setPaginationCurrentPage}
      />
      <div className="border border-borderColor rounded-[10px] mt-5 overflow-x-hidden overflow-y-scroll max-h-[500px]">
        <table className="w-full rounded-[10px]">
          <thead className="rounded-t-[10px] bg-[#FAFAFA]  sticky top-0">
            <tr className="text-left border-b border-b-borderColor rounded-t-[10px]">
              {listingOptimizationHeaderOptions.map((option) => (
                <th
                  key={option?.id}
                  className={`p-[10px] font-semibold text-sm text-[#1E293B] ${
                    option?.id === 6 && "text-center"
                  } last:text-center last:border-r-0`}
                  align="center"
                  >
                  {option?.label}
                  
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.length ? (
              [...filteredData]
              .sort((a, b) => b.percentage - a.percentage)
              .map((categorySummary: category) => (
                <tr
                  key={categorySummary?.id}
                  // onDoubleClick={() =>
                  //   handleRowDoubleClick(
                  //     categorySummary?.searchResultId,
                  //     categorySummary?.categoryId,
                  //     categorySummary?.site
                  //   )
                  // }
                  className="border-b last:border-b-0 cursor-pointer">
                  <td className="px-[15px] py-[5px] text-sm font-poppins font-light  border-borderColor">
                    <img
                      src={categorySummary?.icon}
                      alt={categorySummary?.site}
                      title={categorySummary?.site}
                      className="size-8"
                    />
                  </td>
                  <td
  onClick={() =>
    handleRowDoubleClick(
      categorySummary?.searchResultId,
      categorySummary?.categoryId,
      categorySummary?.site
    )
  }
  className="px-[15px] py-[5px] text-sm font-poppins font-light  border-borderColor 
    text-[#2563EB] hover:text-blue-800 cursor-pointer"
>
  {categorySummary?.category}
</td>

                  <td className="px-[15px] py-[5px] text-sm font-poppins font-light  border-borderColor" align="center">
                    {categorySummary?.amountOfListings}
                  </td>
                  <td className="px-[15px] py-[5px] text-sm font-poppins font-light  border-borderColor" align="center">
                    {categorySummary.amountFitmentEnabled}
                  </td>
                  <td className="px-[15px] py-[5px] text-sm font-poppins font-light  border-borderColor" align="center">
                    {categorySummary.amountNotFitmentEnabled}
                  </td>
                  <td className="px-[15px] py-[5px] text-sm font-poppins font-bold  border-borderColor" align="center">
                    {categorySummary.percentage}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={listingOptimizationHeaderOptions.length} className="text-center py-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

{/* new code with material-react-library */}
        {/* <MaterialReactTable
          key={filteredData.length}
          columns={columns}
          data={filteredData}
          enableSorting={true}
          enableColumnFilters={true}
          enableColumnActions={false}
          rowNumberMode="static"
          enableStickyHeader={true}
          enableTopToolbar={true}
          enableBottomToolbar={true}
          // positionPagination='top'
          initialState={{
            pagination: {
              pageSize: 10,
            },
            density: "compact",
          }}
          muiTableContainerProps={{
            sx: { maxHeight: "400px" },
          }}
          muiTableProps={{
            sx: {
              border: "1px solid rgba(81, 81, 81, .5)",
              caption: {
                captionSide: "top",
              },
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              border: "1px solid rgba(81, 81, 81, .5)",
              fontStyle: "italic",
              fontWeight: "normal",
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              border: "1px solid rgba(81, 81, 81, .5)",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: (event) => {
              console.info("Row clicked:", row.id);
              handleRowDoubleClick(
                row.original.searchResultId,
                row.original.categoryId,
                row.original.site
              ); // Pass full row data if needed
            },
            // onDoubleClick: (event) => {
            //     console.info("Row double-clicked:", row.id);
            //     handleRowDoubleClick(row.original.searchResultId, row.original.categoryId, row.original.site); // Pass full row data if needed
            // },
            sx: {
              cursor: "pointer",
              color: "blue",
            },
          })}
          //   renderCaption= {() =>
          //     `Here is a table rendered with the lighter weight MRT_Table sub-component, rendering  rows.`
          // }
        /> */}
      </div>
    </>
  );
};

export default SummaryListingOptimizationTable;
