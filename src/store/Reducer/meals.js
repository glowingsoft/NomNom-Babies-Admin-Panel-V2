import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const mealsApi = createApi({
  reducerPath: 'meals',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Meals'],
  endpoints: (builder) => ({
    // Get All Meals
    getMeals: builder.query({
      query: (params) => ({
        url: API_ROUTES.MEALS.ALL_MEALS,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Meals'],
    }),

    // Create Meal
    createMeal: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.MEALS.CREATE_MEAL,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Meals'],
    }),

    // Update Meal
    updateMeal: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.MEALS.UPDATE_MEAL(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Meals'],
    }),

    // Delete Meal
    deleteMeal: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.MEALS.DELETE_MEAL(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Meals'],
    }),
  }),
});

export const {
  useGetMealsQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = mealsApi;
