import { body, validationResult } from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const subModuleValidator = {
  createSubModule: [
    body("title")
      .exists({ checkFalsy: true })
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    body("type")
      .exists({ checkFalsy: true })
      .withMessage("Type is required")
      .isIn(["TEST", "YT", "CONTENT"])
      .withMessage("Type must be one of TEST, YT, CONTENT"),

    validator
  ],

  updateSubModule: [
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    body("type")
      .optional()
      .isIn(["TEST", "YT", "CONTENT"])
      .withMessage("Type must be one of TEST, YT, CONTENT"),

    body("orderIndex")
      .optional()
      .isInt()
      .withMessage("orderIndex must be an integer"),

    validator
  ],

  deleteSubModule: [
    validator
  ],

  updateSubModuleContent: [
    body("content")
      .optional()
      .isString()
      .withMessage("Content must be a string"),

    body("videoUrl")
      .optional()
      .isString()
      .withMessage("Video URL must be a string"),

    body("testContent")
      .optional()
      .isArray()
      .withMessage("Test Content must be an array"),

    body("testContent.*.questionNo")
      .optional()
      .isInt()
      .withMessage("Question number must be an integer"),

    body("testContent.*.question")
      .optional()
      .isString()
      .withMessage("Question must be a string"),

    body("testContent.*.options")
      .optional()
      .isArray()
      .withMessage("Options must be an array"),

    body("testContent.*.answer")
      .optional()
      .isString()
      .withMessage("Answer must be a string"),

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
