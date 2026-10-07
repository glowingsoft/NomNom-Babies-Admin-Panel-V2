import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const countryApi = createApi({
  reducerPath: 'country',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Countries'],
  endpoints: (builder) => ({
    // Get All Countries
    getCountries: builder.query({
      query: (params) => ({
        url: API_ROUTES.COUNTRIES.ALL_COUNTRIES,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Countries'],
    }),

    // Create Country
    createCountry: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.COUNTRIES.CREATE_COUNTRY,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Countries'],
    }),

    // Update Country
    updateCountry: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.COUNTRIES.UPDATE_COUNTRY(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Countries'],
    }),

    // Delete Country
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.COUNTRIES.DELETE_COUNTRY(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Countries'],
    }),
  }),
});

export const { useGetCountriesQuery, useCreateCountryMutation, useUpdateCountryMutation, useToggleCountryMutation, useDeleteCountryMutation } = countryApi;
