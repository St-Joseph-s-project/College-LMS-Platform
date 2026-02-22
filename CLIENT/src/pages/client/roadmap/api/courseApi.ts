import { getApi, putApi } from "../../../../api/apiservice";
import type {  ListResponse, Module, SingleResponse, ModuleDetail } from "../types/roadmap";

const BASE_URL = "/client/course";

export const getCourseModules = async (courseId: number): Promise<ListResponse<Module>> => {
  return (await getApi({
    url: `${BASE_URL}/get-modules/${courseId}`
  })) as ListResponse<Module>;
};

export const getModuleDetails = async (moduleId: number): Promise<SingleResponse<ModuleDetail>> => {
  return (await getApi({
    url: `${BASE_URL}/get-module-details/${moduleId}`
  })) as SingleResponse<ModuleDetail>;
};

export const markSubmoduleComplete = async (submoduleId: number): Promise<SingleResponse<any>> => {
  return (await putApi({
    url: `${BASE_URL}/mark-complete/${submoduleId}`
  })) as SingleResponse<any>;
};