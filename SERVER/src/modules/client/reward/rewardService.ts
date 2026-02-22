import { STATUS_CODE } from '../../../constants';
import { CustomError } from '../../../utils';
import logger from '../../../config/logger';

// Fetch all available rewards
export const getAllRewardsService = async (req: any) => {
    const prisma = req.tenantPrisma;
    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }

    try {
        return await prisma.rewards.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                title: true,
                description: true,
                coins: true,
                image_url: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
    } catch (error: unknown) {
        logger.error("Error fetching rewards:", error);
        throw new CustomError({ message: "Failed to fetch rewards", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}

// Fetch user's reward purchase history
export const getClientRewardsHistoryService = async (req: any) => {
    const prisma = req.tenantPrisma;
    const userId = req.user?.userId;

    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
    if (!userId) {
        throw new CustomError({ message: "User ID not found", statusCode: STATUS_CODE.UNAUTHORIZED });
    }

    try {
        return await prisma.users_rewards.findMany({
            where: { user_id: Number(userId) },
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
            orderBy: { ordered_date: 'desc' },
        });
    } catch (error: unknown) {
        logger.error("Error fetching rewards history:", error);
        throw new CustomError({ message: "Failed to fetch rewards history", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}

// Fetch a single reward by ID
export const getRewardByIdService = async (req: any, id: number) => {
    const prisma = req.tenantPrisma;
    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }

    try {
        const reward = await prisma.rewards.findFirst({
            where: { id: id, is_deleted: false },
            select: {
                id: true,
                title: true,
                description: true,
                coins: true,
                image_url: true,
                created_at: true,
            }
        });

        if (!reward) {
            throw new CustomError({ message: "Reward not found", statusCode: STATUS_CODE.NOT_FOUND });
        }
        return reward;
    } catch (error: unknown) {
        logger.error("Error fetching reward:", error);
        if (error instanceof CustomError) throw error;
        throw new CustomError({ message: "Failed to fetch reward", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}

// Purchase a reward
export const buyRewardService = async (req: any, rewardId: number) => {
    const prisma = req.tenantPrisma;
    const userId = req.user?.userId;

    if (!prisma) {
        throw new CustomError({ message: "Tenant database not available", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
    if (!userId) {
        throw new CustomError({ message: "User ID not found", statusCode: STATUS_CODE.UNAUTHORIZED });
    }

    logger.info(`Starting reward purchase: User ${userId}, Reward ${rewardId}`);
    
    try {
        // 1. Fetch user and reward in parallel for better performance
        const [user, reward] = await Promise.all([
            prisma.users.findUnique({
                where: { id: Number(userId) },
                select: { id: true, coins: true }
            }),
            prisma.rewards.findFirst({
                where: { id: rewardId, is_deleted: false },
                select: { id: true, coins: true }
            })
        ]);

        if (!user) {
            throw new CustomError({ message: "User not found", statusCode: STATUS_CODE.NOT_FOUND });
        }

        if (!reward) {
            throw new CustomError({ message: "Reward not found", statusCode: STATUS_CODE.NOT_FOUND });
        }

        // 2. Validate balance
        if ((user.coins || 0) < reward.coins) {
            throw new CustomError({ message: "Insufficient coins", statusCode: STATUS_CODE.BAD_REQUEST });
        }

        // 4. Update user's coins (decrement)
        const updatedUser = await prisma.users.update({
            where: { id: Number(userId) },
            data: {
                coins: {
                    decrement: reward.coins,
                },
            },
        });

        // 5. Create the reward purchase record
        const userReward = await prisma.users_rewards.create({
            data: {
                user_id: Number(userId),
                reward_id: rewardId,
                status: "PENDING",
            },
        });

        logger.info(`Successfully processed purchase for User ${userId}, Remaining coins: ${updatedUser.coins}`);

        return { user: updatedUser, reward: userReward };
    } catch (error: unknown) {
        logger.error("Error in buyRewardService:", error);
        if (error instanceof CustomError) throw error;
        throw new CustomError({ message: "Failed to process reward purchase", statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
}
