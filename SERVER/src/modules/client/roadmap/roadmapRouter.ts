import * as express from "express";
import { validateJWT, validateTenant } from "./../../../middleware";
import {
  getAllRoadmapsController,
  getRoadmapByIdController,
  getCourseModulesController,
  getRoadmapCoursesController
} from "./roadmapController";
import { roadmapValidator } from "./roadmapValidator";

const router = express.Router();

//this function retusn all the published roadmap with the name and the description
router.get("/get-all", validateJWT, validateTenant, getAllRoadmapsController);

//return the details of the roadmap name, description
router.get(
  "/get/:roadmapId",
  validateJWT,
  validateTenant,
  roadmapValidator.getRoadmapById,
  getRoadmapByIdController
);

//gets all the course mapped to the roadmap
router.get(
  "/get-course/:roadmapId",
  validateJWT,
  validateTenant,
  roadmapValidator.getRoadmapCourses,
  getRoadmapCoursesController
);

//this router returns all the modules and the submodules within the course in a nested way so that we can render it accorindly in the sidebar


export default router;