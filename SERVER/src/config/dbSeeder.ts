import prisma from "./db";
import { permissions } from "./../constants/permission";
import { ADMIN_CREDENTIALS, USER_CREDENTIALS } from "./../constants/appConstants";
import { hashPassword } from "./../utils/bcryptUtil";

export async function seedPermissions(): Promise<void> {
	try {
		const existing = await prisma.permissions.findMany({
			where: { permission: { in: permissions as string[] } },
			select: { permission: true },
		});

		const existingSet = new Set(existing.map((e) => e.permission));
		const missing = (permissions as string[]).filter((p) => !existingSet.has(p));

		if (missing.length === 0) {
			console.log("No new permissions to seed");
			return;
		}

		await Promise.all(
			missing.map((p) => prisma.permissions.create({ data: { permission: p } }))
		);

		console.log(`Seeded ${missing.length} new permissions`);
	} catch (error) {
		console.error("Failed to seed permissions:", error);
		throw error;
	}
}

export async function seedCredentials(): Promise<void> {
  try {
		// ensure roles exist
		const adminRoleName = "ADMIN";
		const userRoleName = "STUDENT";

		// use upsert to avoid race/sequence issues that can cause id conflicts
		const adminRole = await prisma.roles.upsert({
			where: { role: adminRoleName },
			update: {},
			create: { role: adminRoleName },
		});
		console.log(`Ensured role: ${adminRoleName}`);

		const userRole = await prisma.roles.upsert({
			where: { role: userRoleName },
			update: {},
			create: { role: userRoleName },
		});
		console.log(`Ensured role: ${userRoleName}`);

		// admin
		const adminEmail = ADMIN_CREDENTIALS.EMAIL;
		const adminPasswordPlain = ADMIN_CREDENTIALS.PASSWORD;
		const existingAdmin = await prisma.users.findUnique({ where: { email: adminEmail } });
		if (!existingAdmin) {
			const hashed = await hashPassword({ password: adminPasswordPlain });
			await prisma.users.create({
				data: {
					name: "Admin",
					email: adminEmail,
					password: hashed,
					role_id: adminRole.id,
					is_super_admin: true,
				},
			});
			console.log(`Seeded admin user: ${adminEmail}`);
		} else {
			console.log(`Admin user already exists: ${adminEmail}`);
		}

		// normal user
		const userEmail = USER_CREDENTIALS.EMAIL;
		const userPasswordPlain = USER_CREDENTIALS.PASSWORD;
		const existingUser = await prisma.users.findUnique({ where: { email: userEmail } });
		if (!existingUser) {
			const hashedUser = await hashPassword({ password: userPasswordPlain });
			await prisma.users.create({
				data: {
					name: "User",
					email: userEmail,
					password: hashedUser,
					role_id: userRole.id,
					is_super_admin: false,
				},
			});
			console.log(`Seeded normal user: ${userEmail}`);
		} else {
			console.log(`Normal user already exists: ${userEmail}`);
		}

  } catch (error) {
    console.error("Failed to seed permissions:", error);
		throw error;
  }
}