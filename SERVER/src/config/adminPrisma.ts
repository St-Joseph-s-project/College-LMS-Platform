// Admin Prisma Client - Singleton for lms_admin database
import { PrismaClient as AdminPrismaClient } from '@prisma/admin-client';

let adminPrisma: AdminPrismaClient | null = null;

/**
 * Get admin Prisma client (singleton)
 */
export function getAdminPrisma(): AdminPrismaClient {
  if (!adminPrisma) {
    const adminDbUrl = process.env.ADMIN_DATABASE_URL;
    
    if (!adminDbUrl) {
      throw new Error('ADMIN_DATABASE_URL is not set in environment variables');
    }

    adminPrisma = new AdminPrismaClient({
      datasources: {
        db: {
          url: adminDbUrl,
        },
      },
      log: process.env.NODE_ENV === 'DEV' ? ['error'] : ['error'],
    });

    console.log('Admin database connected');
  }

  return adminPrisma;
}

/**
 * Disconnect admin Prisma
 */
export async function disconnectAdminPrisma(): Promise<void> {
  if (adminPrisma) {
    await adminPrisma.$disconnect();
    adminPrisma = null;
  }
}

export default getAdminPrisma;
