export interface Reward {
  id: number;
  title: string;
  description: string;
  coins: number;
  image_url: string;
  image_key: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface RewardOrderUser {
  id: number;
  name: string;
  email: string;
}

export interface RewardOrderReward {
  id: number;
  title: string;
  coins: number;
  image_url: string;
}

export interface RewardOrder {
  id: number;
  user_id: number;
  reward_id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELIVERED';
  ordered_date: string;
  delivered_date: string | null;
  users: RewardOrderUser;
  rewards: RewardOrderReward;
}
