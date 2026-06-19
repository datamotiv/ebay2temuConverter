import React, { useEffect, useState } from "react";
import FilterDropdowns from "./FilterDropdowns";
import { IFilter, ISelect } from "./helper";
import { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryFitmentScore,
  setResetFilter,
  setSelectedCategory,
  setSelectedPath,
  setSummaryFitmentCategories,
  setSelectedLevel
} from "../../Redux/features/fitmentScoreSlice";

interface CategoryFilterProps {
  filter: IFilter;
  setFilter: React.Dispatch<React.SetStateAction<IFilter>>;
  firstAllOptions: ISelect[];
  secondAllOptions: ISelect[];
  thirdAllOptions: ISelect[];
  fourthAllOptions: ISelect[];
  fifthAllOptions: ISelect[];
  sixthAllOptions: ISelect[];
  seventhAllOptions: ISelect[];
  eighthAllOptions: ISelect[];
  setPaginationCurrentPage: (page: number) => void;
  fetchSummaryFitment?: (params: {
    pageNumber?: number;
    pageSize?: number;
    site?: string;
    categoryID?: string;
    level?: string;
  }) => Promise<any>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filter,
  setFilter,
  firstAllOptions,
  secondAllOptions,
  thirdAllOptions,
  fourthAllOptions,
  fifthAllOptions,
  sixthAllOptions,
  seventhAllOptions,
  eighthAllOptions,
  setPaginationCurrentPage,
 
}) => {


  const getClearFilter = useSelector((state: any) => state.fitment.clearFilter);
  const [filterLevels, setFilterLevels] = useState([
    { level: "first", options: firstAllOptions },
    { level: "second", options: [] },
    { level: "third", options: [] },
    { level: "fourth", options: [] },
    { level: "fifth", options: [] },
    { level: "sixth", options: [] },
    { level: "seventh", options: [] },
    { level: "eighth", options: [] },
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (getClearFilter) {
      setFilterLevels([
        { level: "first", options: firstAllOptions },
        { level: "second", options: [] },
        { level: "third", options: [] },
        { level: "fourth", options: [] },
        { level: "fifth", options: [] },
        { level: "sixth", options: [] },
        { level: "seventh", options: [] },
        { level: "eighth", options: [] },
      ])
    }
  }, [getClearFilter])


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
      dispatch(setCategoryFitmentScore(data.categoryFitmentScore));

      if (data.categories) {
        dispatch(setSummaryFitmentCategories(data.categories));
      }
      const formattedArray = data.categoryFilter.map((item: string) => {
        const label = item;
        const value = item.replace(/[()]/g, '').replace(/\s+/g, '_').replace(/,/g, '');
        return { label, value };
      });
      formattedArray.unshift({ label: "All", value: "" });

      updateOptionsByIndex(level, formattedArray)

      return data;
    } catch (error) {
      console.error("Error fetching fitment summary:", error);
    }
  };

  const updateOptionsByIndex = (index: string, newOptions: any) => {
    dispatch(setResetFilter(false));
    setFilterLevels(prev =>
      prev.map((item, i) =>
        i.toString() === index ? {...item, options: newOptions} : i.toString() > index ? {...item, options: []} : item
      )
    );
  };

  // new code after UAT
  const handleCategoryChange = (
    option: SingleValue<{
      value: string;
      label: string;
    }>,
    level: string
  ) => {
    const levelStringToNumberMap: Record<string, number> = {
      first: 1,
      second: 2,
      third: 3,
      fourth: 4,
      fifth: 5,
      sixth: 6,
      seventh: 7,
      eighth: 8,
    };
    const resetLevels: Record<string, string[]> = {
      first: [
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
      ],
      second: ["third", "fourth", "fifth", "sixth", "seventh", "eighth"],
      third: ["fourth", "fifth", "sixth", "seventh", "eighth"],
      fourth: ["fifth", "sixth", "seventh", "eighth"],
      fifth: ["sixth", "seventh", "eighth"],
      sixth: ["seventh", "eighth"],
      seventh: ["eighth"],
    };
    const levelResetMap = {
      first: secondAllOptions[0],
      second: thirdAllOptions[0],
      third: fourthAllOptions[0],
      fourth: fifthAllOptions[0],
      fifth: sixthAllOptions[0],
      sixth: seventhAllOptions[0],
      seventh: eighthAllOptions[0],
    };
    const levelResets = resetLevels[level as keyof typeof resetLevels]?.reduce(
      (acc, resetLevel) => {
        return {
          ...acc,
          [`${resetLevel}Level`]:
            levelResetMap[resetLevel as keyof typeof levelResetMap],
        };
      },
      {}
    );
    // Create updated filter state
    const updatedFilter = {
      ...filter,
      ...levelResets,
      [level + "Level"]: {
        ...option,
        label: option?.label === "All" ? "All" : `${option?.label}`,
      },
    };
    setFilter(updatedFilter);
    const numericLevel = levelStringToNumberMap[level]?.toString() ?? "";
    dispatch(setSelectedCategory(option?.value || null));
    const checkLevel= levelStringToNumberMap[level];
   dispatch(setSelectedLevel(checkLevel));

    const paramParts = [];
    const filterKeys = Object.keys(updatedFilter) as Array<keyof typeof updatedFilter>;

    for (const key of filterKeys) {
      const filterValue = updatedFilter[key];
      if (filterValue && filterValue.value !== "All" && filterValue.value !== "") {
        paramParts.push(`${key}=${filterValue.value}`);
      }
    }
    const paramString = paramParts.join(",");
    dispatch(setSelectedPath(paramString));

    setPaginationCurrentPage(1); // Reset pagination to page 1

    fetchSummaryFitment({
      site: updatedFilter?.flag?.value || "",
      categoryID: option?.value || "",
      level: numericLevel,
      pageNumber: 1, // Reset to first page on filter change
      path: paramString
    });
  };

  return (
    <>
      <FilterDropdowns
        label="Category"
        filter={filter}
        options={firstAllOptions}
        level="first"
        handleCategoryChange={handleCategoryChange}
      />


      {
        filterLevels.slice(1).map(({ level, options }, index) => {
          if (options.length < 2) return null; // Skip if options is empty - skip just 'all'
          return (
            <div key={index}>
              <FilterDropdowns
                label="Category"
                filter={filter}
                options={options}
                level={level}
                handleCategoryChange={handleCategoryChange}
              />
            </div>
          );
        })
      }

    </>
  );
};

export default CategoryFilter;
