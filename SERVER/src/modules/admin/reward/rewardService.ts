import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

// this is the Reward Creation Service code 
export const createRewardService = async (req: any, data: any, file: any) => {

  const tenantPrisma = req.tenantPrisma; // ✅ use injected prisma
  
  let base64Image = "";
  if (file) {
    base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  }

  const reward = await tenantPrisma.rewards.create({
    data: {
      title: data.title,
      description: data.description,
      coins: Number(data.coins),
      image_url: base64Image,
      image_key: file ? file.originalname : "no-image",
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

  // No file deletion required since it's a base64 string in DB

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
    imageUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    imageKey = file.originalname;
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

// 🔥 Get all pending reward orders (Track Rewards)
export const getPendingRewardsService = async (req: any) => {
  const tenantPrisma = req.tenantPrisma;

  return await tenantPrisma.users_rewards.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rewards: {
        select: {
          id: true,
          title: true,
          coins: true,
          image_url: true,
        },
      },
    },
    orderBy: {
      ordered_date: "desc",
    },
  });
};


// 🔥 Get all delivered reward orders (History)
export const getDeliveredRewardsService = async (req: any) => {
  const tenantPrisma = req.tenantPrisma;

  return await tenantPrisma.users_rewards.findMany({
    where: {
      status: "DELIVERED",
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rewards: {
        select: {
          id: true,
          title: true,
          coins: true,
          image_url: true,
        },
      },
    },
    orderBy: {
      delivered_date: "desc",
    },
  });
};

export const updateOrderStatusService = async (req: any, id: number, status: string) => {
  const tenantPrisma = req.tenantPrisma;

  const order = await tenantPrisma.users_rewards.findUnique({
    where: { id }
  });

  if (!order) {
    throw new CustomError({
      message: "Order not found",
      statusCode: STATUS_CODE.NOT_FOUND
    });
  }

  const updateData: any = { status };
  if (status === "DELIVERED" && order.status !== "DELIVERED") {
    updateData.delivered_date = new Date();
  }

  const updatedOrder = await tenantPrisma.users_rewards.update({
    where: { id },
    data: updateData
  });

  return updatedOrder;
};
