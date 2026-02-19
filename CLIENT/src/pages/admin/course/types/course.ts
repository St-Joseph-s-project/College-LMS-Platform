export interface Course {
  id: number;
  name: string;
  description?: string;
  is_published: boolean;
  created_at: string;
  lms_module?: any[];
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

export interface CreateCourseRequest {
  name: string;
  description?: string;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  is_published?: boolean;
}

export interface UpdateVisibilityRequest {
  is_published: boolean;
}
