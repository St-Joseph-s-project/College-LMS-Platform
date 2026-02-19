/**
 * Permission Constants - Updated for Rewards System
 */

export const ADMIN_PERMISSIONS = {
  DASHBOARD: "LMS_DASHBOARD_VIEW",
  REWARDS: {
    VIEW: "LMS_REWARDS_VIEW",
    CREATE: "LMS_REWARDS_ADD",
    TRACK: "LMS_REWARDS_TRACK",
    HISTORY: "LMS_REWARDS_HISTORY",
    DELETE: "LMS_REWARDS_DELETE",
    UPDATE: "LMS_REWARDS_UPDATE"
  },
  COURSE: {
    VIEW: "LMS_COURSE_VIEW",
    CREATE: "LMS_COURSE_ADD",
    DELETE: "LMS_COURSE_DELETE",
    UPDATE: "LMS_COURSE_UPDATE"
  },
  MODULE: {
    VIEW: "LMS_MODULE_VIEW",
    CREATE: "LMS_MODULE_ADD",
    UPDATE: "LMS_MODULE_UPDATE",
    DELETE: "LMS_MODULE_DELETE"
  },
  SUBMODULE: {
    VIEW: "LMS_SUBMODULE_VIEW",
    CREATE: "LMS_SUBMODULE_ADD",
    UPDATE: "LMS_SUBMODULE_UPDATE",
    DELETE: "LMS_SUBMODULE_DELETE"
  }
} as const;

// Client permissions - simplified as client routes don't use permission-based filtering
export const CLIENT_PERMISSIONS = {
  ACCESS: "client.access", // Generic permission for all client routes
} as const;

export const SHARED_PERMISSIONS = {
  NOTIFICATIONS: {
    VIEW: "notifications.view",
  },
  MESSAGES: {
    VIEW: "messages.view",
    SEND: "messages.send",
  },
} as const;

export const PERMISSIONS = {
  ADMIN: ADMIN_PERMISSIONS,
  CLIENT: CLIENT_PERMISSIONS,
  SHARED: SHARED_PERMISSIONS,
} as const;

