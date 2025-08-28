import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import billsReducer from './slices/billsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bills: billsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;