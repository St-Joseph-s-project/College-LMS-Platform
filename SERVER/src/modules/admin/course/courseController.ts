import { Request, Response as ExpressResponse } from "express";
import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  updateVisibilityService,
} from "./courseService";
import { CustomError, Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";
import logger from "../../../config/logger";

export const getAllCoursesController = async (req: Request, res: ExpressResponse) => {
  try {
    const courses = await getAllCoursesService(req);

    return Response({
      res,
      data: courses,
      message: "Courses fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getAllCoursesController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getCourseByIdController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.id);
    const course = await getCourseByIdService(req, id);

    return Response({
      res,
      data: course,
      message: "Course fetched successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in getCourseByIdController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const createCourseController = async (req: Request, res: ExpressResponse) => {
  try {
  
    const course = await createCourseService(req, req.body);
    return Response({
      res,
      data: course,
      message: "Course created successfully",
      statusCode: STATUS_CODE.CREATED,
    });
  } catch (err: any) {
    logger.error("Error in createCourseController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateCourseController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.id);
    const course = await updateCourseService(req, id, req.body);

    return Response({
      res,
      data: course,
      message: "Course updated successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in updateCourseController:", err);
    return Response({
      res,
      data: null,
      message: err.message,
      statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteCourseController = async (req: Request, res: ExpressResponse) => {
  try {
    const id = Number(req.params.id);
    await deleteCourseService(req, id);

    return Response({
      res,
      data: null,
      message: "Course deleted successfully",
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    logger.error("Error in deleteCourseController:", err);
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
    const id = Number(req.params.id);
    const { is_published } = req.body;
    
    const course = await updateVisibilityService(req, id, is_published);

    return Response({
      res,
      data: course,
      message: "Course visibility updated successfully",
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
