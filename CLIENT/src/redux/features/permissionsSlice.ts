import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface PermissionsState {
  permissions: String[];
  role: String;
  isLoaded: boolean;
}

interface SetPermissionsPayload {
  permissions: String[];
  role: String;
}

const initialState: PermissionsState = {
  permissions: [],
  role: "",
  isLoaded: false,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state: PermissionsState, action: PayloadAction<SetPermissionsPayload>) => {
      state.permissions = action.payload.permissions;
      state.role = action.payload.role;
      state.isLoaded = true;
    },
    clearPermissions: (state: PermissionsState) => {
      state.permissions = [];
      state.role = "";
      state.isLoaded = false;
    },
    addPermission: (state: PermissionsState, action: PayloadAction<string>) => {
      if (!state.permissions.includes(action.payload)) {
        state.permissions.push(action.payload);
      }
    },
    removePermission: (state: PermissionsState, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter(
        (permission) => permission !== action.payload
      );
    },
  },
});

export const {
  setPermissions,
  clearPermissions,
  addPermission,
  removePermission,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
