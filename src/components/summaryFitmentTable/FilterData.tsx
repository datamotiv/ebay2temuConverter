import React, {useMemo, useState} from "react";
import Select from "react-select";
import {
  categoryDataLevel,
  createLevelOptions,
  FilterDataProps,
  ISelect,
} from "./helper";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { useDispatch} from "react-redux";
import {setSelectedSite, setResetFilter, setSelectedPath, setSelectedCategory, setSelectedLevel} from "../../Redux/features/fitmentScoreSlice";
import CategoryFilter from "./CategoryFilter";
import HomeButton from "../summaryTable/HomeButton";

const FilterData: React.FC<FilterDataProps> = ({
  categories,
  filter,
  setFilter,
  fetchSummaryFitment,
  setPaginationCurrentPage,
}) => {
  const flagsData = categories
    ? [...new Set(categories.map((item) => item.site))].map((site) => {
        const { icon } = categories.find((cat) => cat.site === site)!;
        return { value: site, label: icon };
      })
    : [];
  const dispatch = useDispatch();
 
  const [, setIsCountryAll] = useState<boolean>(false)
     
  

  // const handleFetchScore = async (
  //   selectedSite: string | null,
  //   category: string | null 
  // ) => {
  
  //   try {
  //     const response = await getFitmentScore({
  //       site: selectedSite,
  //       categoryID: category || selectedCategory,
  //     }).unwrap();
  //     // // dispatch(setFitmentScore(response.fitmentScore));
  //     // dispatch(setCountryFitmentScore(response.fitmentScore));
  //     if (category) {
  //       dispatch(setCategoryFitmentScore(response.fitmentScore));
  //     } else {
  //       dispatch(setCountryFitmentScore(response.fitmentScore));
  //     }
  //   } catch (err) {
  //     console.error("Error fetching score:", err);
  //   }
  // };

  const handleFlagChange = (e: any) => {
    const newFlagValue = e.value;
    const flagLevel = -1;
    dispatch(setSelectedSite(newFlagValue)); // ✅ Store selected site
    dispatch(setSelectedLevel(flagLevel))

    if (newFlagValue === 'All') {
      setIsCountryAll(false);
    } else {
      setIsCountryAll(true);
    }
    setFilter((prev) => ({
      ...prev,
      flag: { value: newFlagValue, label: "" },
    }));

    // handleFetchScore(newFlagValue,selectedCategory);
    fetchSummaryFitment?.({ site: newFlagValue });
  };


  const flagOptions = [
    { value: "All", label: "All" },
    ...flagsData.map((elem) => ({
      value: elem.value,
      label: (
        <div className="flex items-center">
          {elem.label && (
            <img src={elem.label} alt={elem.value} className="size-8 mr-2" />
          )}
          {elem.value}
        </div>
      ),
    })),
  ];

  const categoryData = useMemo(
    () => categoryDataLevel(categories),
    [categories]
  );

  const {
    firstAllOptions,
    secondAllOptions,
    thirdAllOptions,
    fourthAllOptions,
    fifthAllOptions,
    sixthAllOptions,
    seventhAllOptions,
    eighthAllOptions,
  } = useMemo(
    () =>
      createLevelOptions(
        categoryData,
        filter.firstLevel.value,
        filter.secondLevel.value,
        filter.thirdLevel.value,
        filter.fourthLevel.value,
        filter.fifthLevel.value,
        filter.sixthLevel.value,
        filter.seventhLevel.value
      ),
    [JSON.stringify(filter), categoryData]
  );

  const handleClearFilters = async () => {
    setFilter({
      flag: flagOptions[0] as ISelect,
      firstLevel: firstAllOptions[0],
      secondLevel: secondAllOptions[0],
      thirdLevel: thirdAllOptions[0],
      fourthLevel: fourthAllOptions[0],
      fifthLevel: fifthAllOptions[0],
      sixthLevel: sixthAllOptions[0],
      seventhLevel: seventhAllOptions[0],
    });
    dispatch(setResetFilter(true));
    dispatch(setSelectedPath(null));
    dispatch(setSelectedSite(null));
    dispatch(setSelectedCategory(null))
    //    setIsCountryAll(true);
    fetchSummaryFitment?.({
      pageNumber: 1,
      pageSize: 50,
      site: "",
      categoryID: "",
      level: "",
    });
    setPaginationCurrentPage(1);
  };

  return (
    <div
      style={{ zIndex: "2000" }}
      className="flex align-middle justify-between"
    >
      <div className="flex gap-5 flex-wrap items-end justify-start">
        <div className="flex flex-col gap-2">
          <label
            className="text-base text-[#1C1C1C] font-poppins"
            htmlFor="city"
          >
            Country
          </label>
          <div className="relative w-[260px]">
            <Select
              value={
                flagOptions.find((opt) => opt.value === filter.flag.value) ||
                flagOptions[0]
              }
              options={flagOptions as any}
              onChange={handleFlagChange}
            />
          </div>
        </div>

        <CategoryFilter
          filter={filter}
          setFilter={setFilter}
          firstAllOptions={firstAllOptions}
          secondAllOptions={secondAllOptions}
          thirdAllOptions={thirdAllOptions}
          fourthAllOptions={fourthAllOptions}
          fifthAllOptions={fifthAllOptions}
          sixthAllOptions={sixthAllOptions}
          seventhAllOptions={seventhAllOptions}
          eighthAllOptions={eighthAllOptions}
          fetchSummaryFitment={fetchSummaryFitment}
          setPaginationCurrentPage={setPaginationCurrentPage}
        />
      </div>
      <div className="relative text-right">
  {/* Home Button (absolute, on top-right) */}
  <div className="absolute top-0 right-0 z-10">
    <HomeButton />
  </div>

  {/* Filter Button (normal flow, with margin top so HomeButton doesn't overlap visually) */}
  <button
    className="px-5 py-2.5 h-[38px] text-white bg-primary font-poppins font-medium mt-[48px] outline-none rounded-[4px]"
    onClick={handleClearFilters}
  >
    <FaFilterCircleXmark size={20} />
  </button>
</div>
  
    </div>
  );
};

export default FilterData;
