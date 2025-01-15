
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApiTags } from '../../common/constants/api/tags';
import { REACT_APP_BASE_URL, API_TOKEN } from '@env';

// Define a service using a base URL and expected endpoints
console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL);
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${REACT_APP_BASE_URL}/`,
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }),
    tagTypes: baseApiTags,
    endpoints: () => ({}),
});
