import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

interface Conversation {
	id: number;
	title: string;
	summary: string;
	context: null;
	metadata: {
		created_via: string;
		ai_model: string;
	};
	latest_message: {
		id: number;
		sender_type: string;
		sender_name: string;
		content: string;
		metadata: {
			message_length: number;
			timestamp: string;
		};
		is_processed: boolean;
		processed_at: null;
		created_at: string;
		updated_at: string;
	};
	is_active: boolean;
	last_message_at: null;
	created_at: string;
	updated_at: string;
}

interface ChatPayload {
	conversation_id: number;
	message: string;
}

export interface AIConversation {
	id: number;
	title: string;
	summary: string;
	context: string | null;
	metadata: ConversationMetadata;
	is_active: boolean;
	last_message_at: string; // ISO datetime string
	created_at: string; // ISO datetime string
	updated_at: string; // ISO datetime string
}

export interface ConversationMetadata {
	created_via: string;
	ai_model: string;
}

export interface AiResponse {
	id: number;
	sender_type: string;
	sender_name: string;
	content: string;
	metadata: AiResponseMetadata;
	is_processed: boolean;
	processed_at: string; // ISO datetime string
	created_at: string; // ISO datetime string
	updated_at: string; // ISO datetime string
}

export interface AiResponseMetadata {
	message_length: number;
	timestamp: string; // ISO datetime string
}

type ChatResponse = ApiResponse<{
	conversation: AIConversation;
	ai_response: AiResponse;
}>;

interface ConversationMessage {
	id: number;
	sender_type: 'user' | 'ai';
	sender_name: string;
	content: string;
	metadata: {
		message_length: number;
		timestamp: string; // ISO datetime string with microseconds
	};
	is_processed: boolean;
	processed_at: string | null; // Date string in YYYY-MM-DD HH:mm:ss format or null
	created_at: string; // Date string in YYYY-MM-DD HH:mm:ss format
	updated_at: string; // Date string in YYYY-MM-DD HH:mm:ss format
}

interface MessagesResponse {
	conversation: Conversation;
	messages: ConversationMessage[];
}

export const createConversation = async () => {
	const response = await axiosClient.post<any, ApiResponse<Conversation>>(
		'/evo/conversations'
	);
	return response.data;
};
export const getConversationMessages = async (id: number) => {
	const response = await axiosClient.get<ApiResponse<MessagesResponse>>(
		`/evo/conversations/${id}`
	);
	return response.data;
};

export const createChat = async (payload: ChatPayload) => {
	const response = await axiosClient.post<ChatPayload, ChatResponse>(
		'/evo/chat',
		payload
	);
	return response.data;
};
export const fetchConversationHistory = async () => {
	const response =
		await axiosClient.get<ApiResponse<Conversation[]>>('/evo/conversations');
	return response.data;
};
