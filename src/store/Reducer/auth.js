import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['profile'],
  endpoints: (builder) => ({
    // Admin-Login
    adminLogin: builder.mutation({
      query: (login) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: 'POST',
        body: login,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
    }),

    // Change-Password
    adminChangePassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.CHANGE_PASSWORD,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
    }),

    // Get-Profile
    getMyProfile: builder.query({
      query: () => ({
        url: API_ROUTES.AUTH.PROFILE,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['profile'],
    }),

    // Update-Profile
    updateProfile: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.UPDATE_PROFILE,
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['profile'],
    }),

    // Admin-Logout
    adminLogout: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['profile'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useAdminLogoutMutation,
} = authApi;
