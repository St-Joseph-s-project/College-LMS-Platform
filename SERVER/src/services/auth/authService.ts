import prisma from '../../config/db';
import { comparePassword } from '../../utils/bcryptUtil';
import { generateToken } from '../../utils/jwtUtil';

export const loginService = async ({ email, password }: { email: string; password: string }) => {
	// find user by email and include role relation
	const user = await prisma.users.findUnique({
		where: { email },
		include: { roles: true },
	});

	if (!user) {
		throw new Error('Invalid credentials');
	}

	const match = await comparePassword({ password, hashPassword: user.password });
	if (!match) {
		throw new Error('Invalid credentials');
	}

	// fetch permissions for the user's role. if super-admin, return all LMS* permissions
	const roleId = user.role_id;
	const roleName = user.roles?.role ?? null;

	let permissions: string[] = [];

	if (user.is_super_admin) {
		const all = await prisma.permissions.findMany({
			where: { permission: { startsWith: 'LMS' } },
			select: { permission: true },
		});
		permissions = all.map((p) => p.permission);
	} else {
		const rolePerms = await prisma.role_permissions.findMany({
			where: {
				role: roleId,
				permissions: { permission: { startsWith: 'LMS' } },
			},
			include: { permissions: true },
		});

		permissions = rolePerms.map((rp) => rp.permissions.permission);
	}

	// generate JWT token with minimal payload
	const token = generateToken({ userId: user.id, role: roleName });

	return {
		token,
		permissions,
		role: roleName
	};
};