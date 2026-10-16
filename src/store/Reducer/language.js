import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const languageApi = createApi({
  reducerPath: 'language',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Languages'],
  endpoints: (builder) => ({
    // Get All Languages
    getLanguages: builder.query({
      query: (params) => ({
        url: API_ROUTES.LANGUAGES.ALL_LANGUAGES,
        method: 'GET',
        params,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: ['Languages'],
    }),

    // Create Language
    createLanguage: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.LANGUAGES.CREATE_LANGUAGE,
        method: 'POST',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Languages'],
    }),

    // Update Language
    updateLanguage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.LANGUAGES.UPDATE_LANGUAGE(id),
        method: 'PUT',
        body,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Languages'],
    }),

    // Delete Language
    deleteLanguage: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.LANGUAGES.DELETE_LANGUAGE(id),
        method: 'DELETE',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['Languages'],
    }),
  }),
});

export const { useGetLanguagesQuery, useCreateLanguageMutation, useUpdateLanguageMutation, useDeleteLanguageMutation } = languageApi;
