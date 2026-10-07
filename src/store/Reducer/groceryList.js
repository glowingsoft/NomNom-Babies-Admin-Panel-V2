import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const groceryListApi = createApi({
  reducerPath: 'groceryList',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['GroceryLists'],
  endpoints: (builder) => ({
    // Get All Grocery Lists
    getGroceryLists: builder.query({
      query: (params) => ({
        url: API_ROUTES.GROCERY_LISTS.ALL_GROCERY_LISTS,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['GroceryLists'],
    }),

    // Grocery List Detail
    getGroceryListById: builder.query({
      query: (id) => ({
        url: API_ROUTES.GROCERY_LISTS.GROCERY_LIST_DETAILS(id),
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['GroceryLists'],
    }),
  }),
});

export const { useGetGroceryListsQuery, useGetGroceryListByIdQuery } = groceryListApi;
