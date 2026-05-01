import { configureStore } from '@reduxjs/toolkit';

import { visitorsApi } from '@/store/visitorsApi';

export const store = configureStore({
	reducer: {
		[visitorsApi.reducerPath]: visitorsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(visitorsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
