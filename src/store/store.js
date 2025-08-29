import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage in the browser)
import authReducer from "./authSlice";
import { combineReducers } from "redux";

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // We only want to persist auth data
};

// Combine reducers (if you have more than one slice, you can add them here)
const rootReducer = combineReducers({
  auth: authReducer,
});

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);
