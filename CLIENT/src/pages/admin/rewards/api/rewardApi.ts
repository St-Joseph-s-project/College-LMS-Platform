import { getApi, postApi, putApi, deleteApi } from "../../../../api/apiservice";
import type { Reward, RewardOrder } from "../types/reward";

const BASE_URL = "/admin/reward";

export const getAllRewards = async (): Promise<{ message: string; data: Reward[] }> => {
  return (await getApi({ url: `${BASE_URL}/get-all` })) as { message: string; data: Reward[] };
};

export const getRewardById = async (id: number): Promise<{ message: string; data: Reward }> => {
  return (await getApi({ url: `${BASE_URL}/get/${id}` })) as { message: string; data: Reward };
};

export const createReward = async (data: FormData): Promise<{ message: string; data: Reward }> => {
  return (await postApi({
    url: `${BASE_URL}/add`,
    data,
    customHeaders: "multipart/form-data"
  })) as { message: string; data: Reward };
};

export const updateReward = async (id: number, data: FormData): Promise<{ message: string; data: Reward }> => {
  return (await putApi({
    url: `${BASE_URL}/update/${id}`,
    data,
    customHeaders: "multipart/form-data"
  })) as { message: string; data: Reward };
};

export const deleteReward = async (id: number): Promise<{ message: string; data: null }> => {
  return (await deleteApi({ url: `${BASE_URL}/delete/${id}` })) as { message: string; data: null };
};

export const getPendingRewards = async (): Promise<{ message: string; data: RewardOrder[] }> => {
  return (await getApi({ url: `${BASE_URL}/track-rewards` })) as { message: string; data: RewardOrder[] };
};

export const getHistoryRewards = async (): Promise<{ message: string; data: RewardOrder[] }> => {
  return (await getApi({ url: `${BASE_URL}/history-rewards` })) as { message: string; data: RewardOrder[] };
};

export const updateOrderStatus = async (id: number, status: string): Promise<{ message: string; data: RewardOrder }> => {
  return (await putApi({
    url: `${BASE_URL}/orders/update-status/${id}`,
    data: { status }
  })) as { message: string; data: RewardOrder };
};
