import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface JwtPayload {
  userId: number;
  roleId: number;
  collegeId: number;
}

/**
 * Generates a JWT token for a given payload.
 * @param payload - The data to encode in the token.
 * @param expiresIn - Expiration time (e.g., '1d', '1h'). Defaults to '1d'.
 * @returns The generated JWT token.
 */
export const generateToken = (payload: JwtPayload, expiresIn: string = "1d"): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

/**
 * Verifies and decodes a JWT token.
 * @param token - The token to verify.
 * @returns The decoded payload if valid, otherwise throws an error.
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};