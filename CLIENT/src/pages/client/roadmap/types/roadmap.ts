export interface Roadmap {
  id: number;
  name: string;
  description: string;
  is_published: boolean;
  can_view: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoadmapCourse {
  id: number;
  roadmap_id: number;
  course_id: number;
  order_index: number;
  can_view: boolean;
  lms_course: {
    id: number;
    name: string;
    description: string;
  };
  dependencies?: number[];
}

export interface RoadmapDetail extends Roadmap {
  lms_roadmap_course_mapping: RoadmapCourse[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
}

export interface SingleResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
export interface Submodule {
  id: number;
  module_id: number;
  order_index: number;
  name: string;
  type: "CONTENT" | "YT" | "TEST";
  content?: string;
}

export interface Module {
  id: number;
  course_id: number;
  order_index: number;
  name: string;
  description: string;
  is_published: boolean;
  lms_submodule: Submodule[];
}
export interface QuestionOption {
  id: number;
  option_text: string;
  is_answer: boolean;
}

export interface SubmoduleQuestion {
  id: number;
  question: string;
  lms_question_options: QuestionOption[];
}

export interface SubmoduleDetail extends Submodule {
  video_url?: string | null;
  lms_submodule_question: SubmoduleQuestion[];
}

export interface ModuleDetail {
  id: number;
  name: string;
  description: string;
  lms_submodule: SubmoduleDetail[];
}
