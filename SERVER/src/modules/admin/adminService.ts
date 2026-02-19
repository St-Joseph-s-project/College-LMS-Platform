import fs from "fs";
import path from "path";
import { STATUS_CODE } from "../../constants/appConstants";
import { CustomError } from "../../utils";

// this is the Reward Creation Service code 
export const createRewardService = async (req: any, data: any, file: any) => {

  const tenantPrisma = req.tenantPrisma; // ✅ use injected prisma

  const reward = await tenantPrisma.rewards.create({
    data: {
      title: data.title,
      description: data.description,
      coins: Number(data.coins),
      image_url: `/uploads/rewards/${file.filename}`,
      image_key: file.filename,
    },
  });

  return reward;
};



// this is the All Reward Getting Service code 
export const getRewardsService = async (req: any) => {

  const tenantPrisma = req.tenantPrisma; // ✅ use injected prisma

  return await tenantPrisma.rewards.findMany({
    where: { is_deleted: false },
    orderBy: { created_at: "desc" }
  });
};



// this is the Reward Getting Service code by accessing it id
export const getRewardByIdService = async (req: any, id: number) => {

  const tenantPrisma = req.tenantPrisma;

  const reward = await tenantPrisma.rewards.findFirst({
    where: {
      id,
      is_deleted: false
    }
  });

  if (!reward) {
    throw new CustomError({
      message: "Reward not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  return reward;
};




//this is reward deletion service code using it id
export const deleteRewardService = async (req: any, id: number) => {

  const tenantPrisma = req.tenantPrisma;

  const reward = await tenantPrisma.rewards.findFirst({
    where: {
      id,
      is_deleted: false
    }
  });

  if (!reward) {
    throw new CustomError({
      message: "Reward not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  // 🔥 Delete image from server
  if (reward.image_key) {
    const imagePath = path.join(
      process.cwd(),
      "uploads",
      "rewards",
      reward.image_key
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Soft delete in DB
  await tenantPrisma.rewards.update({
    where: { id },
    data: { is_deleted: true }
  });

  return true;
};




//this is the admin service code for update the rewards
export const updateRewardService = async (
  req: any,
  id: number,
  body: any,
  file: any
) => {
  const tenantPrisma = req.tenantPrisma;

  const existingReward = await tenantPrisma.rewards.findFirst({
    where: {
      id,
      is_deleted: false
    }
  });

  if (!existingReward) {
    throw new CustomError({
      message: "Reward not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  let imageUrl = existingReward.image_url;
  let imageKey = existingReward.image_key;

  // If new image uploaded
  if (file) {
    if (existingReward.image_key) {
      const oldImagePath = path.join(
        process.cwd(),
        "uploads",
        "rewards",
        existingReward.image_key
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    imageUrl = `/uploads/rewards/${file.filename}`;
    imageKey = file.filename;
  }

  const updatedReward = await tenantPrisma.rewards.update({
    where: { id },
    data: {
      title: body.title ?? existingReward.title,
      description: body.description ?? existingReward.description,
      coins: body.coins
        ? Number(body.coins)
        : existingReward.coins,
      image_url: imageUrl,
      image_key: imageKey
    }
  });

  return updatedReward;
};

// this is the admin service for getting all orders (user_rewards)
export const getOrdersService = async (req: any) => {
  const tenantPrisma = req.tenantPrisma;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status ? (req.query.status as string).split(',') : undefined;
  const search = req.query.search as string;

  const where: any = {};

  if (status) {
    where.status = { in: status };
  }

  if (search) {
    where.OR = [
      { users: { name: { contains: search, mode: 'insensitive' } } },
      { users: { registration_no: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    tenantPrisma.users_rewards.findMany({
      where,
      select: {
        id: true,
        status: true,
        ordered_date: true,
        delivered_date: true,
        users: {
          select: {
            id: true,
            name: true,
            registration_no: true,
            department_id: true,
            // You might want to include department name here if available via relation
          }
        },
        rewards: {
          select: {
            id: true,
            title: true,
            coins: true,
            image_url: true
          }
        }
      },
      orderBy: { ordered_date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    tenantPrisma.users_rewards.count({ where })
  ]);

  return {
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// this is the admin service for updating order status
export const updateOrderStatusService = async (req: any, id: number, status: string) => {
  const tenantPrisma = req.tenantPrisma;

  return await tenantPrisma.$transaction(async (tx: any) => {
    const order = await tx.users_rewards.findUnique({
      where: { id },
      include: {
        rewards: true,
        users: true
      }
    });

    if (!order) {
      throw new CustomError({
        message: "Order not found",
        statusCode: STATUS_CODE.NOT_FOUND
      });
    }

    // REFUND LOGIC: If rejecting, and it wasn't already rejected/refumed
    if (status === 'REJECTED' && order.status !== 'REJECTED') {
      await tx.users.update({
        where: { id: order.user_id },
        data: {
          coins: {
            increment: order.rewards.coins
          }
        }
      });
    }

    const updatedOrder = await tx.users_rewards.update({
      where: { id },
      data: {
        status,
        delivered_date: status === 'DELIVERED' ? new Date() : order.delivered_date
      }
    });

    return updatedOrder;
  });
};
