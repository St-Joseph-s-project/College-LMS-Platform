import { apiClient } from "../api/api.sharing.serivce";

/**
 * API service for permission checks
 */
export const checkPermissionAPI = async (
  permission: string
): Promise<{ hasAccess: boolean }> => {
  try {
    const response = await apiClient.post("/api/permissions/check", {
      permission,
    });
    return response.data;
  } catch (error) {
    console.error("Permission check failed:", error);
    return { hasAccess: false };
  }
};

/**
 * Fetch user permissions from backend
 */
export const fetchUserPermissions = async (): Promise<{
  permissions: string[];
  role: "admin" | "client";
}> => {
  try {
    const response = await apiClient.get("/api/permissions/user");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
    throw error;
  }
};
