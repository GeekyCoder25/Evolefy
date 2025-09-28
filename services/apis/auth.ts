import {AxiosClient} from '../../utils/axios';
import {User} from './user';

const axiosClient = new AxiosClient();

interface LoginPayload {
	email: string;
	password: string;
}

interface LoginResponse {
	success: boolean;
	message: string;
	code: number;
	data: {
		user: {
			id: number;
			type: string;
			attributes: User;
			relationships: any[]; // Empty array in this case, could be more specific if you know the structure
			meta: {
				created_at: string; // ISO datetime string
				updated_at: string; // ISO datetime string
				email_verified_at: string | null;
			};
		};
		token: string;
	};
}

interface RegisterPayload {
	fullname: string;
	email: string;
	dob: string;
	password: string;
	password_confirmation: string;
}

export interface VerifyEmailResponse {
	code: string;
	message?: string;
}

interface VerifyEmailPayload {
	email: string;
	code: string;
}

interface ResendEmailPayload {
	email: string;
}

interface ForgotPasswordPayload {
	email: string;
}

interface ResetPasswordPayload {
	token: string;
	email: string;
	password: string;
	password_confirmation: string;
}

interface ChangePasswordPayload {
	current_password: string;
	new_password: string;
	new_password_confirmation: string;
}

export const register = async (payload: RegisterPayload) => {
	const response = await axiosClient.post('/register', payload);
	return {data: response.data, status: response.status};
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
	const response = await axiosClient.post<
		VerifyEmailPayload,
		VerifyEmailResponse
	>('/verify-email', payload);
	return response.data;
};

export const resendEmailVerification = async (payload: ResendEmailPayload) => {
	const response = await axiosClient.post('/resend-verification', payload);
	return response.data;
};

export const login = async (payload: LoginPayload) => {
	const response = await axiosClient.post<LoginPayload, LoginResponse>(
		'/login',
		payload
	);
	return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
	const response = await axiosClient.post('/auth/forgot-password', payload);
	return response.data;
};

export const verifyCode = async (payload: VerifyEmailPayload) => {
	const response = await axiosClient.post<
		VerifyEmailPayload,
		VerifyEmailResponse
	>('/auth/verify-code', payload);
	return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
	const response = await axiosClient.post('/reset-password', payload);
	return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
	const response = await axiosClient.post('/auth/change-password', payload);
	return response.data;
};
