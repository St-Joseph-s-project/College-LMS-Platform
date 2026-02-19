import axiosInstance from "../../../../api/axiosinterceptor";
import type {
  ApiResponse,
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  UpdateVisibilityRequest,
} from "../types/course";

const BASE_URL = "/admin/course";

export const getAllCourses = async (): Promise<ApiResponse<Course[]>> => {
  const response = await axiosInstance.get<ApiResponse<Course[]>>(`${BASE_URL}/get-all`);
  return response.data;
};

export const getCourseById = async (id: number): Promise<ApiResponse<Course>> => {
  const response = await axiosInstance.get<ApiResponse<Course>>(`${BASE_URL}/get/${id}`);
  return response.data;
};

export const createCourse = async (data: CreateCourseRequest): Promise<ApiResponse<Course>> => {
  const response = await axiosInstance.post<ApiResponse<Course>>(`${BASE_URL}/add`, data);
  return response.data;
};

export const updateCourse = async (
  id: number,
  data: UpdateCourseRequest
): Promise<ApiResponse<Course>> => {
  const response = await axiosInstance.put<ApiResponse<Course>>(`${BASE_URL}/update/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.put<ApiResponse<null>>(`${BASE_URL}/delete/${id}`);
  return response.data;
};

export const updateCourseVisibility = async (
  id: number,
  data: UpdateVisibilityRequest
): Promise<ApiResponse<Course>> => {
  const response = await axiosInstance.put<ApiResponse<Course>>(
    `${BASE_URL}/update-visibility/${id}`,
    data
  );
  return response.data;
};
