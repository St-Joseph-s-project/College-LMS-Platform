# LMS Client Application

A modern, permission-based Learning Management System (LMS) client built with React, TypeScript, Redux, and Vite. Features a dynamic routing system with role-based access control for admin and student dashboards.

## 🚀 Features

### Core Features
- **Permission-Based Routing** - Dynamic route rendering based on user permissions
- **Role-Based Dashboards** - Separate interfaces for Admin and Client (Student) roles
- **JWT Authentication** - Secure token-based authentication
- **Redux State Management** - Centralized state for auth and permissions
- **Collapsible Sidebar** - Responsive navigation with 60px/240px states
- **Protected Routes** - Automatic authentication and permission checks
- **Dynamic Route Configuration** - Add new pages without touching App.tsx

### Admin Features
- **Dashboard** - Overview and analytics
- **Rewards Management**
  - Create Reward - Create new rewards for students
  - Track Reward - Monitor reward distribution
  - History Reward - View past reward transactions

### Client (Student) Features
- **Dashboard** - Student portal overview
- **Rewards**
  - Store - Browse and redeem available rewards
  - Track - Monitor reward points and history

## 📁 Project Structure

```
CLIENT/
├── src/
│   ├── api/                      # API services
│   │   ├── apiservice.ts         # Base API client with interceptors
│   │   ├── api.permissions.service.ts  # Permission checking APIs
│   │   └── api.sharing.service.ts      # Shared API utilities
│   │
│   ├── components/               # Reusable components
│   │   ├── ProtectedRoute.tsx    # Route protection wrapper
│   │   ├── Sidebar.tsx           # Collapsible sidebar navigation
│   │   └── layouts/
│   │       ├── AdminLayout.tsx   # Admin dashboard layout
│   │       └── ClientLayout.tsx  # Client dashboard layout
│   │
│   ├── config/                   # Configuration files
│   │   └── RouteRenderer.tsx     # Dynamic route rendering logic
│   │
│   ├── constants/                # Application constants
│   │   ├── permissions.ts        # Permission definitions (HashMap)
│   │   ├── routeConfig.ts        # Route configuration with components
│   │   └── appConstants.ts       # General app constants
│   │
│   ├── pages/                    # Page components
│   │   ├── admin/  
|   |   |   ├── <feature_name>/ 
|   |   |   |  ├──pages #contains all the pages of the feature
|   |   |   |  |  ├──index.ts #export pages
|   |   |   |  ├──types #contains all the types
|   |   |   |  ├──api #contains the api login for each page
│   │   │   
│   │   ├── client/  
|   |   |   ├── <feature_name>/ 
|   |   |   |  ├──pages #contains all the pages of the feature
|   |   |   |  |  ├──index.ts #export pages
|   |   |   |  ├──types #contains all the types
|   |   |   |  ├──api #contains the api login for each page
|   |   |
│   │   └── common/               # Shared pages
│   │       ├── Login.tsx
│   │       ├── Page404.tsx
│   │       └── Unauthorized.tsx
│   │
│   ├── redux/                    # Redux store
│   │   ├── store.ts              # Store configuration
│   │   └── features/
│   │       ├── jwtSlice.ts       # JWT token management
│   │       └── permissionsSlice.ts  # Permissions management
│   │
│   ├── styles/                   # Stylesheets
│   │   └── dashboard.css         # Dashboard-specific styles
│   │
│   ├── utils/                    # Utility functions
│   │
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
│
├── auth.md                       # Authentication flow guide
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Core
- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.3** - Build tool and dev server

### State Management
- **Redux Toolkit 2.11** - State management
- **React Redux 9.2** - React bindings for Redux

### Routing
- **React Router DOM 7.13** - Client-side routing

### HTTP Client
- **Axios 1.13** - API requests with interceptors

### UI & Icons
- **Lucide React 0.564** - Icon library
- **TailwindCSS 4.1** - Utility-first CSS
- **React Toastify 11.0** - Toast notifications

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the CLIENT directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=LMS Client
```

## 🔐 Authentication Flow

1. **User Login** → Backend returns JWT token, userId, role, and permissions
2. **Store in Redux** → Token saved in `jwtSlice`, permissions in `permissionsSlice`
3. **Navigate to Dashboard** → Based on role (admin/client)
4. **Route Protection** → `ProtectedRoute` checks auth and permissions
5. **Sidebar Rendering** → Routes filtered by user permissions
6. **Page Access** → Only accessible if user has required permission

See [`auth.md`](./auth.md) for detailed authentication flow documentation.

## 📝 Key Concepts

### Permission System

Permissions are organized as HashMaps for better structure:

```typescript
// constants/permissions.ts
export const ADMIN_PERMISSIONS = {
  DASHBOARD: "admin.dashboard.view",
  REWARDS: {
    VIEW: "admin.rewards.view",
    CREATE: "admin.rewards.create",
    TRACK: "admin.rewards.track",
    HISTORY: "admin.rewards.history",
  },
};
```

### Route Configuration

Routes include component mappings for dynamic rendering:

```typescript
// constants/routeConfig.ts
export const ADMIN_ROUTE_MAP = {
  REWARDS: {
    path: "/dashboard/admin/rewards",
    permission: ADMIN_PERMISSIONS.REWARDS.VIEW,
    label: "Rewards",
    icon: Gift({ size: 18 }),
    children: [
      {
        path: "/dashboard/admin/rewards/create",
        permission: ADMIN_PERMISSIONS.REWARDS.CREATE,
        label: "Create Reward",
        icon: Plus({ size: 18 }),
        component: CreateReward,
      },
    ],
  },
};
```

### Protected Routes

All routes are automatically protected:

```typescript
<ProtectedRoute requiredPermission="admin.rewards.create">
  <CreateReward />
</ProtectedRoute>
```

Protection checks:
1. JWT token exists (authentication)
2. Permissions loaded
3. User has required permission

## ➕ Adding New Pages

### Step-by-Step Guide

1. **Create Page Component**
   ```typescript
   // pages/admin/NewFeature.tsx
   const NewFeature = () => {
     return <div><h1>New Feature</h1></div>;
   };
   export default NewFeature;
   ```

2. **Export from Index**
   ```typescript
   // pages/index.ts
   export { default as NewFeature } from "./admin/NewFeature";
   ```

3. **Add Permission**
   ```typescript
   // constants/permissions.ts
   export const ADMIN_PERMISSIONS = {
     // ... existing
     NEW_FEATURE: {
       VIEW: "admin.newfeature.view",
     },
   };
   ```

4. **Add to Route Config**
   ```typescript
   // constants/routeConfig.ts
   import { NewFeature } from "../pages";
   
   export const ADMIN_ROUTE_MAP = {
     // ... existing routes
     NEW_FEATURE: {
       path: "/dashboard/admin/newfeature",
       permission: ADMIN_PERMISSIONS.NEW_FEATURE.VIEW,
       label: "New Feature",
       icon: Star({ size: 18 }),
       component: NewFeature,
     },
   };
   ```

5. **Update Backend** - Ensure backend returns the new permission

**Done!** The page will automatically:
- Appear in sidebar (if user has permission)
- Be protected by authentication
- Be protected by permission check
- Render when navigated to

## 🎨 Customizing the Sidebar

### Change Width
```typescript
// components/Sidebar.tsx
width: isCollapsed ? "80px" : "280px",  // Default: 60px/240px
```

### Change Colors
```typescript
backgroundColor: isActive(route.path) ? "#dbeafe" : "transparent",
borderLeft: isActive(route.path) ? "4px solid #3b82f6" : "none",
```

### Change Menu Order
```typescript
// constants/routeConfig.ts
export const ADMIN_ROUTE_MAP = {
  DASHBOARD: { ... },
  SETTINGS: { ... },    // Moved up
  REWARDS: { ... },
};
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `redux/features/jwtSlice.ts` | JWT token and userId storage |
| `redux/features/permissionsSlice.ts` | Permissions, role, isLoaded state |
| `constants/permissions.ts` | Permission constants (HashMap) |
| `constants/routeConfig.ts` | Route config with component mappings |
| `components/ProtectedRoute.tsx` | Auth & permission checking |
| `components/Sidebar.tsx` | Collapsible sidebar navigation |
| `components/layouts/AdminLayout.tsx` | Admin dashboard layout |
| `components/layouts/ClientLayout.tsx` | Client dashboard layout |
| `config/RouteRenderer.tsx` | Dynamic route rendering |
| `App.tsx` | Main routing setup |
| `auth.md` | Complete authentication guide |


## 🧪 Development

### Code Organization
- **Components** - Reusable UI components
- **Pages** - Route-specific page components
- **Layouts** - Dashboard layout wrappers
- **Config** - Application configuration
- **Constants** - Permissions, routes, app constants
- **Redux** - State management
- **API** - API service layer
- **Utils** - Helper functions

### Best Practices
1. Use TypeScript for type safety
2. Keep components small and focused
3. Use Redux for global state only
4. Implement proper error handling
5. Follow the established folder structure
6. Use the permission system for access control
7. Add new routes via configuration, not manually

## 📖 Documentation

- **[auth.md](./auth.md)** - Complete authentication and rendering flow guide
- **Implementation Guide** - Detailed implementation patterns
- **Quick Reference** - Essential code snippets
- **Dynamic Routes Guide** - How to use the dynamic route system

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strictly
3. Add permissions for new features
4. Update route configuration for new pages
5. Test authentication and permission flows
6. Document complex logic

## 📄 License

This project is part of the St. Joseph's College LMS Platform.

---

**Built with ❤️ using React, TypeScript, and Redux**
