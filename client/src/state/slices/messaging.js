import { createSlice } from '@reduxjs/toolkit';

const messagingSlice = createSlice({
	name: 'messaging',
	initialState: {
		selectedMessages: [],
	},
	reducers: {
		setToSliceSelectedMessages: (state, action) => {
			state.selectedMessages = action.payload;
		},
	},
});

export const { setToSliceSelectedMessages } = messagingSlice.actions;

export default messagingSlice.reducer;