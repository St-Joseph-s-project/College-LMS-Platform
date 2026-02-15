/**
 * Permission Constants - Updated for Rewards System
 */

export const ADMIN_PERMISSIONS = {
  DASHBOARD: "admin.dashboard.view",
  REWARDS: {
    VIEW: "admin.rewards.view",
    CREATE: "admin.rewards.create",
    TRACK: "admin.rewards.track",
    HISTORY: "admin.rewards.history",
  },
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

// Client backward compatibility - all routes use generic access permission
export const CLIENT_ACCESS = CLIENT_PERMISSIONS.ACCESS;

export const NOTIFICATIONS_VIEW = SHARED_PERMISSIONS.NOTIFICATIONS.VIEW;
export const MESSAGES_VIEW = SHARED_PERMISSIONS.MESSAGES.VIEW;
export const MESSAGES_SEND = SHARED_PERMISSIONS.MESSAGES.SEND;
