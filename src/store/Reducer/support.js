import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const supportApi = createApi({
  reducerPath: 'support',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Support'],
  endpoints: (builder) => ({
    // Get-Support-Request
    getSupportRequests: builder.query({
      query: ({ page = 1, limit = 10, keyword = '', status = 'all' }) => ({
        url: API_ROUTES.SUPPORT.GET_LIST,
        method: 'GET',
        params: {
          page,
          limit,
          keyword,
          status,
        },
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Support'],
    }),

    // Update-Support-Status
    updateSupportStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.SUPPORT.UPDATE_STATUS(id),
        method: 'PUT',
        body: {
          status,
        },
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Support'],
    }),

    // Delete-Support
    deleteSupport: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.SUPPORT.DELETE(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const { useGetSupportRequestsQuery, useUpdateSupportStatusMutation, useDeleteSupportMutation } = supportApi;
