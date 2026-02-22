import { param, validationResult } from "express-validator";
import { Request, Response as ExprResponse, NextFunction } from "express";
import { Response as responseGenerator } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const roadmapValidator = {
  getRoadmapById: [
    param("roadmapId")
      .exists()
      .withMessage("Roadmap ID is required")
      .isInt()
      .withMessage("Roadmap ID must be an integer"),
    validator
  ],

  getRoadmapCourses: [
    param("roadmapId")
      .exists()
      .withMessage("Roadmap ID is required")
      .isInt()
      .withMessage("Roadmap ID must be an integer"),
    validator
  ],

  getCourseModules: [
    param("courseId")
      .exists()
      .withMessage("Course ID is required")
      .isInt()
      .withMessage("Course ID must be an integer"),
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
