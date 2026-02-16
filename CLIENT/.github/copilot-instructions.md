# Copilot / AI agent instructions for LMS/CLIENT

Purpose: concise, actionable guidance so an AI coding agent is immediately productive in this Vite + React + TypeScript frontend.

Big picture
- Frontend: Vite + React (TypeScript) single-page app. Entry: `src/main.tsx` -> `App.tsx`.
- State: Redux Toolkit; store at `src/redux/store.ts`. Feature slices are in `src/redux/features` (e.g., `jwtSlice.ts`, `loadingSlice.ts`, `permissionsSlice.ts`).
- API layer: centralized axios instance + helpers in `src/api`:
  - `src/api/axiosinterceptor.ts` handles baseURL (env var `VITE_API_URL`), auth header from `sessionStorage` (key `lms-access-token`), and automatic token refresh via `/auth/check-refresh-token` with a request queue.
  - `src/api/apiservice.ts` exposes `getApi`, `postApi`, `putApi`, `deleteApi` helpers that dispatch loading state and call `toasterHelper` for messages.
- Routing & layouts: per-role layouts and a `ProtectedRoute` component are used. See `src/components/ProtectedRoute.tsx`, `src/components/layouts/AdminLayout.tsx`, and `src/components/layouts/ClientLayout.tsx`.

Developer workflows (how to run/build)
- Install & dev: project uses npm/yarn/pnpm normally. Key npm scripts in `package.json`:
  - `npm run dev` -> `vite` (development server)
  - `npm run build` -> `tsc -b && vite build` (type-check compilation then bundle)
  - `npm run preview` -> `vite preview` (serve built output)
  - `npm run lint` -> `eslint .`
- Environment: set `VITE_API_URL` for backend endpoints. The axios instance relies on it.

Project-specific conventions & patterns
- Auth token storage: JWT is stored in `sessionStorage` key `lms-access-token` (see `src/constants/appConstants.ts`). Interceptor automatically attaches `Authorization: Bearer <token>`.
- Refresh flow: on 401, `axiosinterceptor` calls `/auth/check-refresh-token`. It supports several token response shapes (accessToken, token, data.accessToken, or plain string). It queues failed requests during refresh — preserve that behavior when modifying auth logic.
- API helpers behavior: `getApi`/`postApi` default to showing a loader and a toast. Callers can pass `showLoader=false` or `showToaster=false` to opt out. They re-throw errors after showing toasts so callers can handle them.
- Loading and toasts: UI expects a global loading slice and `react-toastify` configured in `src/main.tsx`.
- File layout: pages under `src/pages/{admin,client,common}`, shared `components`, `api`, `redux`, `utils`. Follow existing folder organization when adding features.

Integration points & external dependencies to watch
- Backend API base: `import.meta.env.VITE_API_URL` (set env before running dev/build).
- Axios instance (`src/api/axiosinterceptor.ts`) is the single source for HTTP behavior; prefer using `src/api/apiservice.ts` wrappers for consistent loader/toaster behavior.
- Redux slices: when adding derived state or async flows, use RTK slice patterns present in `src/redux/features/*`.

Safe change notes for AI edits
- Do not break the refresh queue logic in `axiosinterceptor` — ensure `failedQueue` semantics remain when changing error handling.
- Keep `apiservice` helpers' loader/toaster dispatches unless intentionally altering UX globally; callers often rely on default side effects.
- When adding new pages, register them under `src/pages` and reuse layouts rather than creating ad-hoc wrappers.

Where to look for examples
- Auth & HTTP: `src/api/axiosinterceptor.ts`, `src/api/apiservice.ts`.
- State management: `src/redux/store.ts` and `src/redux/features/*.ts`.
- Entry and UI wiring: `src/main.tsx` (ToastContainer + Provider) and `src/App.tsx` for routes.

If unsure, ask the developer for: API contract shape for auth refresh, preferred behavior for global errors (e.g., redirect to login vs toast), and whether new UI routes should be added under `admin` or `client`.

-- End of file
