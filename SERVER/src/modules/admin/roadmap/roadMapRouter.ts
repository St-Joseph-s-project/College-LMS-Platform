import express from "express";
import { checkPermission, validateJWT, validateTenant } from "../../../middleware";
import {
  getAllRoadmapsController,
  getRoadmapByIdController,
  createRoadmapController,
  updateRoadmapController,
  updateVisibilityController,
  deleteRoadmapController,
  getRoadmapCoursesController,
  getAvailableCoursesDropdownController,
  getRoadmapCoursesDropdownController,
  addCourseToRoadmapController,
  updateCourseMappingController,
  deleteCourseMappingController,
} from "./roadmapController";
import { roadmapValidator } from "./roadmapValidator";

const router = express.Router();

//this router returns all the roadmap available with the roadmap details like the name, description, is_published status
router.get(
  "/get-all",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_VIEW"),
  getAllRoadmapsController
);

//return the details of the roadmap name, description
router.get(
  "/get/:roadMapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_VIEW"),
  getRoadmapByIdController
);

//used to update the visivlity of the roadmap 
router.put(
  "/update-status/:roadMapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_UPDATE"),
  roadmapValidator.updateVisibility,
  updateVisibilityController
);

//used to create a roadmap reqbody name, description, by default is_publised false
router.post(
  "/add",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_ADD"),
  roadmapValidator.createRoadmap,
  createRoadmapController
);

//used to update roadmap details
router.put(
  "/update/:roadMapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_UPDATE"),
  roadmapValidator.updateRoadmap,
  updateRoadmapController
);

//used to delete a roadmap
router.delete(
  "/delete/:roadMapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_DELETE"),
  deleteRoadmapController
);



//this is the router the gets all the course mapped to the road
//lms_roadmap_course_mapping -> this is the table
//lms_course_dependency -> this is for the dependency of the course
//for these two tbales you should generate and send the course details
router.get(
  "/get-course/:roadmapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_VIEW"),
  getRoadmapCoursesController
);

//this will return the course which are not linked to the roadmap in key, value pair where the key is id and he vlaue is the name
router.get(
  "/dropdown-course/:roadmapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_VIEW"),
  getAvailableCoursesDropdownController
);

//this will return the course in the roadmap for dependency in key, value pair where the key is id and he vlaue is the name
router.get(
  "/dropdown-dependency/:roadmapId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_VIEW"),
  getRoadmapCoursesDropdownController
);

//we can add a course to the roadmap this will contain the dependency too
router.post(
  "/add-course",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_ADD"),
  roadmapValidator.addCourseToRoadmap,
  addCourseToRoadmapController
);

router.put(
  "/update-course/:mappingId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_UPDATE"),
  roadmapValidator.updateCourseMapping,
  updateCourseMappingController
);

router.delete(
  "/remove-course/:mappingId",
  validateJWT,
  validateTenant,
  checkPermission("LMS_ROADMAP_UPDATE"),
  deleteCourseMappingController
);

router.get("/health", (req, res) => {
  res.json("ROADMAP ROUTER GOOD");
});

export default router;