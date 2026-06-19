export const levelObj = {
  value: "",
  label: "All",
};

export const listingOptimizationHeaderOptions = [
  {
    id: 1,
    label: "Site",
    key:'site'
  },
  {
    id: 2,
    label: "Category",
    key:'category'
  },
  {
    id: 3,
    label: "No. Of Listings",
    key:'amountOfListings'
  },
  {
    id: 4,
    label: "Optimization Score",
    key:'amountFitmentEnabled'
  },
  {
    id: 5,
    label: "Optimization Opportunity",
    key:"amountNotFitmentEnabled"
  },
  {
    id: 5,
    label: "% of Listing Optimization Opportunity",
    key:"amountNotFitmentEnabled"
  },
];

export const headerOptions = [
  {
    id: 1,
    label: "Site",
    key:'site'
  },
  {
    id: 2,
    label: "Category",
    key:'category'
  },
  {
    id: 3,
    label: "No. Of Listings",
    key:'amountOfListings'
  },
  {
    id: 4,
    label: "Items with Fitment Adopted",
    key:'amountFitmentEnabled'
  },
  {
    id: 5,
    label: "Items with No Fitment Adopted ",
    key:"amountNotFitmentEnabled"
  },
  {
    id: 6,
    label: "% of Fitment Adoption Opportunity",
    key:'percentage'
  },
];

export interface categories {
  categories: category[];
}

// export interface category {
//   icon: string;
//   site: string;
//   category: string;
//   amountOfListings: number;
//   amountFitmentEnabled: number;
//   amountNotFitmentEnabled: number;
//   percentage: number;
//   categoryId: number;
//   searchResultId: number;
//   id: number;
// }

export interface category {
  icon: string;
  site: string;
  category: string;
  amountOfListings: number;
  amountFitmentEnabled: number;
  amountNotFitmentEnabled: number;
  percentage: number;
  categoryId: number;
  searchResultId: number;
  id: number;
}

export interface ISelect {
  value: string;
  label: string;
}

export type IFilter = Record<
  | "flag"
  | "firstLevel"
  | "secondLevel"
  | "thirdLevel"
  | "fourthLevel"
  | "fifthLevel"
  | "sixthLevel"
  | "seventhLevel",
  ISelect
>;

export interface FilterDataProps {
  categories: category[];
  filter: IFilter;
  setFilter: React.Dispatch<React.SetStateAction<IFilter>>;
  setPaginationCurrentPage: (page: number) => void;
  fetchSummaryFitment?: (params: {
    pageNumber?: number;
    pageSize?: number;
    site?: string;
    categoryID?: string;
    level?: string;
  }) => Promise<any>;
}

export const categoryDataLevel = (categories: category[]) => {
  let catObj: any = {};
  categories.map((cat) => {
    let catArr = cat.category.split(" > ");

    if (catArr.length === 0) return;

    const sanitize = (str: string) =>
      str
        .trim()
        .replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
        .replace(/[\s]/gi, "_")
        .toLowerCase();

    const levels = catArr.map(sanitize);
    // Recursively create nested structure
    let current = catObj;
    levels.map((level, index) => {
      if (!current[level]) {
        current[level] = { name: catArr[index] };
      }
      current = current[level];
    });
  });
  return catObj;
};

export const createLevelOptions = (
  categoryData: any,
  firstLevel: string,
  secondLevel: string,
  thirdLevel: string,
  fourthLevel: string,
  fifthLevel: string,
  sixthLevel: string,
  seventhLevel: string
) => {
  const getNestedCategories = (path: string[]) => {
    return path.reduce((acc, level) => acc?.[level] || {}, categoryData);
  };

  const extractOptions = (categories: any) =>
    Object.entries(categories)
      .filter(([key]) => key !== "name")
      .map(([key, value]) => ({
        value: key,
        label: (value as any).name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

  const firstLevelOptions = extractOptions(categoryData);

  const secondLevelOptions = firstLevel
    ? extractOptions(getNestedCategories([firstLevel]))
    : [];

  const thirdLevelOptions =
    firstLevel && secondLevel
      ? extractOptions(getNestedCategories([firstLevel, secondLevel]))
      : [];

  const fourthLevelOptions =
    firstLevel && secondLevel
      ? extractOptions(
          getNestedCategories([firstLevel, secondLevel, thirdLevel])
        )
      : [];

  const fifthLevelOptions =
    firstLevel && secondLevel
      ? extractOptions(
          getNestedCategories([
            firstLevel,
            secondLevel,
            thirdLevel,
            fourthLevel,
          ])
        )
      : [];

  const sixthLevelOptions =
    firstLevel && secondLevel
      ? extractOptions(
          getNestedCategories([
            firstLevel,
            secondLevel,
            thirdLevel,
            fourthLevel,
            fifthLevel,
          ])
        )
      : [];

  const seventhLevelOptions =
    firstLevel && secondLevel
      ? extractOptions(
          getNestedCategories([
            firstLevel,
            secondLevel,
            thirdLevel,
            fourthLevel,
            fifthLevel,
            sixthLevel,
          ])
        )
      : [];

  const eighthLevelOptions =
    firstLevel && secondLevel
      ? extractOptions(
          getNestedCategories([
            firstLevel,
            secondLevel,
            thirdLevel,
            fourthLevel,
            fifthLevel,
            sixthLevel,
            seventhLevel,
          ])
        )
      : [];

  return {
    firstAllOptions: [{ label: "All", value: "All" }, ...firstLevelOptions],
    secondAllOptions: [{ label: "All", value: "" }, ...secondLevelOptions],
    thirdAllOptions: [{ label: "All", value: "" }, ...thirdLevelOptions],
    fourthAllOptions: [{ label: "All", value: "" }, ...fourthLevelOptions],
    fifthAllOptions: [{ label: "All", value: "" }, ...fifthLevelOptions],
    sixthAllOptions: [{ label: "All", value: "" }, ...sixthLevelOptions],
    seventhAllOptions: [{ label: "All", value: "" }, ...seventhLevelOptions],
    eighthAllOptions: [{ label: "All", value: "" }, ...eighthLevelOptions],
  };
};
