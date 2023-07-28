import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/auth.js'
import { api } from './service/api.js'

const store = configureStore({
	reducer: {
		auth: authSlice,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

export default store