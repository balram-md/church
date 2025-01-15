import { API_TOKEN } from '@env';
import {baseApi} from '../../BaseApiSlice';
import {LoginResponse, LoginApiArgs, FCMArgs} from './types';

// Define a service using a base URL and expected endpoints
export const loginApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginApiArgs>({
      query: payload => {
        console.log('payload for login',payload)
        return {
          url: `login`,
          method: 'POST',
          body: payload,
        };
      },
    }),
    addFCM: builder.mutation<any, FCMArgs>({
      query: payload => ({
        url: `AddFcmToken`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags:['login']
    }),
    getStates: builder.query<any, void>({
      query: () => ({
        url: `GetState`,
      }),
      transformResponse:(response)=>response.data
    }),
    getCity: builder.query<any, {stateId:string|number}>({
      query: ({stateId}) => ({
        url: `GetCity?StateId=${stateId}`,
      }),
      transformResponse:(response)=>response.data
      // GetArea?StateId=20&MasCityName=Mumbai
    }),
    getPostalCode: builder.query<any, {stateId:string|number,cityName:string}>({
      query: ({stateId,cityName}) => ({
        url: `PostCode?StateId=${stateId}&MasCityName=${cityName}`,
      }),
      transformResponse:(response)=>response.data
      // GetArea?StateId=20&MasCityName=Mumbai
    }),
    getArea: builder.query<any, {stateId:string|number,cityName:string,postCode:string|number,area:string}>({
      query: ({stateId,cityName,postCode,area}) => ({
        url: `GetArea?StateId=${stateId}&MasCityName=${cityName}&postCode=${postCode}&Area=${area}`,
      }),
      transformResponse:(response)=>response.data
  }),
  getChurch: builder.query<any, {stateId:string|number,cityName:string,postCode:string|number,area:string|number}>({
    query: ({stateId,cityName,postCode,area,}) => ({
      url: `GetChurch?StateId=${stateId}&MasCityName=${cityName}&postCode=${postCode}&Area=${area}`,
    }),
    transformResponse:(response)=>response.data
}),
registerUser: builder.mutation<any, any>({
  query: formData => {
   
    return {
      url: 'NewRegistration',
      method: 'POST',
      body: formData,
      headers: {
        // You may need to set appropriate headers for file upload
        Authorization: `Bearer ${API_TOKEN}`,
        // 'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
      },
    };     
  },


}),
})
});

export const {useLoginMutation, useAddFCMMutation,useGetStatesQuery,useGetAreaQuery,useGetChurchQuery,useGetCityQuery,useRegisterUserMutation,useGetPostalCodeQuery} = loginApi;
