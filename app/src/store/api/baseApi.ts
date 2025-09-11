import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/utils/constants';
import type {
  User,
  Bill,
  LoginRequest,
  RegisterRequest,
  CreateBillRequest,
  PaginatedResponse,
} from '@/types';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async headers => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Bill', 'Category'],
  endpoints: builder => ({
    login: builder.mutation<{ token: string; user: User }, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
          console.error('Failed to store auth data:', error);
        }
      },
    }),

    register: builder.mutation<
      { token: string; message: string },
      RegisterRequest
    >({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem('token', data.token);
        } catch (error) {
          console.error('Failed to store token:', error);
        }
      },
    }),

    validateToken: builder.query<User, string>({
      query: token => ({
        url: '/auth/validate',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['User'],
    }),

    getBills: builder.query<
      PaginatedResponse<Bill>,
      {
        page?: number;
        limit?: number;
        category?: string;
        type?: string;
      }
    >({
      query: params => ({
        url: '/bills',
        params,
      }),
      providesTags: result =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Bill' as const, id })),
              { type: 'Bill', id: 'LIST' },
            ]
          : [{ type: 'Bill', id: 'LIST' }],
    }),

    createBill: builder.mutation<Bill, CreateBillRequest>({
      query: billData => ({
        url: '/bills',
        method: 'POST',
        body: billData,
      }),
      invalidatesTags: [{ type: 'Bill', id: 'LIST' }],
    }),

    updateBill: builder.mutation<
      Bill,
      { id: string; data: Partial<CreateBillRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/bills/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Bill', id },
        { type: 'Bill', id: 'LIST' },
      ],
    }),

    deleteBill: builder.mutation<void, string>({
      query: id => ({
        url: `/bills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Bill', id },
        { type: 'Bill', id: 'LIST' },
      ],
    }),

    syncBills: builder.mutation<any, Bill[]>({
      query: bills => ({
        url: '/bills/sync',
        method: 'POST',
        body: { bills },
      }),
      invalidatesTags: [{ type: 'Bill', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useValidateTokenQuery,
  useGetBillsQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
  useSyncBillsMutation,
} = api;
