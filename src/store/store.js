import { configureStore, createAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from './Reducer/auth';
import userReducer from './slices/userSlice';
import { walletsApi } from './Reducer/wallets-api';
import { categoriesApi } from './Reducer/categories-api';
import { settingsApi } from './Reducer/settings';
import { languageApi } from './Reducer/language';
import { countryApi } from './Reducer/country';
import { mealsApi } from './Reducer/meals';
import { groceryListApi } from './Reducer/groceryList';
import { recipeApi } from './Reducer/recipes';
import { nutritionApi } from './Reducer/nutrition';
import { babyStageApi } from './Reducer/babyStage';
import { usersApi } from './Reducer/users';
import { activitiesApi } from './Reducer/activities';
import { dashboardApi } from './Reducer/dashboard';
import { supportApi } from './Reducer/support';
import { uploadApi } from './Reducer/upload';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

// Action to reset all API caches
export const resetApiState = createAction('api/resetApiState');

// Create a persisted reducer for the user slice
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store with the persisted reducer for the user slice
export const store = configureStore({
  reducer: {
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [walletsApi.reducerPath]: walletsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [languageApi.reducerPath]: languageApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [mealsApi.reducerPath]: mealsApi.reducer,
    [groceryListApi.reducerPath]: groceryListApi.reducer,
    [recipeApi.reducerPath]: recipeApi.reducer,
    [nutritionApi.reducerPath]: nutritionApi.reducer,
    [babyStageApi.reducerPath]: babyStageApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [activitiesApi.reducerPath]: activitiesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      walletsApi.middleware,
      categoriesApi.middleware,
      settingsApi.middleware,
      languageApi.middleware,
      countryApi.middleware,
      mealsApi.middleware,
      groceryListApi.middleware,
      recipeApi.middleware,
      nutritionApi.middleware,
      babyStageApi.middleware,
      usersApi.middleware,
      activitiesApi.middleware,
      dashboardApi.middleware,
      supportApi.middleware,
      uploadApi.middleware
    ),
});

// Initialize Redux Persist
export const persistor = persistStore(store);

// Setup listeners
setupListeners(store.dispatch);

// import { configureStore, createAction } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { authApi } from './Reducer/auth';
// import userReducer from './slices/userSlice';
// import { walletsApi } from './Reducer/wallets-api';
// import { transactionsApi } from './Reducer/transactions-api';
// import { categoriesApi } from './Reducer/categories-api';

// const persistConfig = {
//   key: 'root',
//   storage,
//   // whitelist: ['user'],
// };

// export const resetStore = createAction('RESET_STORE');

// // Create a persisted reducer for the user slice
// const persistedUserReducer = persistReducer(persistConfig, userReducer);

// // Create the Redux store with the persisted reducer for the user slice
// export const store = configureStore({
//   reducer: {
//     [categoriesApi.reducerPath]: categoriesApi.reducer,
//     [transactionsApi.reducerPath]: transactionsApi.reducer,
//     [walletsApi.reducerPath]: walletsApi.reducer,
//     [authApi.reducerPath]: authApi.reducer,
//     user: persistedUserReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
//       },
//     }).concat(authApi.middleware,
//       walletsApi.middleware, transactionsApi.middleware, categoriesApi.middleware),
// });

// // Initialize Redux Persist
// export const persistor = persistStore(store);

// // Setup listeners
// setupListeners(store.dispatch);
