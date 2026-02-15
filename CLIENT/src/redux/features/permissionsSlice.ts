import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "client" | null;

interface PermissionsState {
  permissions: string[];
  role: UserRole;
  isLoaded: boolean;
}

interface SetPermissionsPayload {
  permissions: string[];
  role: UserRole;
}

const initialState: PermissionsState = {
  permissions: [],
  role: null,
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
      state.role = null;
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
