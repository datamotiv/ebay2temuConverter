import { apiSlice } from "../../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: () => ({
        url: "/profile",
      }),
    }),
    profileUpdate: builder.mutation({
      query: ({
        firstName,
        lastName,
        fullName,
        address,
        phoneNumber,
        email,
        city,
        state,
        country,
        postalCode,
        password,
      }) => ({
        url: "/profile",
        method: "POST",
        body: {
          firstName,
          lastName,
          fullName,
          address,
          phoneNumber,
          email,
          city,
          state,
          country,
          postalCode,
          password,
        },
      }),
    }),
  }),
});

export const { useProfileQuery, useProfileUpdateMutation } = authApi;
