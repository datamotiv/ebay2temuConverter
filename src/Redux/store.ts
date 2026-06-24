/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./api/apiSlice";
import { temuAuthApi } from "./features/auth/temuAuthApi";
import { migrationsApi } from "./features/migrations/migrationsApi";
import { paymentsApi } from "./features/payments/paymentsApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import paymentModalReducer from "./features/paymentModalSlice";
import registerSellerModalReducer from "./features/registerSellerModalSlice";
import fitmentSlice from "./features/fitmentScoreSlice";

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		[temuAuthApi.reducerPath]: temuAuthApi.reducer,
		[migrationsApi.reducerPath]: migrationsApi.reducer,
		[paymentsApi.reducerPath]: paymentsApi.reducer,
		paymentModal: paymentModalReducer,
		registerModal: registerSellerModalReducer,
		auth: authReducer,
		setFitmentScore: fitmentSlice,
		setCountryFitmentScore:fitmentSlice,
		setCategoryFitmentScore:fitmentSlice,
		fitment:fitmentSlice,
		setListingCategoryScore: fitmentSlice,
		setListingOptimizationScore: fitmentSlice,
		setListingCountryScore: fitmentSlice,
		setSelectedLevel: fitmentSlice
	},
	middleware: (getDefaultMiddleware: any) =>
		getDefaultMiddleware().concat(
			apiSlice.middleware,
			temuAuthApi.middleware,
			migrationsApi.middleware,
			paymentsApi.middleware
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
