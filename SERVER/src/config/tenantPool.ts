// Tenant Connection Pool Manager
import { PrismaClient as TenantPrismaClient } from '@prisma/tenant-client';
import logger from './logger';

// Connection pool: key = db_string, value = TenantConnection
interface TenantConnection {
  client: TenantPrismaClient;
  lastUsed: Date;
  college_id: number;
}

// We only want ONE PrismaClient per connection string to leverage Prisma's internal pooling.
const connectionMap: Map<string, TenantConnection> = new Map();

// Configuration
const CONNECTION_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get a tenant Prisma client from the pool
 * Returns existing client or creates a new one if not exists
 */
export function getTenantConnection(db_string: string, college_id: number): TenantPrismaClient {
  // Check if we already have a client for this connection string
  let connection = connectionMap.get(db_string);

  if (connection) {
    // Update last used time
    connection.lastUsed = new Date();
    return connection.client;
  }

  // Create new client
  const client = new TenantPrismaClient({
    datasources: {
      db: {
        url: db_string,
      },
    },
    // Log queries in dev, error only in prod
    log: process.env.NODE_ENV === 'DEV' ? ['error'] : ['error'],
  });

  const newConnection: TenantConnection = {
    client,
    lastUsed: new Date(),
    college_id,
  };

  connectionMap.set(db_string, newConnection);
  logger.info(`Created new Prisma Client for college ${college_id}. Active tenants: ${connectionMap.size}`);

  return client;
}

/**
 * Clean up expired connections
 */
function cleanupExpiredConnections(): void {
  const now = new Date();

  connectionMap.forEach((conn, db_string) => {
    const age = now.getTime() - conn.lastUsed.getTime();

    if (age > CONNECTION_TTL_MS) {
      logger.info(`cx Cleaning up expired connection for college ${conn.college_id}`);
      conn.client.$disconnect().catch(err => logger.error('Error disconnecting client', err));
      connectionMap.delete(db_string);
    }
  });
}

/**
 * Get pool statistics
 */
export function getPoolStats() {
  const stats: any[] = [];

  connectionMap.forEach((conn, db_string) => {
    stats.push({
      collegeId: conn.college_id,
      db: db_string.replace(/:[^:@]+@/, ':****@'), // Hide password
      ageSeconds: (new Date().getTime() - conn.lastUsed.getTime()) / 1000,
    });
  });

  return stats;
}

/**
 * Disconnect all tenant connections
 */
export async function disconnectAllTenants(): Promise<void> {
  const disconnectPromises: Promise<void>[] = [];

  connectionMap.forEach((conn) => {
    disconnectPromises.push(conn.client.$disconnect());
  });

  await Promise.all(disconnectPromises);
  connectionMap.clear();
  console.log('All tenant connections closed');
}

// Periodic cleanup every 10 minutes
setInterval(cleanupExpiredConnections, 10 * 60 * 1000);

export default getTenantConnection;
