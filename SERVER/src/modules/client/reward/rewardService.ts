import { PrismaClient as TenantPrismaClient } from '@prisma/tenant-client';
import { CustomError } from '../../../utils';
import { STATUS_CODE } from '../../../constants';
import logger from '../../../config/logger';

export const getAllRewardsService = async ({ prisma, page = 1, limit = 10 }: { prisma: TenantPrismaClient, page?: number, limit?: number }) => {
    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }

    try {
        const skip = (page - 1) * limit;

        const [rewards, total] = await Promise.all([
            prisma.rewards.findMany({
                where: {
                    is_deleted: false,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    coins: true,
                    image_url: true,
                    created_at: true,
                },
                orderBy: {
                    created_at: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.rewards.count({
                where: {
                    is_deleted: false,
                },
            }),
        ]);

        return {
            data: rewards,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    } catch (error: unknown) {
        logger.error("Error fetching rewards:", error);
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError({ message: "Failed to fetch rewards", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}

export const getClientRewardsHistoryService = async ({ prisma, userId, page = 1, limit = 10 }: { prisma: TenantPrismaClient, userId: number, page?: number, limit?: number }) => {
    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }

    try {
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            prisma.users_rewards.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                    status: true,
                    ordered_date: true,
                    delivered_date: true,
                    rewards: {
                        select: {
                            id: true,
                            title: true,
                            coins: true,
                            image_url: true,
                        }
                    }
                },
                orderBy: {
                    ordered_date: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.users_rewards.count({
                where: {
                    user_id: userId,
                },
            }),
        ]);

        return {
            data: history,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    } catch (error: unknown) {
        logger.error("Error fetching rewards history:", error);
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError({ message: "Failed to fetch rewards history", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}

export const getRewardByIdService = async ({ prisma, id }: { prisma: TenantPrismaClient, id: number }) => {
    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }

    try {
        const reward = await prisma.rewards.findUnique({
            where: {
                id: id,
                is_deleted: false,
            },
            select: {
                id: true,
                title: true,
                description: true,
                coins: true,
                image_url: true,
                created_at: true,
            },
        });

        if (!reward) {
            throw new CustomError({ message: "Reward not found", statusCode: STATUS_CODE.NOT_FOUND });
        }

        return reward;
    } catch (error: unknown) {
        logger.error("Error fetching reward:", error);
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError({ message: "Failed to fetch reward", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}

export const buyRewardService = async ({ prisma, userId, rewardId }: { prisma: TenantPrismaClient, userId: number, rewardId: number }) => {
    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }

    return await prisma.$transaction(async (tx) => {
        const user = await tx.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new CustomError({ message: "User not found", statusCode: STATUS_CODE.NOT_FOUND });
        }

        const reward = await tx.rewards.findUnique({
            where: { id: rewardId, is_deleted: false },
        });

        if (!reward) {
            throw new CustomError({ message: "Reward not found", statusCode: STATUS_CODE.NOT_FOUND });
        }

        if ((user.coins || 0) < reward.coins) {
            throw new CustomError({ message: "Insufficient coins", statusCode: STATUS_CODE.BAD_REQUEST });
        }

        const updatedUser = await tx.users.update({
            where: { id: userId },
            data: {
                coins: {
                    decrement: reward.coins,
                },
            },
        });

        const userReward = await tx.users_rewards.create({
            data: {
                user_id: userId,
                reward_id: rewardId,
                status: "PENDING",
            },
        });

        return { user: updatedUser, reward: userReward };
    }, {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
    });
}
