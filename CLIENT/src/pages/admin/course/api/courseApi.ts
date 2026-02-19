import { getApi, postApi, putApi } from "../../../../api/apiservice";
import type {
  ApiResponse,
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  UpdateVisibilityRequest,
} from "../types/course";

const BASE_URL = "/admin/course";

export const getAllCourses = async (): Promise<ApiResponse<Course[]>> => {
  const data = await getApi({
    url: `${BASE_URL}/get-all`,
  });
  return data;
};

export const getCourseById = async (id: number): Promise<ApiResponse<Course>> => {
  const data = await getApi({
    url: `${BASE_URL}/get/${id}`,
  });
  return data;
};

export const createCourse = async (data: CreateCourseRequest): Promise<ApiResponse<Course>> => {
  const response = await postApi({
    url: `${BASE_URL}/add`,
    data,
  });
  return response;
};

export const updateCourse = async (
  id: number,
  data: UpdateCourseRequest
): Promise<ApiResponse<Course>> => {
  const response = await putApi({
    url: `${BASE_URL}/update/${id}`,
    data,
  });
  return response;
};

export const deleteCourse = async (id: number): Promise<ApiResponse<null>> => {
  const response = await putApi({
    url: `${BASE_URL}/delete/${id}`,
  });
  return response;
};

export const updateCourseVisibility = async (
  id: number,
  data: UpdateVisibilityRequest
): Promise<ApiResponse<Course>> => {
  const response = await putApi({
    url: `${BASE_URL}/update-visibility/${id}`,
    data,
  });
  return response;
};

export const getCoursesDropdown = async (search?: string): Promise<ApiResponse<{ id: number; name: string }[]>> => {
  const data = await getApi({
    url: `${BASE_URL}/get-all/dropdown`,
    data: { courseName: search },
    showLoader: false,
    showToaster: false
  });
  return data;
};
