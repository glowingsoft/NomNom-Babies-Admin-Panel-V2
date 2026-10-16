import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const babyStageApi = createApi({
  reducerPath: 'babyStage',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['BabyStages'],
  endpoints: (builder) => ({
    // Get All BabyStages
    getBabyStages: builder.query({
      query: (params) => ({
        url: API_ROUTES.BABYSTAGES.ALL_BABYSTAGES,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['BabyStages'],
    }),

    // Create BabyStage
    createBabyStage: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.BABYSTAGES.CREATE_BABYSTAGE,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['BabyStages'],
    }),

    // Update BabyStage
    updateBabyStage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.BABYSTAGES.UPDATE_BABYSTAGE(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['BabyStages'],
    }),

    // Delete BabyStage
    deleteBabyStage: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.BABYSTAGES.DELETE_BABYSTAGE(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['BabyStages'],
    }),
  }),
});

export const { useGetBabyStagesQuery, useCreateBabyStageMutation, useUpdateBabyStageMutation, useDeleteBabyStageMutation } = babyStageApi;
