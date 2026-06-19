import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface FitmentState {
//   fitmentScore: number | null;
// }

// const initialState: FitmentState = {
//   fitmentScore: null,
// };

// const fitmentSlice = createSlice({
//   name: "fitment",
//   initialState,
//   reducers: {
//     setFitmentScore: (state, action: PayloadAction<number>) => {
//       state.fitmentScore = action.payload;
//     },
//   },
// });

// export const { setFitmentScore } = fitmentSlice.actions;
// export default fitmentSlice.reducer;

interface FitmentState {
  selectedView: "country" | "category"; // Tracks the current view
  countryFitmentScore: number | null;
  categoryFitmentScore: number | null;
  selectedSite: string | null;  // ✅ Store selected site
  selectedCategory: string | null; 
  selectedPath: string | null;
  categoryFilter: any[]; // after uat new api call
  listingCategoryScore: number | null; // after uat new api call
  listingOptimizationScore: number | null; // after uat new api call
  listingCountryScore: number | null;
  countryFilter: any[]; // after uat new api call
  clearFilter: boolean;
  summaryFitmentCategories: any[]; // To store the categories data
  selectedLevel: number | null;
}

const initialState: FitmentState = {
  selectedView: "country", // Default view is country
  countryFitmentScore: null,
  categoryFitmentScore: null,
  selectedSite: null, // 
  selectedCategory: null,
  selectedPath: null,
  categoryFilter: [], // ⬅️ initialized empty array
  countryFilter: [], // ⬅️ initialized empty array
  clearFilter: false,
  summaryFitmentCategories: [],
  listingCategoryScore: 0,
  listingOptimizationScore: 0,
  listingCountryScore: 0,
  selectedLevel: null
};

const fitmentSlice = createSlice({
  name: "fitment",
  initialState,
  reducers: {
    setSelectedSite: (state, action: PayloadAction<string | null>) => {
      state.selectedSite = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedPath: (state, action: PayloadAction<string | null>) => {
      state.selectedPath = action.payload;
    },
    setCountryFitmentScore: (state, action: PayloadAction<number>) => {
      state.countryFitmentScore = action.payload;
      state.selectedView = "country"; // Set view to country when updating
    },
    setCategoryFitmentScore: (state, action: PayloadAction<number>) => {
      state.categoryFitmentScore = action.payload;
      state.selectedView = "category"; // Set view to category when updating
    },
    setCategoryFilter: (state, action: PayloadAction<any[]>) => {
      state.categoryFilter = action.payload; // ⬅️ store categoryFilter here
    },
    setCountryFilter: (state, action: PayloadAction<any[]>) => {
      state.countryFilter = action.payload; // ⬅️ store categoryFilter here
    },
    setResetFilter: (state, action: PayloadAction<boolean>) => {
      state.clearFilter = action.payload; // ⬅️ store categoryFilter here
    },
    setListingCategoryScore: (state, action: PayloadAction<number>) =>{
      state.listingCategoryScore = action.payload;
      state.selectedView = "category";
    },
    setListingOptimizationScore: (state, action: PayloadAction<number>) =>{
      state.listingOptimizationScore = action.payload;
   
    },
    setListingCountryScore: (state, action: PayloadAction<number>)=>{
      state.listingCountryScore = action.payload;
        state.selectedView = "country"
    },
    setSelectedLevel: (state, action: PayloadAction<number>)=> {
        state.selectedLevel = action.payload;
  
    },
    resetState: () => initialState, 
    setSummaryFitmentCategories: (state, action: PayloadAction<any[]>) => {
      state.summaryFitmentCategories = action.payload;
    },
  },
});

export const { setCountryFitmentScore, setCategoryFitmentScore, setSelectedSite, 
  setSelectedCategory, setCategoryFilter, setCountryFilter, resetState, setResetFilter, setSummaryFitmentCategories, setSelectedPath, setListingCategoryScore, setListingOptimizationScore, setListingCountryScore, setSelectedLevel } = fitmentSlice.actions;
export default fitmentSlice.reducer;
