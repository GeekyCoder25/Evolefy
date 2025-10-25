import CheckIcon from '@/assets/icons/check';
import {getOnboarding} from '@/services/apis/onboarding';
import {useQuery} from '@tanstack/react-query';
import {Image} from 'expo-image';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainContainer from '../components/MainContainer';
import ProgressIndicator from '../components/ProgressIndicator';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';

const Page4 = () => {
	const insets = useSafeAreaInsets();
	const [selectedOption, setSelectedOption] = useState('');
	const {data} = useQuery({
		queryKey: ['onboardingData'],
		queryFn: getOnboarding,
	});

	const plans: Plan[] = ['weekly', 'monthly', 'yearly'];

	return (
		<MainContainer className="px-[3%]">
			<View style={{paddingTop: insets.top + 20}} />

			{/* Header */}
			<View className="flex flex-row justify-between items-center mb-12">
				<Back />
				<TouchableOpacity onPress={() => router.push('/welcome/page1')}>
					<Text className="text-white font-sora-semibold text-base">Skip</Text>
				</TouchableOpacity>
			</View>

			{/* Progress Indicator */}
			<ProgressIndicator
				currentStep={4}
				totalSteps={data?.data.length ? data.data.length + 1 : 0}
			/>

			{/* Title */}
			<View className="mb-8">
				<Text className="text-white font-sora-semibold text-3xl leading-8">
					Choose your goals timeframe
				</Text>
			</View>

			{/* Options Grid */}
			<View className="flex-1 gap-10">
				{plans.map(plan => (
					<TouchableOpacity
						key={plan}
						className={`flex-row items-center gap-6 ${selectedOption === plan ? 'border border-white px-4 py-2 rounded-3xl' : ''}`}
						onPress={() => setSelectedOption(plan)}
					>
						{plan === 'weekly' && (
							<Image
								source={require('../../assets/images/weekly.png')}
								style={{width: 60, height: 60}}
							/>
						)}
						{plan === 'monthly' && (
							<Image
								source={require('../../assets/images/monthly.png')}
								style={{width: 60, height: 60}}
							/>
						)}
						{plan === 'yearly' && (
							<Image
								source={require('../../assets/images/yearly.png')}
								style={{width: 60, height: 60}}
							/>
						)}

						<Text className="text-white font-sora-semibold text-xl capitalize flex-1">
							{plan} plans
						</Text>
						{selectedOption === plan && <CheckIcon />}
					</TouchableOpacity>
				))}
			</View>

			{/* Continue Button */}
			<AppButton
				onPress={() => router.push('/welcome/page5')}
				disabled={!selectedOption}
			/>
			<View style={{paddingBottom: insets.bottom + 30}} />
		</MainContainer>
	);
};

export default Page4;

type Plan = 'weekly' | 'monthly' | 'yearly';
