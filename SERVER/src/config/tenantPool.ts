// Tenant Connection Pool Manager
import { PrismaClient as TenantPrismaClient } from '@prisma/tenant-client';

interface PooledConnection {
  client: TenantPrismaClient;
  lastUsed: Date;
  college_id: number;
}

// Connection pool: key = db_string, value = pooled connections
const connectionPool: Map<string, PooledConnection[]> = new Map();

// Configuration
const MAX_CONNECTIONS_PER_TENANT = 5;
const CONNECTION_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get a tenant Prisma client from the pool
 * Creates new connection if pool is not full
 */
export function getTenantConnection(db_string: string, college_id: number): TenantPrismaClient {
  // Get or create pool for this tenant
  let pool = connectionPool.get(db_string);
  
  if (!pool) {
    pool = [];
    connectionPool.set(db_string, pool);
  }

  // Try to find an available connection
  let connection = pool.find(conn => conn.lastUsed);
  
  if (connection) {
    // Update last used time
    connection.lastUsed = new Date();
    return connection.client;
  }

  // Create new connection if pool not full
  if (pool.length < MAX_CONNECTIONS_PER_TENANT) {
    const client = new TenantPrismaClient({
      datasources: {
        db: {
          url: db_string,
        },
      },
      log: process.env.NODE_ENV === 'DEV' ? ['error'] : ['error'],
    });

    const newConnection: PooledConnection = {
      client,
      lastUsed: new Date(),
      college_id,
    };

    pool.push(newConnection);
    console.log(`✅ Created connection for college ${college_id}. Pool size: ${pool.length}/${MAX_CONNECTIONS_PER_TENANT}`);
    
    return client;
  }

  // Pool is full, reuse least recently used
  pool.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime());
  const lruConnection = pool[0];
  lruConnection.lastUsed = new Date();
  
  return lruConnection.client;
}

/**
 * Clean up expired connections
 */
function cleanupExpiredConnections(): void {
  const now = new Date();
  
  connectionPool.forEach((pool, db_string) => {
    const validConnections = pool.filter(conn => {
      const age = now.getTime() - conn.lastUsed.getTime();
      
      if (age > CONNECTION_TTL_MS) {
        conn.client.$disconnect();
        return false;
      }
      return true;
    });

    if (validConnections.length !== pool.length) {
      console.log(`🧹 Cleaned ${pool.length - validConnections.length} expired connections for tenant`);
    }

    if (validConnections.length > 0) {
      connectionPool.set(db_string, validConnections);
    } else {
      connectionPool.delete(db_string);
    }
  });
}

/**
 * Get pool statistics
 */
export function getPoolStats() {
  const stats: any[] = [];
  
  connectionPool.forEach((pool, db_string) => {
    stats.push({
      db: db_string.replace(/:[^:@]+@/, ':****@'), // Hide password
      connections: pool.length,
      maxConnections: MAX_CONNECTIONS_PER_TENANT,
    });
  });

  return stats;
}

/**
 * Disconnect all tenant connections
 */
export async function disconnectAllTenants(): Promise<void> {
  const disconnectPromises: Promise<void>[] = [];

  connectionPool.forEach((pool) => {
    pool.forEach(conn => {
      disconnectPromises.push(conn.client.$disconnect());
    });
  });

  await Promise.all(disconnectPromises);
  connectionPool.clear();
  console.log('All tenant connections closed');
}

// Periodic cleanup every 10 minutes
setInterval(cleanupExpiredConnections, 10 * 60 * 1000);

export default getTenantConnection;
