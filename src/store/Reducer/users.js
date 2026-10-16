import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    // Get All Users
    getAllUsers: builder.query({
      query: (params) => ({
        url: API_ROUTES.USERS.ALL_USERS,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Users'],
    }),

    // User Detail
    getUserDetails: builder.query({
      query: (id) => ({
        url: API_ROUTES.USERS.USER_DETAILS(id),
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Update User Status
    updateUserStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.USERS.UPDATE_USER(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: (result, error, { id }) => ['Users', { type: 'User', id }],
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.USERS.DELETE_USER(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserDetailsQuery, useUpdateUserStatusMutation, useDeleteUserMutation } = usersApi;
