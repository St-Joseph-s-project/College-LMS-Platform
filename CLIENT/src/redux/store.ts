import { configureStore } from "@reduxjs/toolkit";
import { loadingReduce, jwtSlice, permissionsSlice } from "./features/index";

export const store = configureStore({
  reducer: {
    loading: loadingReduce,
    jwtSlice: jwtSlice,
    permissions: permissionsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;