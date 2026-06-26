/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

type UserType = {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string[];
  password: string;
};

interface AuthState {
  user: UserType | null;
  token: string | null;
  isAdmin: boolean;
  sellerId: number | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
  isAdmin: false,
 sellerId: localStorage.getItem("id")
    ? Number(localStorage.getItem("id")) // ✅ convert to number
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
    },
    setAccessToken: (state, action) => {
      const { accessToken } = action?.payload;
      // Saving user data
      state.user = action?.payload;
      // Saving login credientials
      localStorage.setItem("accessToken", accessToken);
      state.isAdmin = action.payload.admin;
      state.sellerId= action.payload.id;
      localStorage.setItem("id", String(action.payload.id));
    },
    resetState: () => initialState, 
  },
});

export const { signout, setAccessToken, resetState } = authSlice.actions;
export default authSlice.reducer;
