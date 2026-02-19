import { Request, Response as ExpressResponse } from "express";
import { getSubModuleDetailsService, getAllSubModulesService, getSubModuleByIdService, createSubModuleService, updateSubModuleService, deleteSubModuleService } from "./subModuleService";
import { CustomError, Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";
import logger from "../../../config/logger";

export const getSubModuleDetailsController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const courseId = Number(req.params.courseId);
    const moduleId = Number(req.params.moduleId);

    if (isNaN(courseId) || isNaN(moduleId)) {
      return Response({
        res,
        data: null,
        message: "Invalid courseId or moduleId",
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    }

    const details = await getSubModuleDetailsService(req, courseId, moduleId);

    return Response({
      res,
      data: details,
      message: "Sub-module details fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getSubModuleDetailsController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getAllSubModulesController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const courseId = Number(req.params.courseId);
    const moduleId = Number(req.params.moduleId);

    if (isNaN(courseId) || isNaN(moduleId)) {
      return Response({
        res,
        data: null,
        message: "Invalid courseId or moduleId",
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    }

    const subModules = await getAllSubModulesService(req, courseId, moduleId);

    return Response({
      res,
      data: subModules,
      message: "Sub-modules fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getAllSubModulesController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getSubModuleByIdController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const subModuleId = Number(req.params.submoduleId);

    if (isNaN(subModuleId)) {
      return Response({
        res,
        data: null,
        message: "Invalid subModuleId",
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    }

    const subModule = await getSubModuleByIdService(req, subModuleId);

    return Response({
      res,
      data: subModule,
      message: "Sub-module fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getSubModuleByIdController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const createSubModuleController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const courseId = Number(req.params.courseId);
    const moduleId = Number(req.params.moduleId);

    if (isNaN(courseId) || isNaN(moduleId)) {
      return Response({
        res,
        data: null,
        message: "Invalid courseId or moduleId",
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    }

    const subModule = await createSubModuleService(req, moduleId, req.body);

    return Response({
      res,
      data: subModule,
      message: "Sub-module created successfully",
      statusCode: STATUS_CODE.CREATED,
    });
  } catch (err: any) {
    logger.error("Error in createSubModuleController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateSubModuleController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const subModuleId = Number(req.params.submoduleId);

    if (isNaN(subModuleId)) {
      return Response({
        res,
        data: null,
        message: "Invalid subModuleId",
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    }

    const updatedSubModule = await updateSubModuleService(
      req,
      subModuleId,
      req.body
    );

    return Response({
      res,
      data: updatedSubModule,
      message: "Sub-module updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateSubModuleController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteSubModuleController = async (
  req: Request,
  res: ExpressResponse
) => {
  try {
    const subModuleId = Number(req.params.submoduleId);

    if (isNaN(subModuleId)) {
      return Response({
        res,
        data: null,
        message: "Invalid subModuleId",
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    }

    await deleteSubModuleService(req, subModuleId);

    return Response({
      res,
      data: null,
      message: "Sub-module deleted successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in deleteSubModuleController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode:
        err instanceof CustomError
          ? err.statusCode
          : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};
