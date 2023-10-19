import { createSlice } from "@reduxjs/toolkit";
import { api } from "state/service/api";

const initialState = {
	mode: window.localStorage.getItem('mode') || 'dark',
	user: {},
	token: null,
	activeUsers: [],
	refs: [],
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
		setActiveUsers: (state, action) => {
			state.activeUsers = action.payload
		},
		updateNotificationsCount: (state) => {
			state.user.notificationsCount += 1;
		},
		updateRefs: (state, action) => {
			if (!state.refs.includes(action.payload)) {
				state.refs.push(action.payload)
			}
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
		// login
		builder.addMatcher(
			api.endpoints.login.matchFulfilled,
			(state, action) => {
				window.localStorage.setItem('token', action.payload.token)
				state.user = action.payload.user
				state.token = action.payload.token
			}
		)
		// sentFriendRequests
		builder.addMatcher(
			api.endpoints.sendFriendRequest.matchFulfilled,
			(state, action) => {
				state.user.sentFriendRequests = action.payload.sentFriendRequests
			}
		)
		// acceptFriendRequest
		builder.addMatcher(
			api.endpoints.acceptFriendRequest.matchFulfilled,
			(state, action) => {
				state.user.friends = action.payload.friends
				state.user.receivedFriendRequests = action.payload.receivedFriendRequests
			}
		)
		// cancelSendedFriendRequest
		builder.addMatcher(
			api.endpoints.cancelSendedFriendRequest.matchFulfilled,
			(state, action) => {
				state.user.sentFriendRequests = action.payload.sentFriendRequests
			}
		)
		// deleteFriend
		builder.addMatcher(
			api.endpoints.deleteFriend.matchFulfilled,
			(state, action) => {
				state.user.friends = action.payload.friends
				state.user.receivedFriendRequests = action.payload.receivedFriendRequests
			}
		)
		// getNotifications
		builder.addMatcher(
			api.endpoints.getNotifications.matchFulfilled,
			(state) => {
				state.user.notificationsCount = 0;
			}
		)
	}
});

export const { logout, setMode, setActiveUsers, updateNotificationsCount, updateRefs } = authSlice.actions;
export default authSlice.reducer;
