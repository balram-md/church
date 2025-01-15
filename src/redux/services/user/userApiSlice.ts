import {API_TOKEN} from '@env';
import {User} from '../../slices/user/types';
import {baseApi} from '../BaseApiSlice';

// Define a service using a base URL and expected endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserDetails: builder.query<User, void>({
      query: () => ({
        url: `GetUserProfile`,
      }),
    }),
    updateUserDetails: builder.mutation<User, FormData>({
      query: formData => ({
        url: `UpdateProfile`,
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'multipart/form-data', // Usually, this is not needed
        },
      }),
    }),
  }),
});

export const {useGetUserDetailsQuery, useUpdateUserDetailsMutation,useLazyGetUserDetailsQuery} = userApi;
