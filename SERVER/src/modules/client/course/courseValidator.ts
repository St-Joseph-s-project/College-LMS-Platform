import { param, validationResult } from "express-validator";
import { Request, Response as ExprResponse, NextFunction } from "express";
import { Response as responseGenerator } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const courseValidator = {

  getCourseModules: [
    param("courseId")
      .exists()
      .withMessage("Course ID is required")
      .isInt()
      .withMessage("Course ID must be an integer"),
    validator
  ],

  getModuleDetails: [
    param("moduleId")
      .exists()
      .withMessage("Module ID is required")
      .isInt()
      .withMessage("Module ID must be an integer"),
    validator
  ],

  markSubmoduleComplete: [
    param("submoduleId")
      .exists()
      .withMessage("Submodule ID is required")
      .isInt()
      .withMessage("Submodule ID must be an integer"),
    validator
  ]
};

function validator(req: Request, res: ExprResponse, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseGenerator({ 
      res, 
      statusCode: STATUS_CODE.BAD_REQUEST, 
      message: errors.array()[0].msg,
      data: null 
    });
  }

  next();
}
