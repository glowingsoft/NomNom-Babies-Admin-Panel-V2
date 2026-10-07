import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const settingsApi = createApi({
  reducerPath: 'settings',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Settings', 'Faqs'],
  endpoints: (builder) => ({
    // Get Terms and Conditions
    getTermsAndConditions: builder.query({
      query: () => ({
        url: API_ROUTES.SETTINGS.GET_TERMS,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Settings'],
    }),

    // Update Terms and Conditions
    updateTermsAndConditions: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.SETTINGS.UPDATE_TERMS,
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get AboutUs
    getAboutUs: builder.query({
      query: () => ({
        url: API_ROUTES.SETTINGS.GET_ABOUT,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Settings'],
    }),

    // Update AboutUs
    updateAboutUs: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.SETTINGS.UPDATE_ABOUT,
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get PrivacyPolicy
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: API_ROUTES.SETTINGS.GET_PRIVACY,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Settings'],
    }),

    // Update PrivacyPolicy
    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.SETTINGS.UPDATE_PRIVACY,
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get FAQs
    getFaqs: builder.query({
      query: (params) => ({
        url: API_ROUTES.SETTINGS.GET_FAQ,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ['Faqs'],
    }),

    // Create FAQs
    createFaqs: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.SETTINGS.CREATE_FAQ,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Faqs'],
    }),

    // Update FAQs
    updateFaqs: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.SETTINGS.UPDATE_FAQ(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Faqs'],
    }),

    // Delete FAQs
    deleteFaqs: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.SETTINGS.DELETE_FAQ(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Faqs'],
    }),
  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetFaqsQuery,
  useCreateFaqsMutation,
  useUpdateFaqsMutation,
  useDeleteFaqsMutation,
} = settingsApi;
