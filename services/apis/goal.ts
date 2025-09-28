import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

interface WeeklyGoal {
	id: number;
	type: 'weekly_goal';
	attributes: {
		title: string;
		description: string;
		priority: 'high' | 'medium' | 'low';
		status: 'pending' | 'in_progress' | 'completed';
		week_start_date: string;
		week_end_date: string;
		target_completion_date: string;
		completed_at: string | null;
	};
	relationships: any[];
	meta: {
		created_at: string;
		updated_at: string;
	};
}

export interface Goal {
	id: number;
	type: 'goal';
	attributes: {
		task: string;
		priority: 'high' | 'medium' | 'low';
		status: 'pending' | 'in_progress' | 'completed';
		due_date: string;
	};
	relationships: any[];
	meta: {
		created_at: string;
		updated_at: string;
	};
}

interface CreateGoalPayload {
	task: string;
	priority: string;
	due_date: string;
	recurring_interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | string;
	recurring_interval_value: number;
}

export interface AITaskSuggestion {
	title: string;
	description: string;
}

interface AITaskSuggestionsResponse {
	success: boolean;
	message: string;
	code: number;
	data: AITaskSuggestion[];
}

type WeeklyGoalsResponse = ApiResponse<WeeklyGoal[]>;
type GoalResponse = ApiResponse<Goal[]>;
type CreateGoalResponse = ApiResponse<Goal>;

export const getGoalById = async (id: number) => {
	const response = await axiosClient.get<CreateGoalResponse>(`/goals/${id}`);
	return response.data;
};

export const getTodayGoal = async () => {
	const response = await axiosClient.get<GoalResponse>('/evo/goals/today');
	return response.data;
};

export const getWeeklyGoals = async () => {
	const response =
		await axiosClient.get<WeeklyGoalsResponse>('/evo/weekly-goals');
	return response.data;
};

export const createGoal = async (payload: CreateGoalPayload) => {
	const response = await axiosClient.post<
		CreateGoalPayload,
		CreateGoalResponse
	>('/goals', payload);
	return response.data;
};
export const updateGoal = async (
	id: string,
	payload: Partial<CreateGoalPayload>
) => {
	const response = await axiosClient.put<
		Partial<CreateGoalPayload>,
		CreateGoalResponse
	>(`/goals/${id}`, payload);
	return response.data;
};
export const createGoalEvo = async (payload: {context?: string}) => {
	const response = await axiosClient.post<
		{context?: string},
		AITaskSuggestionsResponse
	>('/evo/goal-suggestions', payload);
	return response.data;
};

export const completeGoal = async (goalId: number) => {
	const response = await axiosClient.post(`/goals/${goalId}/complete`);
	return response.data;
};

export const deleteGoal = async (goalId: number) => {
	const response = await axiosClient.delete(`/goals/${goalId}`);
	return response.data;
};
