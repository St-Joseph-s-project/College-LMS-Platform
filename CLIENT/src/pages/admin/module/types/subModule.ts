export type SubModuleType = 'YT' | 'CONTENT' | 'TEST';

export interface SubModule {
  id: number;
  name: string;
  description: string;
  type: SubModuleType;
  video_url?: string;
  content?: string;
  created_at?: string;
  order_index?: number;
}

export interface SubModuleDetailsResponse {
  course: {
    name: string;
    is_published: boolean;
  };
  module: {
    name: string;
    is_published: boolean;
  };
}

export interface CreateSubModuleRequest {
  name: string;
  description?: string;
  type: SubModuleType;
  orderIndex?: number;
}

export interface UpdateSubModuleRequest {
  name?: string;
  description?: string;
  type?: SubModuleType;
  orderIndex?: number;
}

export interface Question {
  questionNo: number;
  question: string;
  options: string[];
  answer: string;
}

export interface SubModuleContentResponse {
  id: number;
  name: string;
  description: string;
  type: SubModuleType;
  content?: string;
  videoUrl?: string;
  order_index?: number;
  testContent?: Question[];
}

export interface UpdateSubModuleContentRequest {
  content?: string;
  videoUrl?: string;
  testContent?: Question[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
