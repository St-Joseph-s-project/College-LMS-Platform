import express from "express";
import { checkPermission, validateJWT, validateTenant } from "../../../middleware";
import { getSubModuleDetailsController, getAllSubModulesController, getSubModuleByIdController, createSubModuleController, updateSubModuleController, deleteSubModuleController, getSubModuleContentController, updateSubModuleContentController } from "./subModuleController";
import { subModuleValidator } from "./subModuleValidator";

const router = express.Router();


//this return the name of the course and the name of module and the is_published status of both
router.get(
  "/get-details/:courseId/:moduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_VIEW"),
  getSubModuleDetailsController
);

//this return the all submodules in the course with all the details like if the submodule like the title, description, type -> if there is isTest is true then return is TEST, if there is youtube video link then return YT, else retunr content
router.get(
  "/get-all/:courseId/:moduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_VIEW"),
  getAllSubModulesController
);

//this returns the submodule id alone
router.get(
  "/get/:submoduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_VIEW"),
  getSubModuleByIdController
);

//this only accept the title and the description[not required always] and the type -> TEST | YT | Content if it is test then make is_test true alone
router.post(
  "/add/:courseId/:moduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_ADD"),
  subModuleValidator.createSubModule,
  createSubModuleController
);


router.put(
  "/update/:submoduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_UPDATE"),
  subModuleValidator.updateSubModule,
  updateSubModuleController
);

router.delete(
  "/delete/:submoduleId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_DELETE"),
  subModuleValidator.deleteSubModule,
  deleteSubModuleController
);

router.get(
  "/get-submodule/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_VIEW"),
  getSubModuleContentController
);

router.put(
  "/update-submodule-content/:id",
  validateJWT,
  validateTenant,
  checkPermission("LMS_SUBMODULE_UPDATE"),
  subModuleValidator.updateSubModuleContent,
  updateSubModuleContentController
);

export default router;