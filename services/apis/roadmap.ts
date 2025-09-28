import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

// Individual roadmap step structure
export interface RoadmapStep {
	id: number;
	step_number: number;
	description: string;
	status: 'pending' | 'in_progress' | 'completed';
	date: string; // YYYY-MM-DD format
	created_at: string; // YYYY-MM-DD HH:mm:ss format
	updated_at: string; // YYYY-MM-DD HH:mm:ss format
}

interface RoadmapStat {
	total_steps: 50;
	completed_steps: 0;
	pending_steps: 49;
	in_progress_steps: 1;
	completion_rate: 0;
}

// Complete API response type
export type RoadmapStepsResponse = ApiResponse<RoadmapStep[]>;
export type RoadmapStatsResponse = ApiResponse<RoadmapStat>;

export const getRoadMap = async () => {
	const response = await axiosClient.get<RoadmapStepsResponse>('/roadmap');
	return response.data;
};
export const getRoadMapStats = async () => {
	const response =
		await axiosClient.get<RoadmapStatsResponse>('/roadmap/stats');
	return response.data;
};
