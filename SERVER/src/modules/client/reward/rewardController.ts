import type { Request, Response as ExpressResponse } from 'express';
import { Response, CustomError } from '../../../utils';
import { STATUS_CODE } from '../../../constants';
import { getAllRewardsService, getRewardByIdService, buyRewardService, getClientRewardsHistoryService, } from './rewardService';


export const getAllRewardsController = async (req: Request, res: ExpressResponse) => {
    try {
        const prisma = req.tenantPrisma;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getAllRewardsService(req);

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
        const result = await getClientRewardsHistoryService(req);

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
        const reward = await getRewardByIdService(req, Number(req.params.id));

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
        const rewardId = req.params.id;

        if (!rewardId) {
            return Response({
                res,
                data: null,
                message: "Reward ID is required",
                statusCode: STATUS_CODE.BAD_REQUEST,
            });
        }

        const result = await buyRewardService(req, Number(rewardId));

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













