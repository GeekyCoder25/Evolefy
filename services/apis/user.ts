import {AxiosClient} from '@/utils/axios';

const axiosClient = new AxiosClient();

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	code: number;
	data: T;
}

export interface User {
	id: number;
	fullname: string;
	email: string;
	dob: string; // ISO date string format
	city: string;
	subscription_status: string;
	streak_count: number;
	ev_score: number;
	profile_picture: string | null;
	has_completed_onboarding: boolean;
}
type UserProfileResponse = ApiResponse<{
	id: number;
	type: string;
	attributes: User;
	relationships: any[]; // Empty array in this case, could be more specific if you know the structure
	meta: {
		created_at: string; // ISO datetime string
		updated_at: string; // ISO datetime string
		email_verified_at: string | null;
	};
}>;

export interface UpdateProfilePayload {
	fullname: string;
	email: string;
	dob: string; // ISO date string format
	city: string;
	profile_picture?: string;
}

// Future Me attributes interface
interface FutureMeAttributes {
	date: string; // Date in YYYY-MM-DD format
	time: string; // ISO datetime string
	message_to_future_self: string;
	original_image_url: string;
	future_occupation: string;
	estimated_networth: string;
	spiritual_growth: string; // Percentage as string (e.g., "92%")
	relationship_status: string;
	overall_growth_percent: number;
	goal_achievement_percent: number;
	consistency_level: number;
	transformed_image_url: string;
}

// Future Me meta information interface

// Future Me object interface
interface FutureMe {
	id: number;
	type: 'future_me';
	attributes: FutureMeAttributes;
	relationships: any[]; // Empty array in current response
	meta: {
		created_at: string; // ISO datetime string
		updated_at: string; // ISO datetime string
	};
}
interface DailyChallenge {
	id: number;
	type: 'daily_challenge';
	attributes: {
		category: string;
		challenge: string;
		challenge_date: string;
		completed_at: string | null;
		difficulty: string;
		evo_points_awarded: number;
		status: string;
	};
	relationships: any[]; // Empty array in current response
	meta: {
		created_at: string; // ISO datetime string
		updated_at: string; // ISO datetime string
	};
}

// Future Me creation response data interface
interface FutureMeResponseData {
	future_me: FutureMe;
	ai_description: string;
}

// Main Future Me API response interface

export const getUserProfile = async () => {
	const response = await axiosClient.get<UserProfileResponse>('/user/profile');
	return response.data;
};

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
	const response = await axiosClient.put<
		UpdateProfilePayload,
		UserProfileResponse
	>('/user/profile', payload);
	return response.data;
};

export const uploadProfilePhoto = async (formData: any) => {
	const response = await axiosClient.post('/user/profile-picture', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export const switchMode = async () => {
	const response = await axiosClient.get('/users/toggle');
	return response.data;
};

export const postFutureLetter = async (formData: any) => {
	const response = await axiosClient.post<
		ArrayBuffer,
		ApiResponse<FutureMeResponseData>
	>('/future-letters', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export const postFutureSelf = async (formData: any) => {
	const response = await axiosClient.post<
		ArrayBuffer,
		ApiResponse<FutureMeResponseData>
	>('/future-me', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};
export const getFutureSelf = async () => {
	const response = await axiosClient.get<ApiResponse<FutureMe[]>>('/future-me');
	return response.data;
};
export const getDailyChallenge = async () => {
	const response = await axiosClient.get<ApiResponse<DailyChallenge>>(
		'/daily-challenge/today'
	);
	return response.data;
};
export const completeChallenge = async (id: number) => {
	const response = await axiosClient.post<
		undefined,
		ApiResponse<DailyChallenge>
	>(`/daily-challenge/${id}/complete`);
	return response.data;
};

export const deleteAccount = async () => {
	const response = await axiosClient.delete('/user/account');
	return response.data;
};
