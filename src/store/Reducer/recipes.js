import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const recipeApi = createApi({
  reducerPath: 'recipe',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Recipes'],
  endpoints: (builder) => ({
    // Get All Recipes
    getRecipes: builder.query({
      query: (params) => ({
        url: API_ROUTES.RECIPES.ALL_RECIPES,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Recipes'],
    }),

    // Recipe Detail
    getRecipeById: builder.query({
      query: (id) => ({
        url: API_ROUTES.RECIPES.RECIPE_DETAILS(id),
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Recipes'],
    }),

    // Create Recipe
    createRecipe: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.RECIPES.CREATE_RECIPE,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Recipes'],
    }),

    // Update Recipe
    updateRecipe: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.RECIPES.UPDATE_RECIPE(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Recipes'],
    }),

    // Delete Recipe
    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.RECIPES.DELETE_RECIPE(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Recipes'],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApi;
