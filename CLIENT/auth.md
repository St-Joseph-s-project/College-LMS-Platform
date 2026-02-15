# Authentication & Rendering Flow Guide

## 📋 Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [How Rendering Works](#how-rendering-works)
3. [Adding New Pages](#adding-new-pages)
4. [Modifying the Sidebar](#modifying-the-sidebar)
5. [Complete Flow Diagram](#complete-flow-diagram)

---

## 🔐 Authentication Flow

### Step 1: User Login

When a user logs in, your backend should return:

```json
{
  "accessToken": "jwt_token_here",
  "userId": "user_123",
  "role": "admin",  // or "client"
  "permissions": [
    "admin.dashboard.view",
    "admin.rewards.view",
    "admin.rewards.create"
  ]
}
```

### Step 2: Store Auth Data in Redux

In your login handler (e.g., `Login.tsx`):

```typescript
import { useAppDispatch } from './redux/hooks';
import { setJWTToken } from './redux/features/jwtSlice';
import { setPermissions } from './redux/features/permissionsSlice';

const handleLogin = async (credentials) => {
  const response = await loginAPI(credentials);
  
  // 1. Store JWT token
  dispatch(setJWTToken({
    jwtToken: response.accessToken,
    userId: response.userId
  }));
  
  // 2. Store permissions and role
  dispatch(setPermissions({
    permissions: response.permissions,
    role: response.role
  }));
  
  // 3. Navigate to dashboard
  navigate(response.role === 'admin' ? '/dashboard/admin' : '/dashboard/client');
};
```

### Step 3: Redux State Structure

**JWT Slice** (`redux/features/jwtSlice.ts`):
```typescript
{
  jwtToken: "token_here",
  userId: "user_123"
}
```

**Permissions Slice** (`redux/features/permissionsSlice.ts`):
```typescript
{
  permissions: ["admin.dashboard.view", "admin.rewards.create"],
  role: "admin",
  isLoaded: true
}
```

---

## 🎨 How Rendering Works

### The Complete Flow

```
User navigates to /dashboard/admin/rewards/create
         ↓
App.tsx catches the route
         ↓
ProtectedRoute checks authentication
         ↓
ProtectedRoute checks permissions
         ↓
AdminLayout renders with Sidebar
         ↓
Sidebar filters routes by permissions
         ↓
RouteRenderer renders the component
         ↓
CreateReward component displays
```

### 1. Route Protection (`components/ProtectedRoute.tsx`)

Every route is wrapped in `ProtectedRoute`:

```typescript
<ProtectedRoute requiredPermission="admin.rewards.create">
  <CreateReward />
</ProtectedRoute>
```

**Protection Logic:**
1. **Check Authentication**: Is `jwtToken` present?
   - ❌ No → Redirect to `/login`
   - ✅ Yes → Continue

2. **Check Permissions Loaded**: Is `isLoaded` true?
   - ❌ No → Show loading spinner
   - ✅ Yes → Continue

3. **Check Permission**: Does user have `requiredPermission`?
   - ❌ No → Redirect to `/unauthorized`
   - ✅ Yes → Render component

### 2. Layout Rendering (`components/layouts/AdminLayout.tsx`)

```typescript
const AdminLayout = () => {
  const { permissions } = useAppSelector(state => state.permissions);
  
  // Filter routes based on user's permissions
  const allowedRoutes = filterRoutesByPermissions(ADMIN_ROUTES, permissions);
  
  return (
    <div>
      <Sidebar routes={allowedRoutes} onNavigate={handleNavigate} />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
};
```

### 3. Sidebar Rendering (`components/Sidebar.tsx`)

The sidebar receives **filtered routes** (only routes the user has permission for):

```typescript
<Sidebar routes={allowedRoutes} onNavigate={handleNavigate} />
```

**Sidebar Logic:**
- Loops through `routes` array
- Renders menu items with icons and labels
- Handles nested children (expand/collapse)
- Highlights active route
- Collapses to 60px / expands to 240px

### 4. Dynamic Route Rendering (`config/RouteRenderer.tsx`)

```typescript
<RouteRenderer routes={ADMIN_ROUTES} basePath="/dashboard/admin" />
```

**RouteRenderer Logic:**
- Loops through route configuration
- Extracts relative paths
- Wraps each component in `ProtectedRoute`
- Renders nested children recursively

---

## ➕ Adding New Pages

### Complete Example: Adding "Manage Rewards" Page

#### Step 1: Create the Page Component

```bash
# Create file: pages/admin/ManageRewards.tsx
```

```typescript
import React from "react";

const ManageRewards: React.FC = () => {
  return (
    <div>
      <h1>Manage Rewards</h1>
      <p>Manage all rewards in the system</p>
    </div>
  );
};

export default ManageRewards;
```

#### Step 2: Export from Pages Index

```typescript
// pages/index.ts
export { default as ManageRewards } from "./admin/ManageRewards";
```

#### Step 3: Add Permission Constant

```typescript
// constants/permissions.ts
export const ADMIN_PERMISSIONS = {
  DASHBOARD: "admin.dashboard.view",
  REWARDS: {
    VIEW: "admin.rewards.view",
    CREATE: "admin.rewards.create",
    TRACK: "admin.rewards.track",
    HISTORY: "admin.rewards.history",
    MANAGE: "admin.rewards.manage",  // ← New permission
  },
};
```

#### Step 4: Add to Route Configuration

```typescript
// constants/routeConfig.ts
import { ManageRewards } from "../pages";

export const ADMIN_ROUTE_MAP = {
  DASHBOARD: { ... },
  REWARDS: {
    path: "/dashboard/admin/rewards",
    permission: ADMIN_PERMISSIONS.REWARDS.VIEW,
    label: "Rewards",
    icon: "🎁",
    children: [
      {
        path: "/dashboard/admin/rewards/create",
        permission: ADMIN_PERMISSIONS.REWARDS.CREATE,
        label: "Create Reward",
        icon: "➕",
        component: CreateReward,
      },
      {
        path: "/dashboard/admin/rewards/manage",  // ← New route
        permission: ADMIN_PERMISSIONS.REWARDS.MANAGE,
        label: "Manage Rewards",
        icon: "⚙️",
        component: ManageRewards,
      },
      // ... other children
    ],
  },
};
```

#### Step 5: Update Backend

Make sure your backend returns the new permission:

```json
{
  "permissions": [
    "admin.dashboard.view",
    "admin.rewards.view",
    "admin.rewards.manage"  // ← Include this
  ]
}
```

**Done!** The page will automatically:
- ✅ Appear in the sidebar (if user has permission)
- ✅ Be protected by authentication
- ✅ Be protected by permission check
- ✅ Render when navigated to

---

## 🎛️ Modifying the Sidebar

### Change Sidebar Appearance

Edit `components/Sidebar.tsx`:

```typescript
// Change collapsed width
width: isCollapsed ? "80px" : "280px",  // Was 60px/240px

// Change colors
backgroundColor: isActive(route.path) ? "#dbeafe" : "transparent",
borderLeft: isActive(route.path) ? "4px solid #3b82f6" : "none",

// Change icons size
<span style={{ fontSize: "24px" }}>{route.icon}</span>  // Was 18px
```

### Add New Top-Level Menu Item

```typescript
// constants/routeConfig.ts
export const ADMIN_ROUTE_MAP = {
  DASHBOARD: { ... },
  REWARDS: { ... },
  SETTINGS: {  // ← New top-level item
    path: "/dashboard/admin/settings",
    permission: ADMIN_PERMISSIONS.SETTINGS.VIEW,
    label: "Settings",
    icon: "⚙️",
    component: Settings,
  },
};
```

### Change Menu Order

Just reorder the keys in `ADMIN_ROUTE_MAP`:

```typescript
export const ADMIN_ROUTE_MAP = {
  DASHBOARD: { ... },
  SETTINGS: { ... },    // ← Moved up
  REWARDS: { ... },
};
```

### Add Icons from Icon Library

Install an icon library:
```bash
npm install react-icons
```

Update route config:
```typescript
import { FiHome, FiGift, FiSettings } from 'react-icons/fi';

export const ADMIN_ROUTE_MAP = {
  DASHBOARD: {
    path: "/dashboard/admin",
    permission: ADMIN_PERMISSIONS.DASHBOARD,
    label: "Dashboard",
    icon: <FiHome />,  // ← React component instead of emoji
    component: AdminDashboard,
  },
};
```

Update Sidebar to render React components:
```typescript
// components/Sidebar.tsx
<span style={{ fontSize: "18px" }}>
  {typeof route.icon === 'string' ? route.icon : route.icon}
</span>
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER LOGS IN                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Returns:                                           │
│  - accessToken                                              │
│  - userId                                                   │
│  - role (admin/client)                                      │
│  - permissions []                                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Redux Store Updated:                                       │
│  - jwtSlice: { jwtToken, userId }                          │
│  - permissions: { permissions, role, isLoaded: true }      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Navigate to Dashboard                                      │
│  /dashboard/admin or /dashboard/client                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  App.tsx Routes                                             │
│  <Route path="/dashboard/admin" element={                  │
│    <ProtectedRoute requiredPermission={ADMIN_DASHBOARD}>   │
│      <AdminLayout />                                        │
│    </ProtectedRoute>                                        │
│  }>                                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute Checks:                                     │
│  1. jwtToken exists? → Yes, continue                       │
│  2. permissions loaded? → Yes, continue                    │
│  3. has permission? → Yes, render                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  AdminLayout Renders:                                       │
│  1. Filters routes by permissions                          │
│  2. Passes filtered routes to Sidebar                      │
│  3. Renders <Outlet /> for child routes                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Sidebar Renders:                                           │
│  - Shows only allowed menu items                           │
│  - Handles nested children                                 │
│  - Highlights active route                                 │
│  - Collapsible (60px/240px)                                │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  User Clicks Menu Item                                      │
│  e.g., "Create Reward"                                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Navigate to /dashboard/admin/rewards/create                │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  RouteRenderer Finds Matching Route                         │
│  - Extracts relative path: "rewards/create"                │
│  - Wraps in ProtectedRoute                                 │
│  - Renders CreateReward component                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  CreateReward Component Displays                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Files Reference

| File | Purpose |
|------|---------|
| `redux/features/jwtSlice.ts` | Stores JWT token and userId |
| `redux/features/permissionsSlice.ts` | Stores permissions, role, isLoaded |
| `constants/permissions.ts` | Permission constants (HashMap) |
| `constants/routeConfig.ts` | Route config with components |
| `components/ProtectedRoute.tsx` | Auth & permission checking |
| `components/Sidebar.tsx` | Collapsible sidebar navigation |
| `components/layouts/AdminLayout.tsx` | Admin dashboard layout |
| `components/layouts/ClientLayout.tsx` | Client dashboard layout |
| `config/RouteRenderer.tsx` | Dynamic route rendering |
| `App.tsx` | Main routing setup |

---

## 🚀 Quick Checklist: Adding a New Page

- [ ] Create component in `pages/admin/` or `pages/client/`
- [ ] Export from `pages/index.ts`
- [ ] Add permission to `constants/permissions.ts`
- [ ] Add route config with component to `constants/routeConfig.ts`
- [ ] Ensure backend returns the permission
- [ ] Test: Login and verify page appears in sidebar
- [ ] Test: Navigate to page and verify it renders
- [ ] Test: Remove permission and verify page is hidden
