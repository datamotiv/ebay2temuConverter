import { apiSlice } from "../../api/apiSlice";

// interface FitmentScoreRequest {
//   site: string | null;
//   categoryID: number | null;
// }

// interface FitmentScoreResponse {
//   fitmentScore: number | string;
// }

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    summary: builder.query({
      query: () => ({
        url: "/summary",
      }),
    }),
    summaryFitment: builder.query({
      query: ({ pageNumber = 1, pageSize = 200 ,site = "", categoryID = "" }) => ({
        url: "/summary/fitment",
        params: {
          page: pageNumber,
          size: pageSize,
          site: site || undefined,           // omit if blank
      categoryID: categoryID || undefined, // omit if blank
        },
      }),
    }),
    summaryFitmentDetails: builder.mutation({
      query: ({ searchResultId, pageNo, pageSize, categoryId, site ,  fitmentFilter = 0}) => ({
        url: "/summary/fitment/detail",
        method: 'POST',
        body: { searchResultId, pageNo, pageSize, categoryId, site ,fitmentFilter},
      }),
    }),
    inbox: builder.query({
      query: () => ({
        url: "/inbox",
      }),
    }),
    fitmentOptimized: builder.mutation({
      query: ({ all, ids, categoryId, searchId, site }) => ({
        url: "/optimize",
        method: "POST",
        body: { all, ids, categoryId, searchId, site },
      }),
    }),
    fitmentAcceptOptimize: builder.mutation({
      query: ({ searchId }) => ({
        url: `/optimize/accept`,
        method: "POST",
        body: { searchId },
      }),
    }),
    support: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/support",
        method: "POST",
        body: data,
      }),
    }),
    filterFitment: builder.mutation({
      query: ({ detailID, year, make, model, trim, engine, pageNo, pageSize }) => ({
        url: "/seller/detail/fitment",
        method: "POST",
        body: {
          detailID,  
          year,      
          make,    
          model,     
          trim,      
          engine,    
          pageNo,    
          pageSize  
        },
      }),
    }), 
    fitmentCategoryScore: builder.mutation({  
      query: ({ categoryID, site }) => ({ 
        url: "/summary/fitment/score",
        method: "POST",
        body: { site, categoryID },
      })
    }),

  }),
});

export const { useSummaryQuery, useSummaryFitmentQuery,useSummaryFitmentDetailsMutation,useInboxQuery,useFitmentOptimizedMutation,useFitmentAcceptOptimizeMutation,useFilterFitmentMutation,useSupportMutation, useFitmentCategoryScoreMutation } = authApi;
