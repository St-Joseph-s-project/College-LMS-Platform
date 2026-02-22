import { Request, Response as ExprResponse } from "express";
import { STATUS_CODE } from "../../../constants/appConstants";
import { Response as responseGenerator } from "../../../utils";
import * as roadmapService from "./roadmapService";

export const getAllRoadmapsController = async (req: Request, res: ExprResponse) => {
  try {
    const roadmaps = await roadmapService.getAllRoadmapsService(req);
    return responseGenerator({ res, statusCode: STATUS_CODE.OK, message: "Roadmaps fetched successfully", data: roadmaps });
  } catch (err: any) {
    return responseGenerator({ 
      res, 
      statusCode: err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, 
      message: err.message || "Something went wrong",
      data: null 
    });
  }
};

export const getRoadmapByIdController = async (req: Request, res: ExprResponse) => {
  try {
    const id = parseInt(req.params.roadmapId as string);
    if (isNaN(id)) {
      return responseGenerator({ res, statusCode: STATUS_CODE.BAD_REQUEST, message: "Invalid roadmap ID", data: null });
    }
    const roadmap = await roadmapService.getRoadmapByIdService(req, id);
    return responseGenerator({ res, statusCode: STATUS_CODE.OK, message: "Roadmap fetched successfully", data: roadmap });
  } catch (err: any) {
    return responseGenerator({ 
      res, 
      statusCode: err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, 
      message: err.message || "Something went wrong",
      data: null 
    });
  }
};

export const getRoadmapCoursesController = async (req: Request, res: ExprResponse) => {
  try {
    const roadmapId = parseInt(req.params.roadmapId as string);
    if (isNaN(roadmapId)) {
      return responseGenerator({ res, statusCode: STATUS_CODE.BAD_REQUEST, message: "Invalid roadmap ID", data: null });
    }
    const courses = await roadmapService.getRoadmapCoursesService(req, roadmapId);
    return responseGenerator({ res, statusCode: STATUS_CODE.OK, message: "Roadmap courses fetched successfully", data: courses });
  } catch (err: any) {
    return responseGenerator({ 
      res, 
      statusCode: err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, 
      message: err.message || "Something went wrong",
      data: null 
    });
  }
};

export const getCourseModulesController = async (req: Request, res: ExprResponse) => {
  try {
    const courseId = parseInt(req.params.courseId as string);
    if (isNaN(courseId)) {
      return responseGenerator({ res, statusCode: STATUS_CODE.BAD_REQUEST, message: "Invalid course ID", data: null });
    }
    const modules = await roadmapService.getCourseModulesService(req, courseId);
    return responseGenerator({ res, statusCode: STATUS_CODE.OK, message: "Course modules fetched successfully", data: modules });
  } catch (err: any) {
    return responseGenerator({ 
      res, 
      statusCode: err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, 
      message: err.message || "Something went wrong",
      data: null 
    });
  }
};
