import { body, param, validationResult } from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

const validator = (req: Request, res: ExpressResponse, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Response({
      res,
      data: errors.array(),
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: "Validation Error",
    });
  }
  next();
};

export const moduleValidator = {
  getAllModules: [
    param("courseId")
      .notEmpty()
      .withMessage("Course ID is required")
      .isInt()
      .withMessage("Course ID must be an integer"),
    
    validator,
  ],
  addModule: [
    param("courseId")
      .notEmpty()
      .withMessage("Course ID is required")
      .isInt()
      .withMessage("Course ID must be an integer"),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Name must be less than 100 characters"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("orderIndex")
      .optional()
      .isInt()
      .withMessage("Order index must be an integer"),
    validator,
  ],
  updateModule: [
    param("moduleId")
      .notEmpty()
      .withMessage("Module ID is required")
      .isInt()
      .withMessage("Module ID must be an integer"),
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Name must be less than 100 characters"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("orderIndex")
      .optional()
      .isInt()
      .withMessage("Order index must be an integer"),
    validator,
  ],
  updateVisibility: [
    param("moduleId")
      .notEmpty()
      .withMessage("Module ID is required")
      .isInt()
      .withMessage("Module ID must be an integer"),
    body("isPublished")
      .notEmpty()
      .withMessage("isPublished is required")
      .isBoolean()
      .withMessage("isPublished must be a boolean"),
    validator,
  ],
  deleteModule: [
    param("moduleId")
      .notEmpty()
      .withMessage("Module ID is required")
      .isInt()
      .withMessage("Module ID must be an integer"),
    validator,
  ],
};