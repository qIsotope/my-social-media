import { createSlice } from "@reduxjs/toolkit";
import { api } from "state/service/api";

const initialState = {
	mode: window.localStorage.getItem('mode') || 'light',
	user: {},
	token: null,
	impressionsCount: 0,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = {};
			state.token = null;
			window.localStorage.removeItem('token')
		},
		setMode: (state) => {
			state.mode = state.mode === 'dark' ? 'light' : 'dark'
			window.localStorage.setItem('mode', state.mode);
		},
		setImpressionsCount: (state, action) => {
			state.impressionsCount = action.payload
		}
	},
	extraReducers: (builder) => {
		// register
		builder.addMatcher(
			api.endpoints.authMe.matchFulfilled,
			(state, action) => {
				state.user = action.payload.user
				state.token = action.payload.token
			}
		)
		builder.addMatcher(
			api.endpoints.login.matchFulfilled,
			(state, action) => {
				window.localStorage.setItem('token', action.payload.token)
				state.user = action.payload.user
				state.token = action.payload.token
			}
		)
	}
});

export const { logout, setMode, setImpressionsCount } = authSlice.actions;
export default authSlice.reducer;
