import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApiSlice';
import { GetStatusParams } from './types';

// Define a service using a base URL and expected endpoints
export const notificationsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllNotifications: builder.query<any, {id: number; uType: string}>({
      query: ({id, uType}) => ({
        url: `AllNotifications`,
        params: {id, uType},
      }),
      providesTags:['updateNotificationStatus']
    }),
    getCount: builder.query<any, {id: number; uType: string}>({
      query: ({id, uType}) => ({
        url: `Count`,
        params: {id, uType},
      }),
      providesTags:['updateNotificationStatus']
    }),
    updateNotificationStatus: builder.mutation<any, GetStatusParams>({
      query: ({notificationId, read}) => ({
        url: `Status`,
        method: 'POST',
        body: {
          notificationId,
          read,
        },
      }),
      invalidatesTags:['updateNotificationStatus']
    }),
    
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetCountQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
