import * as express from "express";
import { validateJWT, validateTenant } from "./../../../middleware";
import { courseValidator } from "./courseValidator";
import {
  getCourseModulesController,
  getModuleDetailsController,
  markSubmoduleCompleteController,
} from "./courseController";

const router = express.Router();

//return only the content needed for the sidebar no need to return all only the published courses
router.get(
  "/get-modules/:courseId",
  validateJWT,
  validateTenant,
  courseValidator.getCourseModules,
  getCourseModulesController
);

//this router return the module details like if the module is a type of test then it return the module test question adn option if the yt then it return the title adn the descrption adn the content and video like that doo
router.get(
  "/get-module-details/:moduleId",
  validateJWT,
  validateTenant,
  courseValidator.getModuleDetails,
  getModuleDetailsController
);

//this router is the router which triggers when the user marks a submodule as completed when he completes the submodule
router.put(
  "/mark-complete/:submoduleId",
  validateJWT,
  validateTenant,
  courseValidator.markSubmoduleComplete,
  markSubmoduleCompleteController
);

export default router;
