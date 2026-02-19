export type SubModuleType = 'TEST' | 'YT' | 'CONTENT';

export interface SubModule {
  id: number;
  name: string;
  description: string;
  type: SubModuleType;
  video_url?: string;
  content?: string;
  is_test?: boolean;
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
  title: string;
  description?: string;
  type: SubModuleType;
  orderIndex?: number;
}

export interface UpdateSubModuleRequest {
  title?: string;
  description?: string;
  type?: SubModuleType;
  orderIndex?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
