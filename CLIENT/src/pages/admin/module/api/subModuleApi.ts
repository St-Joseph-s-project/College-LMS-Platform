import { getApi, postApi, putApi, deleteApi } from "../../../../api/apiservice";
import type { ApiResponse, SubModule, SubModuleDetailsResponse, CreateSubModuleRequest, UpdateSubModuleRequest } from "../types/subModule";

const BASE_URL = "/admin/submodule";



export const getSubModuleDetails = async (
  courseId: number,
  moduleId: number
): Promise<ApiResponse<SubModuleDetailsResponse>> => {
  const response = await getApi({
    url: `${BASE_URL}/get-details/${courseId}/${moduleId}`,
  });
  return response;
};

export const getAllSubModules = async (
  courseId: number,
  moduleId: number
): Promise<ApiResponse<SubModule[]>> => {
  const response = await getApi({
    url: `${BASE_URL}/get-all/${courseId}/${moduleId}`,
  });
  return response;
};

export const getSubModuleById = async (
  submoduleId: number
): Promise<ApiResponse<SubModule>> => {
  const response = await getApi({
    url: `${BASE_URL}/get/${submoduleId}`,
  });
  return response;
};

export const createSubModule = async (
  courseId: number,
  moduleId: number,
  data: CreateSubModuleRequest
): Promise<ApiResponse<SubModule>> => {
  const response = await postApi({
    url: `${BASE_URL}/add/${courseId}/${moduleId}`,
    data,
  });
  return response;
};

export const updateSubModule = async (
  subModuleId: number,
  data: UpdateSubModuleRequest
): Promise<ApiResponse<SubModule>> => {
  const response = await putApi({
    url: `${BASE_URL}/update/${subModuleId}`,
    data,
  });
  return response;
};

export const deleteSubModule = async (
  subModuleId: number
): Promise<ApiResponse<null>> => {
  const response = await deleteApi({
    url: `${BASE_URL}/delete/${subModuleId}`,
  });
  return response;
};
