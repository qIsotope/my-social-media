import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth.js'
import { api } from '../service/api.js'

const store = configureStore({
	reducer: {
		auth: authSlice,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }).concat(api.middleware),
})

export default store;