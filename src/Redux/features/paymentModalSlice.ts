import { createSlice } from "@reduxjs/toolkit";

export type TPaymentModal = {
	isOpenModal: boolean;
};

const initialState: TPaymentModal = {
	isOpenModal: false,
};

export const paymentModalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		paymentModal: (state, actions) => {
			state.isOpenModal = actions.payload;
		},
		resetState: () => initialState, 
	},
});

// Action creators are generated for each case reducer function
export const { paymentModal , resetState } = paymentModalSlice.actions;

export default paymentModalSlice.reducer;
