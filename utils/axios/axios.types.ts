import {AxiosInstance} from 'axios';

import {QueryClient} from '@tanstack/react-query';
import {StorageInterface} from '../storage/storage.types';

export interface AxiosClientProps {
	baseUrl?: string;
	axiosClient?: AxiosInstance;
	storageClass?: StorageInterface;
	onAccessTokenExpire?: () => void;
	queryClient?: QueryClient;
}
