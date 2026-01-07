import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../../config';
import { authStorage } from '../../auth/utils/storage';
import type { ContactRecord } from '../types/contacts';

export const contactsApi = createApi({
  reducerPath: 'contactsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = authStorage.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Contacts'],
  endpoints: (builder) => ({
    getContacts: builder.query<ContactRecord[], void>({
      query: () => '/api/contacts',
      providesTags: ['Contacts'],
    }),
    createContact: builder.mutation<ContactRecord, Partial<ContactRecord>>({
      query: (data) => ({
        url: '/api/contacts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contacts'],
    }),
    updateContact: builder.mutation<
      ContactRecord,
      { id: string; data: Partial<ContactRecord> }
    >({
      query: ({ id, data }) => ({
        url: `/api/contacts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contacts'],
    }),
    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contacts'],
    }),
    updateFavorite: builder.mutation<
      ContactRecord,
      { id: string; favorite: boolean }
    >({
      query: ({ id, favorite }) => ({
        url: `/api/contacts/${id}`,
        method: 'PUT',
        body: { favorite },
      }),
      invalidatesTags: ['Contacts'],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useUpdateFavoriteMutation,
} = contactsApi;
export default contactsApi;
