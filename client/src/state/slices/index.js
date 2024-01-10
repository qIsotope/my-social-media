import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth.js'
import messagingSlice from './messaging.js'
import { api } from '../service/api.js'

const store = configureStore({
	reducer: {
		auth: authSlice,
		messaging: messagingSlice,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }).concat(api.middleware),
})

export default store;