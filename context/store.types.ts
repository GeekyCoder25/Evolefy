import {OnboardingResponse} from '@/services/apis/onboarding';
import {User} from '@/services/apis/user';

export interface GlobalState {
	user: User | null;
	onboardingResponses: OnboardingResponse[];
	showStreakModal: boolean;
	showChallengeModal: boolean;
	setUser: (user: User | null) => void;
	setShowStreakModal: (showStreakModal: boolean) => void;
	setShowChallengeModal: (showChallengeModal: boolean) => void;
	setOnboardingResponses: (cart: OnboardingResponse[]) => void;
	reset: () => void;
}
