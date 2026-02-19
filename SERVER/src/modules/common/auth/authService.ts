import { getAdminPrisma, getTenantConnection } from '../../../config';
import { comparePassword, generateToken } from '../../../utils';
import { CustomError } from '../../../utils';
import { STATUS_CODE } from '../../../constants';

export const loginService = async ({ email, password }: { email: string; password: string }) => {
	// Extract college identifier from email domain
	// Example: admin@sjit.com -> sjit
	const emailParts = email.split('@');
	if (emailParts.length !== 2) {
		throw new CustomError({ message: 'Invalid email format', statusCode: STATUS_CODE.BAD_REQUEST });
	}

	const domain = emailParts[1]; // e.g., "sjit.com"
	const uniq_string = domain.split('.')[0]; // e.g., "sjit"

	// Get admin database connection
  const adminPrisma = getAdminPrisma();

	// Check if college exists in lms_admin database
	const tenant = await adminPrisma.tenants.findUnique({
		where: { uniq_string },
		select: {
			id: true,
			college_name: true,
			uniq_string: true,
			db_string: true,
			is_active: true,
		},
  });
  

	if (!tenant) {
		throw new CustomError({ message: 'College not found', statusCode: STATUS_CODE.NOT_FOUND });
	}

	if (!tenant.is_active) {
		throw new CustomError({ message: 'College account is inactive', statusCode: STATUS_CODE.FORBIDDEN });
	}

	// Get tenant database connection from pool
	const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

	// Find user in tenant database
  const user = await tenantPrisma.users.findUnique({
		where: { email },
  });

	if (!user) {
		throw new CustomError({ message: 'Invalid credentials', statusCode: STATUS_CODE.UNAUTHORIZED });
	}

	if (!user.password) {
		throw new CustomError({ message: 'User password not set', statusCode: STATUS_CODE.UNAUTHORIZED });
	}

	const match = await comparePassword({ password, hashPassword: user.password });
	if (!match) {
		throw new CustomError({ message: 'Invalid credentials', statusCode: STATUS_CODE.UNAUTHORIZED });
	}

	// Fetch permissions for the user's role
	if (!user.role_id) {
		throw new CustomError({ message: 'User role not assigned', statusCode: STATUS_CODE.FORBIDDEN });
	}

	const roleId = user.role_id;

	// Fetch role name
	const role = await tenantPrisma.roles.findUnique({
		where: { id: roleId },
		select: { role: true },
	});
	const roleName = role?.role ?? null;

	let permissions: string[] = [];

	if (user.is_super_admin) {
		// Super admin gets all LMS permissions
		const all = await tenantPrisma.permissions.findMany({
			where: { permission: { startsWith: 'LMS' } },
			select: { permission: true },
		});
		permissions = all.map((p: any) => p.permission);
	} else {
		// Regular users get role-based permissions
		const rolePerms = await tenantPrisma.role_permissions.findMany({
			where: { role: roleId },
			select: { permission: true },
		});

		// Fetch permission details for LMS permissions only
		const permissionIds = rolePerms.map((rp: { permission: number | null }) => rp.permission).filter(Boolean) as number[];
		const permDetails = await tenantPrisma.permissions.findMany({
			where: {
				id: { in: permissionIds },
				permission: { startsWith: 'LMS' },
			},
			select: { permission: true },
		});

		permissions = permDetails.map((p: any) => p.permission);
	}

	// Generate JWT token with user_id, role_id, college_id, and is_super_admin
	const token = generateToken({
		userId: user.id,
		roleId: user.role_id,
		collegeId: tenant.id,
		isSuperAdmin: user.is_super_admin ?? false,
	});

	return {
		token,
		permissions,
		role: roleName
	};
};