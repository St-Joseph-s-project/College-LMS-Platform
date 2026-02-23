import { Request, Response as ExpressResponse } from "express";
import {
  getAllRoadmapsService,
  getRoadmapByIdService,
  createRoadmapService,
  updateRoadmapService,
  updateVisibilityService,
  deleteRoadmapService,
  getRoadmapCoursesService,
  getAvailableCoursesDropdownService,
  getRoadmapCoursesDropdownService,
  addCourseToRoadmapService,
  updateCourseMappingService,
  deleteCourseMappingService,
} from "./roadmapService";
import { CustomError, Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";
import logger from "../../../config/logger";

export const getAllRoadmapsController = async (req: Request, res: ExpressResponse) => {
  try {
    const roadmaps = await getAllRoadmapsService(req);

    return Response({
      res,
      data: roadmaps,
      message: "Roadmaps fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getAllRoadmapsController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getRoadmapByIdController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.roadMapId);
    const roadmap = await getRoadmapByIdService(req, id);

    return Response({
      res,
      data: roadmap,
      message: "Roadmap fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getRoadmapByIdController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const createRoadmapController = async (req: Request, res: ExpressResponse) => {
  try {
    const roadmap = await createRoadmapService(req, req.body);
    return Response({
      res,
      data: roadmap,
      message: "Roadmap created successfully",
      statusCode: STATUS_CODE.CREATED,
    });
  } catch (err: any) {
    logger.error("Error in createRoadmapController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateRoadmapController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.roadMapId);
    const roadmap = await updateRoadmapService(req, id, req.body);

    return Response({
      res,
      data: roadmap,
      message: "Roadmap updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateRoadmapController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateVisibilityController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.roadMapId);
    const { is_published } = req.body;
    
    const roadmap = await updateVisibilityService(req, id, is_published);

    return Response({
      res,
      data: roadmap,
      message: "Roadmap visibility updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateVisibilityController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteRoadmapController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.roadMapId);
    await deleteRoadmapService(req, id);

    return Response({
      res,
      data: null,
      message: "Roadmap deleted successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in deleteRoadmapController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getRoadmapCoursesController = async (req: Request, res: ExpressResponse) => {
  try {
    const roadmapId = Number(req.params.roadmapId);
    const result = await getRoadmapCoursesService(req, roadmapId);

    return Response({
      res,
      data: result,
      message: "Roadmap courses fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getRoadmapCoursesController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getAvailableCoursesDropdownController = async (req: Request, res: ExpressResponse) => {
  try {
    const roadmapId = Number(req.params.roadmapId);
    const result = await getAvailableCoursesDropdownService(req, roadmapId);

    return Response({
      res,
      data: result,
      message: "Available courses fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getAvailableCoursesDropdownController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getRoadmapCoursesDropdownController = async (req: Request, res: ExpressResponse) => {
  try {
    const roadmapId = Number(req.params.roadmapId);
    const result = await getRoadmapCoursesDropdownService(req, roadmapId);

    return Response({
      res,
      data: result,
      message: "Roadmap courses dropdown fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getRoadmapCoursesDropdownController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const addCourseToRoadmapController = async (req: Request, res: ExpressResponse) => {
  try {
    const result = await addCourseToRoadmapService(req, req.body);

    return Response({
      res,
      data: result,
      message: "Course added to roadmap successfully",
      statusCode: STATUS_CODE.CREATED,
    });
  } catch (err: any) {
    logger.error("Error in addCourseToRoadmapController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateCourseMappingController = async (req: Request, res: ExpressResponse) => {
  try {
    const mappingId = Number(req.params.mappingId);
    const result = await updateCourseMappingService(req, mappingId, req.body);

    return Response({
      res,
      data: result,
      message: "Course mapping updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateCourseMappingController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteCourseMappingController = async (req: Request, res: ExpressResponse) => {
  try {
    const mappingId = Number(req.params.mappingId);
    await deleteCourseMappingService(req, mappingId);

    return Response({
      res,
      data: null,
      message: "Course removed from roadmap successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in deleteCourseMappingController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};
