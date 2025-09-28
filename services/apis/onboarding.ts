import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

// Onboarding field attributes
interface OnboardingFieldAttributes {
	name: string;
	type: 'single_choice' | 'multi_choice' | 'text';
	options: string[] | null;
	is_active: boolean;
}

// Meta information for timestamps
interface OnboardingFieldMeta {
	created_at: string; // ISO 8601 format
	updated_at: string; // ISO 8601 format
}

// Individual onboarding field structure
interface OnboardingField {
	id: number;
	type: 'onboarding_field';
	attributes: OnboardingFieldAttributes;
	relationships: any[]; // Empty array in current data, adjust type as needed
	meta: OnboardingFieldMeta;
}

export interface OnboardingResponse {
	field_id: number;
	value: string | string[];
}

interface PostOnboardingResponse {
	responses: OnboardingResponse[];
}

// Complete API response type
type OnboardingFieldsResponse = ApiResponse<OnboardingField[]>;

export const getOnboarding = async () => {
	const response =
		await axiosClient.get<OnboardingFieldsResponse>('/onboarding/fields');
	return response.data;
};

export const postOnboardingResponse = async (payload: OnboardingResponse[]) => {
	const response = await axiosClient.post<PostOnboardingResponse, any>(
		'/onboarding/responses',
		{
			responses: payload,
		}
	);
	return response.data;
};
