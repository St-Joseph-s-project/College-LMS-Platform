export interface Reward {
  id: number;
  title: string;
  description: string;
  coins: number;
  image_url: string;
  created_at: string;
}

export interface RewardHistory {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELIVERED";
  ordered_date: string;
  delivered_date: string | null;
  rewards: {
    id: number;
    title: string;
    coins: number;
    image_url: string;
  };
}

export interface RewardPurchaseResponse {
  user: {
    id: number;
    name: string;
    coins: number;
    [key: string]: any;
  };
  reward: {
    id: number;
    user_id: number;
    reward_id: number;
    status: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: {
    data: T[];
    meta: PaginationMeta;
  };
  message: string;
  statusCode: number;
}

export interface SingleResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ListResponse<T> {
  data: T[];
  message: string;
  statusCode: number;
}
