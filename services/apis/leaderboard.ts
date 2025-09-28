import {AxiosClient} from '@/utils/axios';
import {ApiResponse, User} from './user';

const axiosClient = new AxiosClient();

export interface LeaderboardUser {
	id: number;
	type: string;
	attributes: User;
	relationships: any[];
	meta: {
		created_at: string | null;
		updated_at: string | null;
		email_verified_at: string | null;
	};
}

type LeaderboardResponse = ApiResponse<LeaderboardUser[]>;

export const fetchLeaderboard = async () => {
	const response = await axiosClient.get<LeaderboardResponse>(
		'/leaderboard/latest'
	);
	return response.data;
};
