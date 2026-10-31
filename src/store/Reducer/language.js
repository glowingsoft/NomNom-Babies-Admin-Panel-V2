import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

export const languageApi = createApi({
  reducerPath: 'language',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['Languages', 'Translations'],
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

    // Central editor: every key with one column per language
    getAllTranslations: builder.query({
      query: () => ({
        url: `${API_ROUTES.LANGUAGES.ALL_LANGUAGES}/translations`,
        method: 'GET',
        headers: { 'x-admin-access-token': ADMIN_ACCESS_TOKEN },
      }),
      providesTags: ['Translations'],
    }),

    // Save edited/added rows and deleted keys for all languages at once
    saveAllTranslations: builder.mutation({
      query: (body) => ({
        url: `${API_ROUTES.LANGUAGES.ALL_LANGUAGES}/translations`,
        method: 'PUT',
        body,
        headers: { 'x-admin-access-token': ADMIN_ACCESS_TOKEN },
      }),
      invalidatesTags: ['Languages', 'Translations'],
    }),

    // App texts of one language next to the English source texts
    getLanguageTranslations: builder.query({
      query: (id) => ({
        url: `${API_ROUTES.LANGUAGES.UPDATE_LANGUAGE(id)}/translations`,
        method: 'GET',
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Translations', id }],
    }),

    // Save App texts (bumps the version the app checks)
    updateLanguageTranslations: builder.mutation({
      query: ({ id, translations }) => ({
        url: `${API_ROUTES.LANGUAGES.UPDATE_LANGUAGE(id)}/translations`,
        method: 'PUT',
        body: { translations },
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Languages', { type: 'Translations', id }],
    }),
  }),
});

export const {
  useGetLanguagesQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useGetLanguageTranslationsQuery,
  useUpdateLanguageTranslationsMutation,
  useGetAllTranslationsQuery,
  useSaveAllTranslationsMutation,
} = languageApi;
