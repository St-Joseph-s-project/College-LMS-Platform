# Multi-Tenant Architecture - Simple & Clean Flow

## Overview
The LMS platform uses a **multi-tenant architecture** where each college has its own isolated database. The system uses email domains to identify colleges and manages connections through a pooling system.

---

## The Flow

### 1. Login Flow (Email Domain → Tenant Database)

```
User Login: admin@sjit.com
     ↓
Extract college identifier: "sjit"
     ↓
Query lms_admin database:
  SELECT * FROM tenants WHERE uniq_string = 'sjit'
     ↓
Get tenant info:
  - college_id: 1
  - college_name: "St. Joseph Institute of Technology"
  - db_string: "postgresql://...../sjit_db"
     ↓
Get connection from pool (5 connections ready, 30-min TTL)
     ↓
Authenticate user against tenant database
     ↓
Generate JWT with:
  - user_id
  - role_id
  - college_id
     ↓
Return token to user
```

**Code Location**: `src/modules/common/auth/authService.ts`

---

### 2. Request Flow (JWT → Tenant Database)

```
Incoming API Request
     ↓
Extract JWT token
     ↓
Decode token to get:
  - user_id
  - role_id
  - college_id
     ↓
Validate Tenant Middleware:
  Query lms_admin: SELECT * FROM tenants WHERE id = college_id
     ↓
Get db_string from lms_admin
     ↓
Get connection from pool
     ↓
Inject into request:
  - req.tenant (college info)
  - req.tenantPrisma (database connection)
     ↓
Controller uses req.tenantPrisma to query tenant database
     ↓
Return response
```

**Code Location**: `src/middleware/validateTenant.ts`

---

## Database Setup

### Admin Database (`lms_admin`)
**Purpose**: Manages all colleges/tenants

**Table**: `tenants`
```sql
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  college_name VARCHAR(255),
  uniq_string VARCHAR(100) UNIQUE,  -- e.g., "sjit", "mit"
  db_string VARCHAR(500),            -- Connection URL
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Example Data**:
```sql
INSERT INTO tenants (college_name, uniq_string, db_string) VALUES
('St. Joseph Institute of Technology', 'sjit', 
 'postgresql://user:pass@host/sjit_db?sslmode=require');
```

### Tenant Databases (e.g., `sjit_db`, `mit_db`)
**Purpose**: Store all LMS data for each college

**Tables**: All your existing tables from `prisma/schema.prisma`
- users, roles, permissions
- departments, batches, student_profiles
- problems, modules, submissions, tests
- blogs, comments, hackathons
- etc.

---

## Connection Pool

**Configuration**:
- **Max Connections per Tenant**: 5
- **Connection TTL**: 30 minutes
- **Pool Strategy**: Least Recently Used (LRU)

**How It Works**:
1. When a tenant is accessed, create up to 5 Prisma connections
2. Reuse connections for the same tenant
3. Expire unused connections after 30 minutes
4. Automatically clean up stale connections every 10 minutes

**Code Location**: `src/config/tenantPool.ts`

---

## Key Components

### 1. Admin Prisma Client
**File**: `src/config/adminPrisma.ts`
- Singleton connection to `lms_admin` database
- Used for tenant lookup

### 2. Tenant Connection Pool
**File**: `src/config/tenantPool.ts`
- Manages dynamic connections to tenant databases
- 5 connections per tenant, 30-min TTL
- LRU eviction strategy

### 3. Login Service
**File**: `src/modules/common/auth/authService.ts`
- Extracts college from email domain
- Validates tenant in admin database
- Authenticates user in tenant database
- Generates JWT with college_id

### 4. Tenant Validation Middleware
**File**: `src/middleware/validateTenant.ts`
- Reads college_id from JWT
- Validates tenant exists and is active
- Injects tenant connection into request

---

## Prisma Setup

### Admin Schema
**File**: `prisma/admin.schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/admin-client"
}

datasource db {
  provider = "postgresql"
  url      = env("ADMIN_DATABASE_URL")
}

model tenants {
  id          Int      @id @default(autoincrement())
  college_name String
  uniq_string  String   @unique
  db_string    String
  is_active    Boolean  @default(true)
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}
```

### Tenant Schema
**File**: `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/tenant-client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// All your existing models...
```

---

## Environment Variables

```env
# Admin database (manages tenants)
ADMIN_DATABASE_URL=postgresql://...../lms_admin

# Tenant database (for development/migrations)
DATABASE_URL=postgresql://...../sjit_db

# JWT Secret
JWT_SECRET=your_secret_key
```

---

## Usage Example

### In Controllers

```typescript
export const getStudents = async (req: Request, res: Response) => {
  // req.tenantPrisma is injected by validateTenant middleware
  const students = await req.tenantPrisma.student_profiles.findMany({
    include: { users: true },
  });

  return Response({ res, data: students, statusCode: 200 });
};
```

### In Routes

```typescript
import { validateTenant } from '../middleware/validateTenant';

router.get('/students', validateTenant, getStudents);
```

---

## How Data Isolation Works

1. **Login**: User logs in with `admin@sjit.com`
   - System identifies `sjit` as the college
   - Retrieves SJIT's database URL from `lms_admin`
   
2. **All Requests**: JWT contains `college_id`
   - Middleware validates college exists
   - Routes the request to the correct database
   
3. **Data Access**: All queries go to tenant-specific database
   - SJIT users can ONLY access SJIT's database
   - MIT users can ONLY access MIT's database
   - Complete data isolation

---

## Adding a New College

1. Create new database for the college
2. Run Prisma migrations on new database
3. Insert record in `lms_admin.tenants`:
   ```sql
   INSERT INTO tenants (college_name, uniq_string, db_string)
   VALUES ('MIT', 'mit', 'postgresql://...../mit_db');
   ```
4. Users can now login with `@mit.com` emails

---

## Running Migrations

### Admin Database
```bash
# Generate admin client
npx prisma generate --schema=prisma/admin.schema.prisma

# Run migrations
DATABASE_URL=$ADMIN_DATABASE_URL npx prisma migrate dev --schema=prisma/admin.schema.prisma
```

### Tenant Database
```bash
# Generate tenant client
npx prisma generate --schema=prisma/schema.prisma

# Run on specific tenant (set DATABASE_URL to tenant's db_string)
DATABASE_URL=postgresql://...../sjit_db npx prisma migrate dev
```

---

## Benefits

✅ **Complete Data Isolation** - Each college's data in separate database  
✅ **Scalability** - Each college can scale independently  
✅ **Security** - No cross-tenant data access possible  
✅ **Performance** - Connection pooling (5 per tenant)  
✅ **Simple** - Email domain automatically identifies tenant  
✅ **Clean** - Middleware handles all complexity
