import { getApi, postApi } from "../../../../api/apiservice";
import type { 
  Reward, 
  RewardHistory, 
  RewardPurchaseResponse, 
  PaginatedResponse, 
  SingleResponse,
  ListResponse
} from "../types/reward";

const BASE_URL = "/client/reward";

export const getAllRewards = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Reward>> => {
  return (await getApi({ 
    url: `${BASE_URL}/get-all`, 
    data: { page, limit } 
  })) as PaginatedResponse<Reward>;
};

export const getRewardHistory = async (page: number = 1, limit: number = 10): Promise<ListResponse<RewardHistory>> => {
  return (await getApi({ 
    url: `${BASE_URL}/history`, 
    data: { page, limit } 
  })) as ListResponse<RewardHistory>;
};

export const getRewardById = async (id: number): Promise<SingleResponse<Reward>> => {
  return (await getApi({ 
    url: `${BASE_URL}/get/${id}` 
  })) as SingleResponse<Reward>;
};

export const purchaseReward = async (id: number): Promise<SingleResponse<RewardPurchaseResponse>> => {
  return (await postApi({ 
    url: `${BASE_URL}/purchase/${id}` 
  })) as SingleResponse<RewardPurchaseResponse>;
};
