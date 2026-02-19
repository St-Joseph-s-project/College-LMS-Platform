export interface Module {
  id: number;
  course_id: number;
  name: string;
  description: string;
  order_index: number;
  is_published: boolean;
  noSubModule?: number;
  created_at?: string;
}

export interface CreateModuleRequest {
  name: string;
  description?: string;
  orderIndex?: number;
  isPublished?: boolean;
}

export interface UpdateModuleRequest {
  name?: string;
  description?: string;
  orderIndex?: number;
  isPublished?: boolean;
}

export interface UpdateModuleVisibilityRequest {
  isPublished: boolean;
}

export interface SubModuleDetailsResponse {
  course: {
    name: string;
    is_published: boolean;
  };
  module: {
    name: string;
    is_published: boolean;
    description?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}
