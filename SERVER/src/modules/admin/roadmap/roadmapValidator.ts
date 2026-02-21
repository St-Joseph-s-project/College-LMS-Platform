import { body, validationResult } from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const roadmapValidator = {
  createRoadmap: [
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    validator
  ],

  updateRoadmap: [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isString()
      .withMessage("Name must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    validator
  ],

  updateVisibility: [
    body("is_published")
      .exists()
      .withMessage("is_published is required")
      .isBoolean()
      .withMessage("is_published must be a boolean"),

    validator
  ],

  addCourseToRoadmap: [
    body("roadmap_id")
      .exists({ checkFalsy: true })
      .withMessage("Roadmap ID is required")
      .isInt()
      .withMessage("Roadmap ID must be an integer"),

    body("course_id")
      .exists({ checkFalsy: true })
      .withMessage("Course ID is required")
      .isInt()
      .withMessage("Course ID must be an integer"),

    body("order_index")
      .exists()
      .withMessage("Order index is required")
      .isInt()
      .withMessage("Order index must be an integer"),

    body("parent_course_ids")
      .optional()
      .isArray()
      .withMessage("Parent course IDs must be an array"),

    body("parent_course_ids.*")
      .isInt()
      .withMessage("Each parent course ID must be an integer"),

    validator
  ],

  updateCourseMapping: [
    body("order_index")
      .optional()
      .isInt()
      .withMessage("Order index must be an integer"),

    body("parent_course_ids")
      .optional()
      .isArray()
      .withMessage("Parent course IDs must be an array"),

    body("parent_course_ids.*")
      .isInt()
      .withMessage("Each parent course ID must be an integer"),

    validator
  ]
};

function validator(req: Request, res: ExpressResponse, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return Response({
      res,
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: errors.array()[0].msg,
      data: null,
    });
  }

  next();
}
