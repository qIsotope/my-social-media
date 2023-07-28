import { useCallback, useEffect, useReducer, useRef } from 'react';
import axios from 'axios.js';

const initialState = {
  error: false,
  data: undefined,
	loading: false,
};

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...initialState, loading: true };
    case 'fetched':
      return { ...initialState, data: action.payload, loading: false };
    case 'error':
      return { ...initialState, error: action.payload, loading: false };
    default:
      return state;
  }
};

export function useFetch(url, triggerOnMount) {
  const cache = useRef({});
  const [state, dispatch] = useReducer(fetchReducer, initialState);

	const fetchData = useCallback(async () => {
		dispatch({ type: 'loading' });

		if (cache.current[url]) {
			dispatch({ type: 'fetched', payload: cache.current[url] });
			return;
		}

		try {
			const response = await axios(url);
			const {data} = response;
			cache.current[url] = data;
			dispatch({ type: 'fetched', payload: data });
		} catch (error) {
			dispatch({ type: 'error', payload: error });
		}
	});

  useEffect(() => {
    if (!url) return;
		if (triggerOnMount) fetchData();
  }, [url]);
	
  return {error: state.error, loading: state.loading, data: state.data, fetchData};
}
