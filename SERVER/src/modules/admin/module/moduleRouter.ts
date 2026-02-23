import express from "express";
import { checkPermission, validateJWT, validateTenant } from "../../../middleware";
import {
  getAllModulesController,
  addModuleController,
  updateModuleController,
  updateModuleVisibilityController,
  deleteModuleController
} from "./moduleController";
import { moduleValidator } from "./moduleValidator";

const router = express.Router();



router.get(
  "/get-all/:courseId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_MODULE_VIEW"),
  moduleValidator.getAllModules,
  getAllModulesController
);

router.put(
  "/update/:moduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_MODULE_EDIT"),
  moduleValidator.updateModule,
  updateModuleController
);

router.post(
  "/add/:courseId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_MODULE_ADD"),
  moduleValidator.addModule,
  addModuleController
);

router.put(
  "/update-visiblity/:moduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_MODULE_EDIT"),
  moduleValidator.updateVisibility,
  updateModuleVisibilityController
);

router.delete(
  "/delete/:moduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_MODULE_DELETE"),
  moduleValidator.deleteModule,
  deleteModuleController
);
 


export default router;