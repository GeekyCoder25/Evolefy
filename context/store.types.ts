import { OnboardingResponse } from '@/services/apis/onboarding';
import { User } from '@/services/apis/user';


export interface GlobalState {
	user: User | null;
	onboardingResponses: OnboardingResponse[];
	setUser: (user: User | null) => void;
	setOnboardingResponses: (cart: OnboardingResponse[]) => void;
	reset: () => void;
}
