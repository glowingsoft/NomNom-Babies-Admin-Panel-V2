import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const dashboardApi = createApi({
  reducerPath: 'dashboard',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    // Dashboard Widgets
    getDashboardWidgets: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.WIDGETS,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // User Status Statistics
    getUserStatusStats: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.USER_STATUS,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Platform Health
    getPlatformHealth: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.PLATFORM_HEALTH,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Growth Trend
    getGrowthTrend: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.GROWTH_TREND,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Country Growth
    getCountryGrowth: builder.query({
      query: (topN = 5) => ({
        url: API_ROUTES.DASHBOARD.COUNTRY_GROWTH,
        method: 'GET',
        params: { topN },
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Recent Activities
    getDashboardRecentActivities: builder.query({
      query: (limit = 5) => ({
        url: API_ROUTES.DASHBOARD.RECENT_ACTIVITIES,
        method: 'GET',
        params: { limit },
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Top Downloaded Recipes
    getTopDownloadedRecipes: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.TOP_DOWNLOADED_RECIPES,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Top Recipes
    getTopRecipes: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.TOP_RECIPES,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // Top Countries
    getTopCountries: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.TOP_COUNTRIES,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Dashboard'],
    }),

    // App Downloads (by device platform)
    getAppDownloadStats: builder.query({
      query: () => ({
        url: API_ROUTES.DASHBOARD.APP_DOWNLOADS,
        method: 'GET',
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

export const {
  useGetDashboardWidgetsQuery,
  useGetUserStatusStatsQuery,
  useGetPlatformHealthQuery,
  useGetGrowthTrendQuery,
  useGetCountryGrowthQuery,
  useGetDashboardRecentActivitiesQuery,
  useGetTopDownloadedRecipesQuery,
  useGetTopRecipesQuery,
  useGetTopCountriesQuery,
  useGetAppDownloadStatsQuery,
  useGetDownloadedPdfsQuery,
} = dashboardApi;
