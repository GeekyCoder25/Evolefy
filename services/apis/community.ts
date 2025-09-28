import {AxiosClient} from '@/utils/axios';
import {ApiResponse} from './user';

const axiosClient = new AxiosClient();

export interface Community {
	id: number;
	type: 'community';
	attributes: {
		name: string;
		description: string;
		category: string;
		member_count: number;
		is_public: boolean;
		cover_image: string | null;
	};
	relationships: {
		messages: any[]; // Empty array in current response, can be typed more specifically later
	};
	meta: {
		created_at: string; // ISO datetime string
		updated_at: string; // ISO datetime string
	};
}

interface MessageUserData {
	id: number;
	type: 'user';
	attributes: {
		name: string;
		profile_picture: string | null;
	};
}

// Message user relationship structure
interface MessageUserRelationship {
	data: MessageUserData;
}

// Community message attributes interface
interface CommunityMessageAttributes {
	message: string;
	is_edited: boolean;
}

// Community message relationships interface
interface CommunityMessageRelationships {
	user: MessageUserRelationship;
	community: any[]; // Empty array in current response
}

// Community message meta interface
interface CommunityMessageMeta {
	created_at: string; // ISO datetime string
	updated_at: string; // ISO datetime string
	is_edited: boolean; // Duplicate from attributes, keeping for completeness
}

// Individual community message interface
interface CommunityMessage {
	id: number;
	type: 'community_message';
	attributes: CommunityMessageAttributes;
	relationships: CommunityMessageRelationships;
	meta: CommunityMessageMeta;
}

interface CreateCommunityPayload {
	name: string;
	description: string;
	category: string;
	isPublic: number;
	cover_image: string;
}

export const getCommunities = async () => {
	const response = await axiosClient.get<ApiResponse<Community[]>>(
		'/connect/communities/all'
	);
	return response.data;
};
export const getMyCommunities = async () => {
	const response = await axiosClient.get<ApiResponse<Community[]>>(
		'/connect/communities'
	);
	return response.data;
};
export const getCommunityMessages = async (id: number) => {
	const response = await axiosClient.get<ApiResponse<CommunityMessage[]>>(
		`/connect/communities/${id}/messages`
	);
	return response.data;
};

export const sendMessageCommunity = async (payload: {
	id: number;
	message: string;
}) => {
	const response = await axiosClient.post<any>(
		`/connect/communities/${payload.id}/message`,
		payload
	);
	return response.data;
};

export const joinCommunity = async (id: number) => {
	const response = await axiosClient.post(`/connect/communities/${id}/join`);
	return response.data;
};

export const createCommunity = async (payload: CreateCommunityPayload) => {
	const formDataToSend = new FormData();
	const uriParts = payload.cover_image.split('/');
	const filename = uriParts[uriParts.length - 1];

	let fileType = 'image/jpeg';

	if (filename.toLowerCase().endsWith('.png')) {
		fileType = 'image/png';
	} else if (filename.toLowerCase().endsWith('.gif')) {
		fileType = 'image/gif';
	} else if (filename.toLowerCase().endsWith('.heic')) {
		fileType = 'image/heic';
	} else if (filename.toLowerCase().endsWith('.webp')) {
		fileType = 'image/webp';
	}
	payload.cover_image &&
		formDataToSend.append('cover_image', {
			uri: payload.cover_image,
			name: filename,
			type: fileType,
		} as any);
	formDataToSend.append('name', payload.name);
	formDataToSend.append('description', payload.description);
	formDataToSend.append('category', payload.category || 'Default');
	formDataToSend.append('is_public', payload.isPublic.toString());

	const response = await axiosClient.post(
		'/connect/communities',
		formDataToSend,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);
	return response.data;
};
