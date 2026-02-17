// Tenant Validation Middleware
// Validates college_id from JWT and injects tenant connection
import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response } from '../utils/response';
import { STATUS_CODE } from '../constants/appConstants';
import logger from '../config/logger';
import getAdminPrisma from '../config/adminPrisma';
import getTenantConnection from '../config/tenantPool';

// Type definitions are centralized in src/types/express.d.ts

/**
 * Middleware to validate tenant and inject connection
 * Expects college_id in req.user (from JWT)
 */
export async function validateTenant(
  req: Request,
  res: ExpressResponse,
  next: NextFunction
): Promise<void> {
  try {
    // Get collegeId from JWT (already decoded by auth middleware)
    const collegeId = req.user?.collegeId;

    if (!collegeId) {
      Response({
        res,
        data: null,
        statusCode: STATUS_CODE.UNAUTHORIZED,
        message: 'College ID not found in token',
      });
      return;
    }

    // Get admin database connection
    const adminPrisma = getAdminPrisma();

    // Check if college exists in lms_admin
    const tenant = await adminPrisma.tenants.findFirst({
      where: {
        id: collegeId,
        is_active: true,
      },
      select: {
        id: true,
        college_name: true,
        uniq_string: true,
        db_string: true,
      },
    });

    if (!tenant) {
      Response({
        res,
        data: null,
        statusCode: STATUS_CODE.FORBIDDEN,
        message: 'College not found or inactive',
      });
      return;
    }

    // Get tenant database connection from pool
    const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

    // Inject tenant context into request
    req.tenant = {
      id: tenant.id,
      college_name: tenant.college_name,
      uniq_string: tenant.uniq_string,
      db_string: tenant.db_string,
    };
    req.tenantPrisma = tenantPrisma;
    next();
  } catch (error) {
    logger.error('Tenant validation error:', error);
    Response({
      res,
      data: null,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: 'Failed to validate tenant',
    });
  }
}

export default validateTenant;
