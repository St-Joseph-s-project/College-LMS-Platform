import { getApi } from "../../../../api/apiservice";
import type { Roadmap, RoadmapDetail, ListResponse, SingleResponse, RoadmapCourse, Module } from "../types/roadmap";

const BASE_URL = "/client/roadmap";

export const getAllRoadmaps = async (): Promise<ListResponse<Roadmap>> => {
  return (await getApi({ 
    url: `${BASE_URL}/get-all` 
  })) as ListResponse<Roadmap>;
};

export const getRoadmapById = async (roadmapId: number): Promise<SingleResponse<RoadmapDetail>> => {
  return (await getApi({ 
    url: `${BASE_URL}/get/${roadmapId}` 
  })) as SingleResponse<RoadmapDetail>;
};

export const getRoadmapCourses = async (roadmapId: number): Promise<ListResponse<RoadmapCourse>> => {
  return (await getApi({ 
    url: `${BASE_URL}/get-course/${roadmapId}` 
  })) as ListResponse<RoadmapCourse>;
};
