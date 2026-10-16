import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const nutritionApi = createApi({
  reducerPath: 'nutrition',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Nutritions'],
  endpoints: (builder) => ({
    // Get All Nutritions
    getNutritions: builder.query({
      query: (params) => ({
        url: API_ROUTES.NUTRITIONS.ALL_NUTRITIONS,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Nutritions'],
    }),

    // Create Nutrition
    createNutrition: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.NUTRITIONS.CREATE_NUTRITION,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Nutritions'],
    }),

    // Update Nutrition
    updateNutrition: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.NUTRITIONS.UPDATE_NUTRITION(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Nutritions'],
    }),

    // Delete Nutrition
    deleteNutrition: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.NUTRITIONS.DELETE_NUTRITION(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Nutritions'],
    }),
  }),
});

export const { useGetNutritionsQuery, useCreateNutritionMutation, useUpdateNutritionMutation, useDeleteNutritionMutation } = nutritionApi;
