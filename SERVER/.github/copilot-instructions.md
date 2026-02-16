## Quick Context

- Repo: TypeScript Express API (CommonJS) using Prisma for DB.
- Entrypoint: `server.ts` — imports `src/app` and boots Express after `connectDB()` and running DB seeders.
- Routes are mounted under `/api` in `server.ts`; see `src/app.ts` for `admin` and `client` sub-routers.

## Key files & folders

- `server.ts` — start-up, environment, DB connect and call to `seedPermissions()` / `seedCredentials()`.
- `src/app.ts` — top-level router that mounts `src/routes/admin` and `src/routes/client` and health-check.
- `src/routes/*` — route definitions; prefer thin routes that call controllers.
- `src/controllers/*` — request handlers (grouped by `admin`, `auth`, `client`).
- `src/services/*` — business logic invoked by controllers.
- `src/config/*` — DB connection (`dbConnect.ts`), logger, and seeders (`dbSeeder.ts`).
- `src/utils/*` — small helpers; notably `response.ts` (standard response shape) and `bcryptUtil.ts` / `jwtUtil.ts`.
- `src/constants/*` — app-wide values like `STATUS_CODE` and default credentials.
- `prisma/` — Prisma schema; use `prisma` CLI commands found in `package.json`.

## How to run locally

1. Install deps: `npm install`
2. Create `.env` with DB connection and secrets (project README references expected vars).
3. Dev (fast loop): `npm run dev`
   - Implementation detail: `dev` runs `tsc -w` and `nodemon dist/server.js` via `concurrently`. The compiled JS lives in `dist/`.
4. Build: `npm run build` (runs `tsc`) then `npm start` runs `node dist/server.js`.

Prisma: use `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:studio` as needed.

## Architectural patterns and conventions

- Routes → Controllers → Services: Keep controllers thin and delegate DB/logic to `src/services/*`.
- Responses: Always use the project's `Response` util (`src/utils/response.ts`) and pass HTTP codes from `src/constants/appConstants.ts` (`STATUS_CODE`). Do not return raw `res.json(...)` shapes — use the helper for consistent shape and status handling.
- Constants: use `src/constants/appConstants.ts` for status codes and seed credentials.
- Seeding: `src/config/dbSeeder.ts` uses `upsert` for roles and creates default users and permissions; seeding runs during start-up in `server.ts`.
- Logging: Winston logger is exported from `src/config/logger` and used with `morgan` in `server.ts` (morgan is configured to write to the logger).

## Validation & input patterns

- Validator helpers live under `src/validator/`.
- Use `withValidation(...)` helper to combine `express-validator` chains with a result-checker middleware. Example usage:

```ts
import withValidation from "src/validator/validor";
import { authValidators } from "src/validator/common/authValidtor";

router.post('/login', ...withValidation(authValidators.login), authController.login);
```

- Error shape: validator middleware should call the project `Response` util with `STATUS_CODE.BAD_REQUEST` and include the first validation error message (see `src/validator/validor.ts` and `src/validator/common/authValidtor.ts`).

Example controller response pattern:

```ts
import { Response } from '../utils';
import { STATUS_CODE } from '../constants/appConstants';

export const loginController = async (req, res) => {
  // business logic -> token
  return Response({ res, data: { token }, statusCode: STATUS_CODE.OK });
};
```

## Build / Debug notes

- Because `dev` runs `tsc -w` + `nodemon dist/server.js`, you must ensure TypeScript compiles successfully to see code changes in `dist/`.
- For debugging TypeScript sources directly, consider running node with `tsx` or using an alternative dev script instead of the current compile-to-dist flow.

## Integration points & external dependencies

- Prisma: DB schema and models under `prisma/`; `@prisma/client` is a runtime dependency.
- Auth: JWT utils in `src/utils/jwtUtil.ts` — check for expected env vars (`JWT_SECRET`, expirations).
- External services: none detected; DB (Postgres/MySQL) expected via Prisma connection string.

## Conventions & gotchas (project-specific)

- Project compiles to `dist/` and then runs `dist/server.js` — editing TS requires a successful `tsc` build for changes to appear in `nodemon`.
- `Response` util is used project-wide; avoid returning raw `res.json(...)` shapes that diverge from this helper.
- Seeders run at server start: take care when running `dev` in environments where seeding or migrations should not run automatically.
- Path imports in the repo are relative (no path-alias configured). Use explicit relative paths (example: `../utils`).

## Quick examples to implement common tasks

- Add a new route and controller:

  - `src/routes/myFeature.ts` → `router.post('/action', ...withValidation(...), myController.action)`
  - `src/controllers/myFeature/myController.ts` → export handler that calls `src/services/myFeature`.

- Run DB migration locally:

```bash
npm run prisma:migrate
```

## Where to look when things fail

- DB connect errors: `src/config/dbConnect.ts` and Prisma logs.
- Start-up failures: check `server.ts` — it logs errors and exits with code 1.
- Validation/response issues: `src/validator/validor.ts` and `src/utils/response.ts`.

---

If you'd like, I can refine any section with exact environment variable names, add editor/tsconfig hints, or wire the auth route to `src/controllers/auth/authController.ts` — which would you prefer next?
