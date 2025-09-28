import {create} from 'zustand';
import {GlobalState} from './store.types';

export const useGlobalStore = create<GlobalState>(set => ({
	user: null,
	onboardingResponses: [],
	setUser: user => set({user}),
	setOnboardingResponses: onboardingResponses => set({onboardingResponses}),
	reset: () => set({user: null, onboardingResponses: []}),
}));
