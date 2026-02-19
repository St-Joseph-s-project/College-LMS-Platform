import { Request, Response as ExpressResponse } from "express";
import {
  createRewardService,
  getRewardsService,
  deleteRewardService,
  getRewardByIdService,
  updateRewardService,
  getDeliveredRewardsService,
  getPendingRewardsService
} from "./rewardService";
import { CustomError, Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";



//this is controller for adding the new rewards in the db 
export const createRewardController = async (req: Request, res: ExpressResponse) => {
  try {
    if (!req.file) {
      throw new CustomError({
        message: "Image is required",
        statusCode: STATUS_CODE.BAD_REQUEST
      });
    }

    const reward = await createRewardService(req, req.body, req.file);

    return Response({
      res,
      data: reward,
      message: "Reward created successfully",
      statusCode: STATUS_CODE.CREATED
    });

  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError
        ? err.statusCode
        : STATUS_CODE.INTERNAL_SERVER_ERROR
    });
  }
};







//this is code for get all the rewards in the db to show to the admin
export const getRewardsController = async (req: Request, res: ExpressResponse) => {
  try {
    const rewards = await getRewardsService(req);

    return Response({
      res,
      data: rewards,
      message: "Rewards fetched successfully",
      statusCode: STATUS_CODE.OK
    });

  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
    });
  }
};






//this is the code to show the particular rewards by using its id to show to admin
export const getRewardByIdController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const id = Number(req.params.id);

    const reward = await getRewardByIdService(req, id);

    return Response({
      res,
      data: reward,
      message: "Reward fetched successfully",
      statusCode: STATUS_CODE.OK
    });

  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError
        ? err.statusCode
        : STATUS_CODE.INTERNAL_SERVER_ERROR
    });
  }
};




//this is the code to delete the particular rewards by using its id 
export const deleteRewardController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.id);

    await deleteRewardService(req, id);

    return Response({
      res,
      data: null,
      message: "Reward deleted successfully",
      statusCode: STATUS_CODE.OK
    });

  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError
        ? err.statusCode
        : STATUS_CODE.INTERNAL_SERVER_ERROR
    });
  }
};






export const updateRewardController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const id = Number(req.params.id);

    const reward = await updateRewardService(
      req,
      id,
      req.body,
      req.file
    );

    return Response({
      res,
      data: reward,
      message: "Reward updated successfully",
      statusCode: STATUS_CODE.OK
    });

  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR
    });
  }
};

<<<<<<< HEAD:SERVER/src/modules/admin/adminController.ts
// this is controller for getting orders
export const getOrdersController = async (req: Request, res: ExpressResponse) => {
  try {
    const { getOrdersService } = await import("./adminService");
    const result = await getOrdersService(req);

    return Response({
      res,
      data: result,
      message: "Orders fetched successfully",
=======











// 🔥 Track Rewards (Pending)
export const getPendingRewardsController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const data = await getPendingRewardsService(req);

    return Response({
      res,
      data,
      message: "Pending rewards fetched successfully",
>>>>>>> ashwin/lms_core:SERVER/src/modules/admin/reward/rewardController.ts
      statusCode: STATUS_CODE.OK
    });
  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
    });
  }
};

<<<<<<< HEAD:SERVER/src/modules/admin/adminController.ts
// this is controller for updating order status
export const updateOrderStatusController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      throw new CustomError({
        message: "Status is required",
        statusCode: STATUS_CODE.BAD_REQUEST
      });
    }

    const { updateOrderStatusService } = await import("./adminService");
    const result = await updateOrderStatusService(req, id, status);

    return Response({
      res,
      data: result,
      message: "Order status updated successfully",
=======

// 🔥 History Rewards (Delivered)
export const getDeliveredRewardsController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const data = await getDeliveredRewardsService(req);

    return Response({
      res,
      data,
      message: "Delivered rewards fetched successfully",
>>>>>>> ashwin/lms_core:SERVER/src/modules/admin/reward/rewardController.ts
      statusCode: STATUS_CODE.OK
    });
  } catch (err: any) {
    return Response({
      res,
      data: null,
      message: err.message,
<<<<<<< HEAD:SERVER/src/modules/admin/adminController.ts
      statusCode: err instanceof CustomError
        ? err.statusCode
        : STATUS_CODE.INTERNAL_SERVER_ERROR
=======
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR
>>>>>>> ashwin/lms_core:SERVER/src/modules/admin/reward/rewardController.ts
    });
  }
};
