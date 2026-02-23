import { Request, Response as ExprResponse } from "express";
import { STATUS_CODE } from "../../../constants/appConstants";
import { Response as responseGenerator } from "../../../utils";
import * as courseService from "./courseService";

export const getCourseModulesController = async (req: Request, res: ExprResponse) => {
  try {
    const courseId = parseInt(req.params.courseId as string);
    if (isNaN(courseId)) {
      return responseGenerator({ res, statusCode: STATUS_CODE.BAD_REQUEST, message: "Invalid course ID", data: null });
    }
    const modules = await courseService.getCourseModulesService(req, courseId);
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

export const getModuleDetailsController = async (req: Request, res: ExprResponse) => {
  try {
    const moduleId = parseInt(req.params.moduleId as string);
    if (isNaN(moduleId)) {
      return responseGenerator({ res, statusCode: STATUS_CODE.BAD_REQUEST, message: "Invalid module ID", data: null });
    }
    const module = await courseService.getModuleDetailsService(req, moduleId);
    return responseGenerator({ res, statusCode: STATUS_CODE.OK, message: "Module details fetched successfully", data: module });
  } catch (err: any) {
    return responseGenerator({ 
      res, 
      statusCode: err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, 
      message: err.message || "Something went wrong",
      data: null 
    });
  }
};

export const markSubmoduleCompleteController = async (req: Request, res: ExprResponse) => {
  try {
    const submoduleId = parseInt(req.params.submoduleId as string);
    if (isNaN(submoduleId)) {
      return responseGenerator({ res, statusCode: STATUS_CODE.BAD_REQUEST, message: "Invalid submodule ID", data: null });
    }
    const result = await courseService.markSubmoduleCompleteService(req, submoduleId);
    return responseGenerator({ res, statusCode: STATUS_CODE.OK, message: "Submodule marked as complete successfully", data: result });
  } catch (err: any) {
    return responseGenerator({ 
      res, 
      statusCode: err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR, 
      message: err.message || "Something went wrong",
      data: null 
    });
  }
};