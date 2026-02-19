import { getApi, postApi, putApi, deleteApi } from "../../../../api/apiservice";
import type {
  ApiResponse,
  Module,
  CreateModuleRequest,
  UpdateModuleRequest,
  UpdateModuleVisibilityRequest,
  SubModuleDetailsResponse,
} from "../types/module";

const BASE_URL = "/admin/module";

export const getModulesByCourseId = async (courseId: number): Promise<ApiResponse<Module[]>> => {
  const data = await getApi({
    url: `${BASE_URL}/get-all/${courseId}`,
    showToaster: false,
    showLoader: false
  });
  return data;
};

export const createModule = async (
  courseId: number,
  data: CreateModuleRequest
): Promise<ApiResponse<Module>> => {
  const response = await postApi({
    url: `${BASE_URL}/add/${courseId}`,
    data,
  });
  return response;
};

export const updateModule = async (
  moduleId: number,
  data: UpdateModuleRequest
): Promise<ApiResponse<Module>> => {
  const response = await putApi({
    url: `${BASE_URL}/update/${moduleId}`,
    data,
  });
  return response;
};

export const updateModuleVisibility = async (
  moduleId: number,
  data: UpdateModuleVisibilityRequest
): Promise<ApiResponse<Module>> => {
  const response = await putApi({
    url: `${BASE_URL}/update-visiblity/${moduleId}`,
    data,
  });
  return response;
};

export const deleteModule = async (moduleId: number): Promise<ApiResponse<null>> => {
  const response = await deleteApi({
    url: `${BASE_URL}/delete/${moduleId}`,
  });
  return response;
};

