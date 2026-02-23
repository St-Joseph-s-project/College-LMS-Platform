import { body, query, validationResult } from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const courseValidator = {
  createCourse: [
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

  updateCourse: [
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

    body("is_published")
      .optional()
      .isBoolean()
      .withMessage("is_published must be a boolean"),

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

  getCourseDropdown: [
    query("courseName")
      .optional()
      .isString()
      .withMessage("courseName must be a string"),
    
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
