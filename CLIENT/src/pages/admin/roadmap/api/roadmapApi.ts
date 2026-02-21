import { getApi, postApi, putApi, deleteApi } from "../../../../api/apiservice";
import type {
  Roadmap,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
  UpdateRoadmapStatusRequest,
  ApiResponse,
  AddCourseToRoadmapRequest,
  UpdateCourseMappingRequest,
  RoadmapCourseDropdown,
  RoadmapCourseMapping,
} from "../types/roadMap";


const BASE_URL = "/admin/roadmap";

export const getRoadmaps = async (): Promise<ApiResponse<Roadmap[]>> => {
  return await getApi({
    url: `${BASE_URL}/get-all`,
    showToaster: false,
  });
};

export const getRoadmapById = async (roadMapId: number): Promise<ApiResponse<Roadmap>> => {
  return await getApi({
    url: `${BASE_URL}/get/${roadMapId}`,
    showToaster: false,
  });
};

export const createRoadmap = async (data: CreateRoadmapRequest): Promise<ApiResponse<Roadmap>> => {
  return await postApi({
    url: `${BASE_URL}/add`,
    data,
  });
};

export const updateRoadmap = async (
  roadMapId: number,
  data: UpdateRoadmapRequest
): Promise<ApiResponse<Roadmap>> => {
  return await putApi({
    url: `${BASE_URL}/update/${roadMapId}`,
    data,
  });
};

export const updateRoadmapStatus = async (
  roadMapId: number,
  data: UpdateRoadmapStatusRequest
): Promise<ApiResponse<Roadmap>> => {
  return await putApi({
    url: `${BASE_URL}/update-status/${roadMapId}`,
    data,
  });
};

export const deleteRoadmap = async (roadMapId: number): Promise<ApiResponse<null>> => {
  return await deleteApi({
    url: `${BASE_URL}/delete/${roadMapId}`,
  });
};

export const getRoadmapCourses = async (
  roadmapId: number
): Promise<ApiResponse<RoadmapCourseMapping[]>> => {
  return await getApi({
    url: `${BASE_URL}/get-course/${roadmapId}`,
    showToaster: false,
  });
};

export const getAvailableCoursesDropdown = async (
  roadmapId: number
): Promise<ApiResponse<RoadmapCourseDropdown[]>> => {
  return await getApi({
    url: `${BASE_URL}/dropdown-course/${roadmapId}`,
    showToaster: false,
  });
};

export const getRoadmapCoursesDropdown = async (
  roadmapId: number
): Promise<ApiResponse<RoadmapCourseDropdown[]>> => {
  return await getApi({
    url: `${BASE_URL}/dropdown-dependency/${roadmapId}`,
    showToaster: false,
  });
};

export const addCourseToRoadmap = async (
  data: AddCourseToRoadmapRequest
): Promise<ApiResponse<RoadmapCourseMapping>> => {
  return await postApi({
    url: `${BASE_URL}/add-course`,
    data,
  });
};

export const updateCourseMapping = async (
  mappingId: number,
  data: UpdateCourseMappingRequest
): Promise<ApiResponse<RoadmapCourseMapping>> => {
  return await putApi({
    url: `${BASE_URL}/update-course/${mappingId}`,
    data,
  });
};

export const removeCourseFromRoadmap = async (
  mappingId: number
): Promise<ApiResponse<null>> => {
  return await deleteApi({
    url: `${BASE_URL}/remove-course/${mappingId}`,
  });
};
