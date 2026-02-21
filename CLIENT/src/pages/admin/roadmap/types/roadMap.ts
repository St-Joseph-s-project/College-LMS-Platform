export interface Roadmap {
  id: number;
  name: string;
  description: string;
  is_published: boolean;
  created_at: string;
  lms_roadmap_course_mapping?: RoadmapCourseMapping[];
}

export interface RoadmapCourseMapping {
  id: number;
  roadmap_id: number;
  course_id: number;
  order_index: number;
  lms_course: {
    id: number;
    name: string;
    description: string;
  };
  dependencies: number[]; // Array of parent_course_ids
}

export interface AddCourseToRoadmapRequest {
  roadmap_id: number;
  course_id: number;
  order_index: number;
  parent_course_ids?: number[];
}

export interface UpdateCourseMappingRequest {
  order_index?: number;
  parent_course_ids?: number[];
}

export interface RoadmapCourseDropdown {
  id: number;
  name: string;
}

export interface CreateRoadmapRequest {
  name: string;
  description: string;
}

export interface UpdateRoadmapRequest {
  name?: string;
  description?: string;
}

export interface UpdateRoadmapStatusRequest {
  is_published: boolean;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
