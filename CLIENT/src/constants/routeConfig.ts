<<<<<<< HEAD
import { createElement, type ComponentType, type ReactNode } from "react";
import {
  LayoutDashboard,
  Gift,
  Plus,
  TrendingUp,
=======
import React from "react";
import type { ComponentType, ReactNode } from "react";
import { 
  LayoutDashboard, 
  Gift, 
  Plus, 
  TrendingUp, 
>>>>>>> main
  History,
  ShoppingBag,
  BarChart3
} from "lucide-react";
import { ADMIN_PERMISSIONS } from "./permissions";
import {
  AdminDashboard,
  CreateReward,
  TrackReward,
  HistoryReward,
  ClientDashboard,
  RewardStore,
  RewardTrack,
} from "../pages";

/**
 * Route Configuration with Component Mapping
 */
export interface RouteConfig {
  path: string;
  permission: string;
  label: string;
  icon?: ReactNode;
  component?: ComponentType;
  children?: RouteConfig[];
}

/**
 * Admin Route Configuration with Components
 */
export const ADMIN_ROUTE_MAP: Record<string, RouteConfig> = {
  DASHBOARD: {
    path: "/dashboard/admin",
    permission: ADMIN_PERMISSIONS.DASHBOARD,
    label: "Dashboard",
<<<<<<< HEAD
    icon: createElement(LayoutDashboard, { size: 18 }),
=======
    icon: React.createElement(LayoutDashboard, { size: 18 }),
>>>>>>> main
    component: AdminDashboard,
  },
  REWARDS: {
    path: "/dashboard/admin/rewards",
    permission: ADMIN_PERMISSIONS.REWARDS.VIEW,
    label: "Rewards",
<<<<<<< HEAD
    icon: createElement(Gift, { size: 18 }),
=======
    icon: React.createElement(Gift, { size: 18 }),
>>>>>>> main
    children: [
      {
        path: "/dashboard/admin/rewards/create",
        permission: ADMIN_PERMISSIONS.REWARDS.CREATE,
        label: "Create Reward",
<<<<<<< HEAD
        icon: createElement(Plus, { size: 18 }),
=======
        icon: React.createElement(Plus, { size: 18 }),
>>>>>>> main
        component: CreateReward,
      },
      {
        path: "/dashboard/admin/rewards/track",
        permission: ADMIN_PERMISSIONS.REWARDS.TRACK,
        label: "Track Reward",
<<<<<<< HEAD
        icon: createElement(TrendingUp, { size: 18 }),
=======
        icon: React.createElement(TrendingUp, { size: 18 }),
>>>>>>> main
        component: TrackReward,
      },
      {
        path: "/dashboard/admin/rewards/history",
        permission: ADMIN_PERMISSIONS.REWARDS.HISTORY,
        label: "History Reward",
<<<<<<< HEAD
        icon: createElement(History, { size: 18 }),
=======
        icon: React.createElement(History, { size: 18 }),
>>>>>>> main
        component: HistoryReward,
      },
    ],
  },
};

/**
 * Client Route Configuration with Components
 */
export const CLIENT_ROUTE_MAP: Record<string, RouteConfig> = {
  DASHBOARD: {
    path: "/dashboard/student",
    permission: "client.access", // Generic permission - not used for filtering
    label: "Dashboard",
<<<<<<< HEAD
    icon: createElement(LayoutDashboard, { size: 18 }),
=======
    icon: React.createElement(LayoutDashboard, { size: 18 }),
>>>>>>> main
    component: ClientDashboard,
  },
  REWARDS: {
    path: "/dashboard/student/rewards",
    permission: "client.access", // Generic permission - not used for filtering
    label: "Rewards",
<<<<<<< HEAD
    icon: createElement(Gift, { size: 18 }),
=======
    icon: React.createElement(Gift, { size: 18 }),
>>>>>>> main
    children: [
      {
        path: "/dashboard/student/rewards/store",
        permission: "client.access", // Generic permission - not used for filtering
        label: "Store",
<<<<<<< HEAD
        icon: createElement(ShoppingBag, { size: 18 }),
=======
        icon: React.createElement(ShoppingBag, { size: 18 }),
>>>>>>> main
        component: RewardStore,
      },
      {
        path: "/dashboard/student/rewards/track",
        permission: "client.access", // Generic permission - not used for filtering
        label: "Track",
<<<<<<< HEAD
        icon: createElement(BarChart3, { size: 18 }),
=======
        icon: React.createElement(BarChart3, { size: 18 }),
>>>>>>> main
        component: RewardTrack,
      },
    ],
  },
};

export const ADMIN_ROUTES: RouteConfig[] = Object.values(ADMIN_ROUTE_MAP);
export const CLIENT_ROUTES: RouteConfig[] = Object.values(CLIENT_ROUTE_MAP);

export const getAdminRoute = (key: keyof typeof ADMIN_ROUTE_MAP): RouteConfig => {
  return ADMIN_ROUTE_MAP[key];
};

export const getClientRoute = (key: keyof typeof CLIENT_ROUTE_MAP): RouteConfig => {
  return CLIENT_ROUTE_MAP[key];
};

export const getRoutesByRole = (role: "admin" | "client"): RouteConfig[] => {
  return role === "admin" ? ADMIN_ROUTES : CLIENT_ROUTES;
};

export const getRouteMapByRole = (
  role: "admin" | "client"
): Record<string, RouteConfig> => {
  return role === "admin" ? ADMIN_ROUTE_MAP : CLIENT_ROUTE_MAP;
};

export const hasPermission = (
  userPermissions: string[],
  requiredPermission: string
): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const filterRoutesByPermissions = (
  routes: RouteConfig[],
  userPermissions: string[]
): RouteConfig[] => {
  return routes
    .filter((route) => hasPermission(userPermissions, route.permission))
    .map((route) => {
      if (route.children) {
        return {
          ...route,
          children: filterRoutesByPermissions(route.children, userPermissions),
        };
      }
      return route;
    });
};

export const getRouteByPath = (
  path: string,
  role: "admin" | "client"
): RouteConfig | undefined => {
  const routeMap = getRouteMapByRole(role);
  return Object.values(routeMap).find((route) => route.path === path);
};

/**
 * Flatten routes to get all routes including nested children
 */
export const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  const flattened: RouteConfig[] = [];

  routes.forEach((route) => {
    if (route.component) {
      flattened.push(route);
    }
    if (route.children) {
      flattened.push(...flattenRoutes(route.children));
    }
  });

  return flattened;
};

/**
 * Get all child routes for rendering
 */
export const getAllChildRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  return flattenRoutes(routes).filter(route => route.component);
};
