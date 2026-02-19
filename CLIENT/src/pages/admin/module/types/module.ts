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
}

export interface UpdateModuleRequest {
  name?: string;
  description?: string;
  orderIndex?: number;
}

export interface UpdateModuleVisibilityRequest {
  isPublished: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}
