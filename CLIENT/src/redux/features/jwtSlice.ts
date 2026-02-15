import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JWT_TOKEN_NAME } from "../../constants/appConstants";

type jwtState = {
  jwtToken: string | null,
  userId: string | null
}

type saveState = {
  jwtToken: string ,
  userId: string,
  refreshToken?: string // Optional, since it's now in cookies
}

const initialState: jwtState = {
  jwtToken: null,
  userId: null
}

const jwtSlice = createSlice({
  name: "jwt",
  initialState,
  reducers: {
    setJWTToken: (state, action: PayloadAction<saveState>) => {
      state.jwtToken = action.payload.jwtToken;
      sessionStorage.setItem(JWT_TOKEN_NAME, action.payload.jwtToken || "");
      // Refresh token is now handled via httpOnly cookies, no need to store in localStorage
    },
    clearJWTToken: (state) => {
      state.jwtToken = null;
      state.userId = null;
      sessionStorage.removeItem(JWT_TOKEN_NAME);
      // Refresh token cookie will be cleared by backend on logout
    }
  }
});

export const { setJWTToken, clearJWTToken } = jwtSlice.actions;
export default jwtSlice.reducer;