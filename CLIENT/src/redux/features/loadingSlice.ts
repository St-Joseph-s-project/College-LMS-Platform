import { createSlice } from "@reduxjs/toolkit";

type loadingState = {
  isLoading: boolean;
}

const initialState: loadingState = {
  isLoading: false
}

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoadingTrue: (state) => {
      state.isLoading = true;
    },

    setLoadingFalse: (state) => {
      state.isLoading = false;
    }
  }
})

export const { setLoadingTrue, setLoadingFalse } = loadingSlice.actions;

export default loadingSlice.reducer;