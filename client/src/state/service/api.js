import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
		baseUrl: 'http://localhost:5005/',
		prepareHeaders: (headers) => {
			const token = window.localStorage.getItem('token')
			if (token) headers.set('Authorization', 'Bearer ' + token)
			return headers;
		},
	}),
	
  endpoints: () => ({})
})

export const {
	useNotificationReaderQuery
} = api;
