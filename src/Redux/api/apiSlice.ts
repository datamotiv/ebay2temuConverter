import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "Datacube",
  tagTypes: ["user"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_KEY,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "*/*");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const { resetApiState } = apiSlice.util;
