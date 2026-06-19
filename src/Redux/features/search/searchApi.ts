import { apiSlice } from "../../api/apiSlice";

export const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sellerSearch: builder.mutation({
      query: ({ sellerName, sellerStatus, pageNo, pageSize }) => ({
        url: "/seller/search2",
        method: "POST",
        body: {
          sellerName,
          sellerStatus,
          pageNo,
          pageSize,
        },
      }),
    }),
    otherSearch: builder.mutation({
      query: ({ sellerName, sellerStatus, pageNo, pageSize }) => ({
        url: "/seller/search",
        method: "POST",
        body: {
          sellerName,
          sellerStatus,
          pageNo,
          pageSize,
        },
      }),
    }),
    sellerDetail: builder.query({
      query: (id) => ({
        url: `/seller/detail?id=${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSellerSearchMutation,useSellerDetailQuery ,useOtherSearchMutation} = searchApi; 
