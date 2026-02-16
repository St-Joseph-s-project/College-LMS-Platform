export const STATUS_CODE: Record<string, number> = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};


export const ADMIN_CREDENTIALS: Record<string, string> = {
  EMAIL: "admin@gmail.com",
  PASSWORD: "root"
}

export const USER_CREDENTIALS: Record<string, string> = {
  EMAIL: "user@gmail.com",
  PASSWORD: "root"
}