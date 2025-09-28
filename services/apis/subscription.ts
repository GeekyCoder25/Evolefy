import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

interface FeatureAttributes {
	name: string;
	label: string;
	type: 'boolean' | 'count';
	unit: 'per_day' | 'per_month' | 'max' | null;
}

export interface Feature {
	id: number;
	type: 'feature';
	attributes: FeatureAttributes;
	relationships: any[];
	meta: {
		created_at: string;
		updated_at: string;
	};
}

export interface SubscriptionPlan {
	id: number;
	type: 'subscription_plan';
	attributes: {
		name: string;
		price: string;
		duration_days: number;
	};
	relationships: {
		features: Feature[];
	};
	meta: {
		created_at: string;
		updated_at: string;
	};
}

interface MySubscription {
	id: number;
	type: 'user_subscription';
	attributes: {
		user_id: number;
		plan_id: number;
		starts_at: string;
		ends_at: string;
	};
	relationships: {
		plan: SubscriptionPlan;
	};
	meta: {
		created_at: string; // ISO datetime string
		updated_at: string; // ISO datetime string
	};
}

interface PaystackPaymentData {
	payment_id: number;
	reference: string;
	authorization_url: string;
	access_code: string;
	amount: string;
	plan: SubscriptionPlan;
}

export const getSubscriptions = async () => {
	const response =
		await axiosClient.get<ApiResponse<SubscriptionPlan[]>>('/subscriptions');
	return response.data;
};

export const getSubscription = async () => {
	const response =
		await axiosClient.get<ApiResponse<MySubscription>>('/user/subscription');
	return response.data;
};

export const postSubscribe = async (id: number) => {
	const response = await axiosClient.post<
		{plan_id: number},
		ApiResponse<SubscriptionPlan>
	>('/subscribe', {plan_id: id});
	return response.data;
};

export const initializePayment = async (id: number, email: string) => {
	const response = await axiosClient.post<
		{plan_id: number; email: string},
		ApiResponse<PaystackPaymentData>
	>('/subscriptions/initialize-payment', {plan_id: id, email});
	return response.data;
};
