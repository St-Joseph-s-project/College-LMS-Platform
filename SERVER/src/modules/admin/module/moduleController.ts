import { Request, Response as ExpressResponse } from "express";
import { 
  getAllModulesService,
  addModuleService,
  updateModuleService,
  updateModuleVisibilityService,
  deleteModuleService
} from "./moduleService";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";
import logger from "../../../config/logger";

export const getAllModulesController = async (req: Request, res: ExpressResponse) => {
  try {
    const courseId = Number(req.params.courseId);
    const modules = await getAllModulesService(req, courseId);

    return Response({
      res,
      data: modules,
      message: "Modules fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getAllModulesController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const addModuleController = async (req: Request, res: ExpressResponse) => {
  try {
    const courseId = Number(req.params.courseId);
    const moduleData = req.body;
    const newModule = await addModuleService(req, courseId, moduleData);

    return Response({
      res,
      data: newModule,
      message: "Module added successfully",
      statusCode: STATUS_CODE.CREATED,
    });
  } catch (err: any) {
    logger.error("Error in addModuleController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateModuleController = async (req: Request, res: ExpressResponse) => {
  try {
    const moduleId = Number(req.params.moduleId);
    const updateData = req.body;
    const updatedModule = await updateModuleService(req, moduleId, updateData);

    return Response({
      res,
      data: updatedModule,
      message: "Module updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateModuleController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateModuleVisibilityController = async (req: Request, res: ExpressResponse) => {
  try {
    const moduleId = Number(req.params.moduleId);
    const { isPublished } = req.body;
    const updatedModule = await updateModuleVisibilityService(req, moduleId, isPublished);

    return Response({
      res,
      data: updatedModule,
      message: "Module visibility updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateModuleVisibilityController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteModuleController = async (req: Request, res: ExpressResponse) => {
  try {
    const moduleId = Number(req.params.moduleId);
    const result = await deleteModuleService(req, moduleId);

    return Response({
      res,
      data: result,
      message: "Module deleted successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in deleteModuleController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};
