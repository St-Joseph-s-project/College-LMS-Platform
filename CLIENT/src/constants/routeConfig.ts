import React from "react";
import type { ComponentType, ReactNode } from "react";
import {
  LayoutDashboard,
  Gift,
  Plus,
  TrendingUp,
  History,
  ShoppingBag,
  BarChart3,
  BookOpen,
  FilePlus,
  Layers,
  FileText,
  Map,
  Settings2,
  MapPin,
  Library,
  Book
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
  CreateCourse,
  ModulePage,
  SubModulePage,
  RoadMapCreate,
  RoadMapManage,
  ClientRoadMap,
  ClientAllCourse,
  ClientCourse
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
  showInSidebar?: boolean;
}

/**
 * Admin Route Configuration with Components
 */
export const ADMIN_ROUTE_MAP: Record<string, RouteConfig> = {
  DASHBOARD: {
    path: "/dashboard/admin",
    permission: ADMIN_PERMISSIONS.DASHBOARD,
    label: "Dashboard",
    icon: React.createElement(LayoutDashboard, { size: 18 }),
    component: AdminDashboard,
  },
  REWARDS: {
    path: "/dashboard/admin/rewards",
    permission: ADMIN_PERMISSIONS.REWARDS.VIEW,
    label: "Rewards",
    icon: React.createElement(Gift, { size: 18 }),
    component: CreateReward,
    children: [
      {
        path: "/dashboard/admin/rewards/create",
        permission: ADMIN_PERMISSIONS.REWARDS.CREATE,
        label: "Create Reward",
        icon: React.createElement(Plus, { size: 18 }),
        component: CreateReward,
      },
      {
        path: "/dashboard/admin/rewards/track",
        permission: ADMIN_PERMISSIONS.REWARDS.TRACK,
        label: "Track Reward",
        icon: React.createElement(TrendingUp, { size: 18 }),
        component: TrackReward,
      },
      {
        path: "/dashboard/admin/rewards/history",
        permission: ADMIN_PERMISSIONS.REWARDS.HISTORY,
        label: "History Reward",
        icon: React.createElement(History, { size: 18 }),
        component: HistoryReward,
      },
    ],
  },
  COURSE: {
    path: "/dashboard/admin/course",
    permission: ADMIN_PERMISSIONS.COURSE.VIEW,
    label: "Course",
    icon: React.createElement(BookOpen, { size: 18 }),
    children: [
      {
        path: "/dashboard/admin/couse/create",
        permission: ADMIN_PERMISSIONS.COURSE.CREATE,
        label: "Create Course",
        icon: React.createElement(FilePlus, { size: 18 }),
        component: CreateCourse,
      },
      {
        path: "/dashboard/admin/module/create",
        permission: ADMIN_PERMISSIONS.MODULE.CREATE,
        label: "Create Module",
        icon: React.createElement(Layers, { size: 18 }),
        component: ModulePage,
        
      },
      {
        path: "/dashboard/admin/module/create/:courseId",
        permission: ADMIN_PERMISSIONS.MODULE.CREATE,
        label: "Create Module",
        icon: React.createElement(Layers, { size: 18 }),
        component: ModulePage,
        showInSidebar: false
      },
      {
        path: "/dashboard/admin/submodule/:courseId/:moduleId",
        permission: ADMIN_PERMISSIONS.SUBMODULE.CREATE,
        label: "Create Submodule",
        icon: React.createElement(FileText, { size: 18 }),
        component: SubModulePage,
        showInSidebar: false
      }
    ]
  },
  ROADMAP: {
    path: "/dashboard/admin/roadmap",
    permission: ADMIN_PERMISSIONS.ROAMAP.VIEW,
    label: "RoadMap",
    icon: React.createElement(Map, { size: 18 }),
    children: [
      {
        path: "/dashboard/admin/roadmap/create",
        permission: ADMIN_PERMISSIONS.ROAMAP.CREATE,
        label: "Roadmap Manage",
        icon: React.createElement(Settings2, { size: 18 }),
        component: RoadMapCreate,
      },
      {
        path: "/dashboard/admin/roadmap/manage/:roadmapId",
        permission: ADMIN_PERMISSIONS.ROAMAP.UPDATE,
        label: "Manage Roadmap",
        icon: React.createElement(MapPin, { size: 18 }),
        component: RoadMapManage,
        showInSidebar: false
      }
    ]
  }
};

/**
 * Client Route Configuration with Components
 */
export const CLIENT_ROUTE_MAP: Record<string, RouteConfig> = {
  DASHBOARD: {
    path: "/dashboard/student",
    permission: "client.access", // Generic permission - not used for filtering
    label: "Dashboard",
    icon: React.createElement(LayoutDashboard, { size: 18 }),
    component: ClientDashboard,
  },
  REWARDS: {
    path: "/dashboard/student/rewards",
    permission: "client.access", // Generic permission - not used for filtering
    label: "Rewards",
    icon: React.createElement(Gift, { size: 18 }),
    children: [
      {
        path: "/dashboard/student/rewards/store",
        permission: "client.access", // Generic permission - not used for filtering
        label: "Store",
        icon: React.createElement(ShoppingBag, { size: 18 }),
        component: RewardStore,
      },
      {
        path: "/dashboard/student/rewards/track",
        permission: "client.access", // Generic permission - not used for filtering
        label: "Track",
        icon: React.createElement(BarChart3, { size: 18 }),
        component: RewardTrack,
      },
    ],
  },
  ROADMAP: {
    path: "/dashboard/student/roadmap",
    permission: "client.access", // Generic permission - not used for filtering
    label: "RoadMap",
    icon: React.createElement(Map, { size: 18 }),
    children: [
      {
        path: "/dashboard/student/roadmap/all-roadmap",
        permission: "client.access", // Generic permission - not used for filtering
        label: "All Roadmaps",
        icon: React.createElement(Library, { size: 18 }),
        component: ClientRoadMap,
      },
      {
        path: "/dashboard/student/roadmap/all-course/:roadmapId",
        permission: "client.access", // Generic permission - not used for filtering
        label: "All Course",
        icon: React.createElement(BookOpen, { size: 18 }),
        component: ClientAllCourse,
        showInSidebar: false
      },
      {
        path: "/dashboard/student/roadmap/course/:courseId",
        permission: "client.access", // Generic permission - not used for filtering
        label: "Course",
        icon: React.createElement(Book, { size: 18 }),
        component: ClientCourse,
        showInSidebar: false  
      }
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
  userPermissions: String[],
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
