import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

export interface Notification {
	id: number;
	type: string;
	attributes: {
		type: string;
		title: string;
		message: string;
		data: {
			goal_id: number;
		};
		is_read: boolean;
		read_at: null;
		sent_at: string;
		channel: string;
		priority: string;
		action_url: string;
		action_text: string;
		priority_color: string;
		priority_icon: string;
		type_icon: string;
	};
	relationships: never[];
	meta: {
		created_at: string;
		updated_at: string;
	};
}

export interface GroupedNotification {
	title: string;
	data: Notification[];
}

export const listNotifications = async () => {
	const response =
		await axiosClient.get<ApiResponse<Notification[]>>('/notifications');
	return response.data;
};
