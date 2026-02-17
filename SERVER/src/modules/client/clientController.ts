import type { Request, Response as ExpressResponse } from 'express';
import { Response } from '../../utils';
import { STATUS_CODE } from '../../constants/appConstants';
import { CustomError } from '../../utils/CustomError';
import { getAllRewardsService, getRewardByIdService, buyRewardService, getClientRewardsHistoryService } from './clientService';


export const getAllRewardsController = async (req: Request, res: ExpressResponse) => {
    try {
        const prisma = req.tenantPrisma;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!prisma) {
            return Response({
                res,
                data: null,
                message: "Tenant database connection not available",
                statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
            });
        }

        const result = await getAllRewardsService({ prisma, page, limit });

        return Response({
            res,
            data: result,
            message: "Rewards fetched successfully",
            statusCode: STATUS_CODE.OK,
        })
    } catch (error: unknown) {
        let message = 'Internal Server Error';
        let statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;

        if (error instanceof CustomError) {
            message = error.message;
            statusCode = error.statusCode;
        } else if (error instanceof Error) {
            message = error.message;
        }

        return Response({
            res,
            data: null,
            message: message,
            statusCode: statusCode,
        });
    }
}

export const getClientRewardsHistoryController = async (req: Request, res: ExpressResponse) => {
    try {
        const prisma = req.tenantPrisma;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // userId from body (debug) or token
        // @ts-ignore
        const userId = req.body.userId || req.user?.userId;

        if (!prisma) {
            return Response({
                res,
                data: null,
                message: "Tenant database connection not available",
                statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
            });
        }

        if (!userId) {
            return Response({
                res,
                data: null,
                message: "User ID is required",
                statusCode: STATUS_CODE.UNAUTHORIZED,
            });
        }

        const result = await getClientRewardsHistoryService({ prisma, userId: Number(userId), page, limit });

        return Response({
            res,
            data: result,
            message: "Rewards history fetched successfully",
            statusCode: STATUS_CODE.OK,
        })
    } catch (error: unknown) {
        let message = 'Internal Server Error';
        let statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;

        if (error instanceof CustomError) {
            message = error.message;
            statusCode = error.statusCode;
        } else if (error instanceof Error) {
            message = error.message;
        }

        return Response({
            res,
            data: null,
            message: message,
            statusCode: statusCode,
        });
    }
}

export const getRewardByIdController = async (req: Request, res: ExpressResponse) => {
    try {
        const prisma = req.tenantPrisma;

        if (!prisma) {
            return Response({
                res,
                data: null,
                message: "Tenant database connection not available",
                statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
            });
        }

        const reward = await getRewardByIdService({ prisma, id: Number(req.params.id) });

        return Response({
            res,
            data: reward,
            message: "Reward fetched successfully",
            statusCode: STATUS_CODE.OK,
        })
    } catch (error: unknown) {
        let message = 'Internal Server Error';
        let statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;

        if (error instanceof CustomError) {
            message = error.message;
            statusCode = error.statusCode;
        } else if (error instanceof Error) {
            message = error.message;
        }

        return Response({
            res,
            data: null,
            message: message,
            statusCode: statusCode,
        });
    }
}

export const buyRewardController = async (req: Request, res: ExpressResponse) => {
    try {
        const prisma = req.tenantPrisma;
        const { rewardId } = req.body;

        const userId = req.body.userId || req.user?.userId;

        if (!prisma) {
            return Response({
                res,
                data: null,
                message: "Tenant database connection not available",
                statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
            });
        }

        if (!userId) {
            return Response({
                res,
                data: null,
                message: "User ID is required",
                statusCode: STATUS_CODE.UNAUTHORIZED,
            });
        }

        if (!rewardId) {
            return Response({
                res,
                data: null,
                message: "Reward ID is required",
                statusCode: STATUS_CODE.BAD_REQUEST,
            });
        }

        const result = await buyRewardService({ prisma, userId: Number(userId), rewardId: Number(rewardId) });

        return Response({
            res,
            data: result,
            message: "Reward purchased successfully",
            statusCode: STATUS_CODE.OK,
        });
    } catch (error: unknown) {
        let message = 'Internal Server Error';
        let statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;

        if (error instanceof CustomError) {
            message = error.message;
            statusCode = error.statusCode;
        } else if (error instanceof Error) {
            message = error.message;
        }

        return Response({
            res,
            data: null,
            message: message,
            statusCode: statusCode,
        });
    }
}
