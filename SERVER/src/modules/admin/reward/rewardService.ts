import fs from "fs";
import path from "path";
import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

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
