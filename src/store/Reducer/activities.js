import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const activitiesApi = createApi({
  reducerPath: 'activities',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['activity'],
  endpoints: (builder) => ({
    // Get-Recent-Activities
    getActivities: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: API_ROUTES.ACTIVITY.ACTIVITY_LOGS,
        method: 'GET',
        params: {
          page,
          limit,
          ...(search.trim() ? { search: search.trim() } : {}),
        },
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['activity'],
    }),
  }),
});

export const { useGetActivitiesQuery } = activitiesApi;
