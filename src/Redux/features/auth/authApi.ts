/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/auth/public/signup",
        method: "POST",
        body: data,
      }),
    }),
    signin: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/auth/public/signin",
        method: "POST",
        body: data,
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: "/auth/ebay/authtoken",
      }),
    }),
    ebayAuth: builder.query<any, string>({
      query: (sellerName) => ({
        url: `/public/ebayauth?sellerName=${sellerName}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSignupMutation, useSigninMutation , useGetUserInfoQuery, useEbayAuthQuery} = authApi;
