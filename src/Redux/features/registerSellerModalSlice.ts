import { createSlice } from "@reduxjs/toolkit";

export type TRegisterSellerModal = {
	isOpenRegisterModal: boolean;
};

const initialState: TRegisterSellerModal = {
	isOpenRegisterModal: false,
};

export const registerSellerModalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		registerModal: (state, actions) => {
			state.isOpenRegisterModal = actions.payload;
		},
		resetState: () => initialState, 
	},
});

// Action creators are generated for each case reducer function
export const { registerModal, resetState } = registerSellerModalSlice.actions;

export default registerSellerModalSlice.reducer;
