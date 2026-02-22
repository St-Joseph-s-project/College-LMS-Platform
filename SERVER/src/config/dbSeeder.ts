import { permissions } from "../constants/permission";
import { ADMIN_CREDENTIALS, USER_CREDENTIALS } from "../constants/appConstants";
import { hashPassword } from "../utils/bcryptUtil";
import getAdminPrisma from "./adminPrisma";
import getTenantConnection from "./tenantPool";
import logger from "./logger";

/**
 * Multi-tenant seeder
 * Pass uniq_string (e.g., 'sjit') to seed that tenant's database
 */
export async function seedPermissions(uniq_string: string): Promise<void> {
	try {
		// Get admin database connection
		const adminPrisma = getAdminPrisma();

		// Fetch tenant info from admin database
		const tenant = await adminPrisma.tenants.findUnique({
			where: { uniq_string },
			select: { id: true, db_string: true, college_name: true },
		});

		if (!tenant) {
			throw new Error(`Tenant with uniq_string '${uniq_string}' not found`);
		}

		logger.info(`Seeding permissions for: ${tenant.college_name}`);

		// Get tenant database connection
		const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

		const existing = await tenantPrisma.permissions.findMany({
			where: { permission: { in: permissions as string[] } },
			select: { permission: true },
		});

		const existingSet = new Set(existing.map((e) => e.permission));
		const missing = (permissions as string[]).filter((p) => !existingSet.has(p));

		if (missing.length === 0) {
			logger.info("No new permissions to seed");
			return;
		}

		await Promise.all(
			missing.map((p) => tenantPrisma.permissions.create({ data: { permission: p } }))
		);

		logger.info(`Seeded ${missing.length} new permissions for ${tenant.college_name}`);
	} catch (error) {
		logger.error("Failed to seed permissions:", error);
		throw error;
	}
}

export async function seedCredentials(uniq_string: string): Promise<void> {
	try {
		// Get admin database connection
		const adminPrisma = getAdminPrisma();

		// Fetch tenant info from admin database
		const tenant = await adminPrisma.tenants.findUnique({
			where: { uniq_string },
			select: { id: true, db_string: true, college_name: true },
		});

		if (!tenant) {
			throw new Error(`Tenant with uniq_string '${uniq_string}' not found`);
		}

		logger.info(`Seeding credentials for: ${tenant.college_name}`);

		// Get tenant database connection
		const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

		// ensure roles exist
		const adminRoleName = "ADMIN";
		const userRoleName = "STUDENT";

		// Find or create admin role
		let adminRole = await tenantPrisma.roles.findFirst({
			where: { role: adminRoleName },
		});
		if (!adminRole) {
			adminRole = await tenantPrisma.roles.create({
				data: { role: adminRoleName },
			});
		}
		logger.info(`Ensured role: ${adminRoleName}`);

		// Find or create user role
		let userRole = await tenantPrisma.roles.findFirst({
			where: { role: userRoleName },
		});
		if (!userRole) {
			userRole = await tenantPrisma.roles.create({
				data: { role: userRoleName },
			});
		}
		logger.info(`Ensured role: ${userRoleName}`);

		// admin
		const adminEmail = ADMIN_CREDENTIALS.EMAIL;
		const adminPasswordPlain = ADMIN_CREDENTIALS.PASSWORD;
		const existingAdmin = await tenantPrisma.users.findUnique({ where: { email: adminEmail } });
		if (!existingAdmin) {
			const hashed = await hashPassword({ password: adminPasswordPlain });
			await tenantPrisma.users.create({
				data: {
					name: "Admin",
					email: adminEmail,
					password: hashed,
					role_id: adminRole.id,
					is_super_admin: true,
				},
			});
			logger.info(`Seeded admin user: ${adminEmail}`);
		} else {
			logger.info(`Admin user already exists: ${adminEmail}`);
		}

		// normal user
		const userEmail = USER_CREDENTIALS.EMAIL;
		const userPasswordPlain = USER_CREDENTIALS.PASSWORD;
		const existingUser = await tenantPrisma.users.findUnique({ where: { email: userEmail } });
		if (!existingUser) {
			const hashedUser = await hashPassword({ password: userPasswordPlain });
			await tenantPrisma.users.create({
				data: {
					name: "User",
					email: userEmail,
					password: hashedUser,
					role_id: userRole.id,
					is_super_admin: false,
				},
			});
			logger.info(`Seeded normal user: ${userEmail}`);
		} else {
			logger.info(`Normal user already exists: ${userEmail}`);
		}

		logger.info(`✅ Seeding complete for ${tenant.college_name}`);
	} catch (error) {
		logger.error("Failed to seed credentials:", error);
		throw error;
	}
}

export async function clearTables(uniq_string: string): Promise<void> {
  try {
    const adminPrisma = getAdminPrisma();

    // Fetch tenant info
    const tenant = await adminPrisma.tenants.findUnique({
      where: { uniq_string },
      select: { id: true, db_string: true, college_name: true },
    });

    if (!tenant) {
      throw new Error(`Tenant with uniq_string '${uniq_string}' not found`);
    }

    logger.info(`Clearing all tables for: ${tenant.college_name}`);

    // Get tenant database connection
    const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

    // Get all user tables in the public schema
    const tables: any[] = await tenantPrisma.$queryRawUnsafe(`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT IN ('_prisma_migrations', 'spatial_ref_sys')
    `);

    if (tables.length === 0) {
      logger.info("No tables to clear");
      return;
    }

    const tableNames = tables.map((t) => `"${t.tablename}"`).join(", ");

  
    await tenantPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} CASCADE;`);

    logger.info(`✅ Successfully cleared all tables for ${tenant.college_name}`);
  } catch (err) {
    logger.error(`error while clearing the tables in the database ${uniq_string}`, err);
    throw err;
  }
}