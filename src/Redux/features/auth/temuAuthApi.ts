/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// New eBay2temu auth backend. Base URL ends in /api/v1/auth (no trailing slash).
export const temuAuthApi = createApi({
  reducerPath: 'ebay2temuAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_AUTH_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', '*/*');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // POST /signup — stashes payload in Redis and emails a verification link.
    signupTemu: builder.mutation<any, Record<string, any>>({
      query: (body) => ({ url: '/signup', method: 'POST', body }),
    }),
    // POST /signup/verify-email — consumes the token and creates the user.
    verifyEmail: builder.mutation<any, { token: string }>({
      query: (body) => ({ url: '/signup/verify-email', method: 'POST', body }),
    }),
    // POST /signin — returns { accessToken, admin, email, ... }.
    signinTemu: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: '/signin', method: 'POST', body }),
    }),
    // POST /password/forgot — always 201 (user-enumeration defence).
    forgotPasswordTemu: builder.mutation<any, { email: string }>({
      query: (body) => ({ url: '/password/forgot', method: 'POST', body }),
    }),
    // POST /password/reset — sets a new password from the reset token.
    resetPasswordTemu: builder.mutation<any, { token: string; newPassword: string }>({
      query: (body) => ({ url: '/password/reset', method: 'POST', body }),
    }),
  }),
});

export const {
  useSignupTemuMutation,
  useVerifyEmailMutation,
  useSigninTemuMutation,
  useForgotPasswordTemuMutation,
  useResetPasswordTemuMutation,
} = temuAuthApi;
