import OnboardingAvatar from '@/assets/icons/OnnboardingAvatar';
import {getOnboarding} from '@/services/apis/onboarding';
import {useQuery} from '@tanstack/react-query';
import {router, useLocalSearchParams} from 'expo-router';
import React from 'react';
import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainContainer from '../components/MainContainer';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';

const WelcomeMessage = () => {
	const insets = useSafeAreaInsets();
	const {hasOnboard}: {hasOnboard: string} = useLocalSearchParams();

	useQuery({
		queryKey: ['onboardingData'],
		queryFn: getOnboarding,
	});

	return (
		<MainContainer className="px-[3%]">
			<View style={{paddingTop: insets.top + 20}} />

			<Back />
			<View className="flex-1 justify-center items-center">
				<OnboardingAvatar />
				{hasOnboard ? (
					<Text className="text-white font-sora-semibold text-2xl">
						You’re all set.{`\n`}
						<Text className="text-[#FFFFFFB2] ">
							Time to get intentional with your future, see you inside buddy,
							your dashboard is ready
						</Text>
					</Text>
				) : (
					<Text className="text-white font-sora-semibold text-2xl">
						Hi, I’m Evo.{`\n`}
						<Text className="text-[#FFFFFFB2] ">
							Let’s start with a few questions so I can understand you better
							and help shape your future.
						</Text>
					</Text>
				)}
			</View>
			<AppButton
				onPress={() =>
					hasOnboard ? router.push('/(tabs)') : router.push('/welcome/page1')
				}
			/>
			<View style={{paddingTop: insets.bottom + 30}} />
		</MainContainer>
	);
};

export default WelcomeMessage;
