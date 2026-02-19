import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PERMISSIONS_NAME, ROLE_NAME } from "../../constants/appConstants";


interface PermissionsState {
  permissions: string[];
  role: string;
  isLoaded: boolean;
}

interface SetPermissionsPayload {
  permissions: string[];
  role: string;
}

const savedPermissions = sessionStorage.getItem(PERMISSIONS_NAME);
const savedRole = sessionStorage.getItem(ROLE_NAME);

const initialState: PermissionsState = {
  permissions: savedPermissions ? JSON.parse(savedPermissions) : [],
  role: savedRole || "",
  isLoaded: savedPermissions !== null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state: PermissionsState, action: PayloadAction<SetPermissionsPayload>) => {
      state.permissions = action.payload.permissions;
      state.role = action.payload.role;
      state.isLoaded = true;
      sessionStorage.setItem(PERMISSIONS_NAME, JSON.stringify(action.payload.permissions));
      sessionStorage.setItem(ROLE_NAME, action.payload.role);
    },
    clearPermissions: (state: PermissionsState) => {
      state.permissions = [];
      state.role = "";
      state.isLoaded = false;
      sessionStorage.removeItem(PERMISSIONS_NAME);
      sessionStorage.removeItem(ROLE_NAME);
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
