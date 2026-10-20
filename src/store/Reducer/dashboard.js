import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const dashboardApi = createApi({
  reducerPath: 'dashboard',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    // All dashboard sections in one request. A section that failed on the server is null
    // and listed in data.errors; the rest are still returned.
    getDashboard: builder.query({
      query: (params) => ({
        url: API_ROUTES.DASHBOARD.ALL,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // getDownloadedPdfs
    getDownloadedPdfs: builder.query({
      query: ({ page = 1, limit = 10, keyword = '', type = '' } = {}) => ({
        url: API_ROUTES.DASHBOARD.DOWNLOADED_PDFS,
        method: 'GET',
        params: { page, limit, keyword, type },
        headers: { 'x-admin-access-token': ADMIN_ACCESS_TOKEN },
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery, useGetDownloadedPdfsQuery } = dashboardApi;
