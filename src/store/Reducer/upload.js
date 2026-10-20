import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const uploadApi = createApi({
  reducerPath: 'upload',
  baseQuery: createCustomFetchBaseQuery(),
  endpoints: (builder) => ({
    // Upload image(s) to S3. Accepts a File or an array of Files.
    // Response data: { file, fileUrl, fileExtension } (single) or an array of them.
    uploadFiles: builder.mutation({
      query: (files) => {
        const formData = new FormData();
        [].concat(files).forEach((file) => formData.append('files', file));

        return {
          url: API_ROUTES.UPLOAD.S3,
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Delete file(s) from S3 by key (the `file` value from the upload response).
    deleteFiles: builder.mutation({
      query: (fileKey) => ({
        url: API_ROUTES.UPLOAD.S3,
        method: 'DELETE',
        body: { fileKey },
      }),
    }),
  }),
});

export const { useUploadFilesMutation, useDeleteFilesMutation } = uploadApi;
