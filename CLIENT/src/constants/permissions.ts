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

export const CLIENT_PERMISSIONS = {
  DASHBOARD: "client.dashboard.view",
  REWARDS: {
    VIEW: "client.rewards.view",
    STORE: "client.rewards.store",
    TRACK: "client.rewards.track",
  },
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

export const CLIENT_DASHBOARD = CLIENT_PERMISSIONS.DASHBOARD;
export const CLIENT_REWARDS_VIEW = CLIENT_PERMISSIONS.REWARDS.VIEW;
export const CLIENT_REWARDS_STORE = CLIENT_PERMISSIONS.REWARDS.STORE;
export const CLIENT_REWARDS_TRACK = CLIENT_PERMISSIONS.REWARDS.TRACK;

export const NOTIFICATIONS_VIEW = SHARED_PERMISSIONS.NOTIFICATIONS.VIEW;
export const MESSAGES_VIEW = SHARED_PERMISSIONS.MESSAGES.VIEW;
export const MESSAGES_SEND = SHARED_PERMISSIONS.MESSAGES.SEND;
