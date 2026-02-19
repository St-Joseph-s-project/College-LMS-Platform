import { Request, Response as ExpressResponse } from "express";
import {
  createRewardService,
  getRewardsService,
  deleteRewardService,
  getRewardByIdService,
  updateRewardService
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
