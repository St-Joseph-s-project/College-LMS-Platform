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

// Backward compatibility exports
export const ADMIN_DASHBOARD = ADMIN_PERMISSIONS.DASHBOARD;
export const ADMIN_REWARDS_VIEW = ADMIN_PERMISSIONS.REWARDS.VIEW;
export const ADMIN_REWARDS_CREATE = ADMIN_PERMISSIONS.REWARDS.CREATE;
export const ADMIN_REWARDS_TRACK = ADMIN_PERMISSIONS.REWARDS.TRACK;
export const ADMIN_REWARDS_HISTORY = ADMIN_PERMISSIONS.REWARDS.HISTORY;

export const ADMIN_COURSE_VIEW = ADMIN_PERMISSIONS.COURSE.VIEW
export const ADMIN_COURSE_CREATE = ADMIN_PERMISSIONS.COURSE.CREATE
export const ADMIN_COURSE_UPDATE =ADMIN_PERMISSIONS.COURSE.UPDATE
export const ADMIN_COURSE_DELETE = ADMIN_PERMISSIONS.COURSE.DELETE

// Client backward compatibility - all routes use generic access permission
export const CLIENT_ACCESS = CLIENT_PERMISSIONS.ACCESS;

export const NOTIFICATIONS_VIEW = SHARED_PERMISSIONS.NOTIFICATIONS.VIEW;
export const MESSAGES_VIEW = SHARED_PERMISSIONS.MESSAGES.VIEW;
export const MESSAGES_SEND = SHARED_PERMISSIONS.MESSAGES.SEND;

