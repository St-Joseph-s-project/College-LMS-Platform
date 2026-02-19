import { body, validationResult } from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const rewardValidator = {

  createReward: [
    body("title")
      .exists({ checkFalsy: true })
      .withMessage("Title is required"),

    body("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),

    body("coins")
      .exists({ checkFalsy: true })
      .withMessage("Coins is required")
      .isInt({ min: 1 })
      .withMessage("Coins must be between 1 and 100"),

    validator
  ],

  updateReward: [
  body("title")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("coins")
    .optional({ checkFalsy: true })
    .isInt({ min: 1})
    .withMessage("Coins must be between 1 and 100"),

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



