import {HAS_ONBOARDED, SCREEN_HEIGHT} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {
	getOnboarding,
	postOnboardingResponse,
} from '@/services/apis/onboarding';
import {MemoryStorage} from '@/utils/storage';
import {useMutation, useQuery} from '@tanstack/react-query';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainContainer from '../components/MainContainer';
import ProgressIndicator from '../components/progress-indicator';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';
import TextInput from '../components/ui/TextInput';

const Page5 = () => {
	const insets = useSafeAreaInsets();
	const {onboardingResponses, setOnboardingResponses} = useGlobalStore();
	const [about, setAbout] = useState('');
	const {data} = useQuery({
		queryKey: ['onboardingData'],
		queryFn: getOnboarding,
	});

	const pageData = data?.data[3];

	const handleChange = (text: string) => {
		setAbout(text);
		if (!pageData) return;

		const prev = onboardingResponses;
		const newValue = text;
		const updatedData = () => {
			const fieldId = pageData?.id;
			const existingIndex = prev.findIndex(r => r.field_id === fieldId);

			return existingIndex !== -1
				? prev.map((r, i) =>
						i === existingIndex ? {...r, value: newValue} : r
					)
				: [...prev, {field_id: fieldId, value: newValue}];
		};
		setOnboardingResponses(updatedData());
	};

	const {mutate: submitMutation, isPending} = useMutation({
		mutationFn: postOnboardingResponse,
		onSuccess: async response => {
			router.dismissTo('/welcome/message?hasOnboard=1');
			const storage = new MemoryStorage();
			await storage.setItem(HAS_ONBOARDED, 'true');
		},
		onError: error => {
			console.log(error);
		},
	});

	const handleNavigate = async () => {
		submitMutation(onboardingResponses);
	};

	return (
		<MainContainer className="px-[3%]">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
				className="flex-1 justify-end"
			>
				<View style={{paddingTop: insets.top + 20}} />

				{/* Header */}
				<View className="flex flex-row justify-between items-center mb-12">
					<Back />
					<TouchableOpacity onPress={() => router.push('/welcome/page1')}>
						<Text className="text-white font-sora-semibold text-base">
							Skip
						</Text>
					</TouchableOpacity>
				</View>

				{/* Progress Indicator */}
				<ProgressIndicator currentStep={5} totalSteps={5} />

				{/* Title */}
				<View className="mb-8">
					<Text className="text-white font-sora-semibold text-3xl leading-8">
						{pageData?.attributes.name}
					</Text>
				</View>

				<View className="flex-1 ">
					<TextInput
						multiline
						className="min-h-72"
						textAlignVertical="top"
						onChangeText={text => handleChange(text)}
						value={
							(onboardingResponses.find(i => i.field_id === pageData?.id)
								?.value as string) || about
						}
						style={{maxHeight: SCREEN_HEIGHT * 0.4, paddingBottom: 50}}
					/>
					{about && about.length < 20 && (
						<Text className="mt-2 font-sora-regular text-red-500 text-sm">
							Minimum input length is 20 characters
						</Text>
					)}
				</View>
			</KeyboardAvoidingView>

			{/* Continue Button */}
			<AppButton
				onPress={handleNavigate}
				disabled={about.length < 20 || isPending}
				loading={isPending}
			/>
			<View style={{paddingBottom: insets.bottom + 30, marginTop: 20}} />
		</MainContainer>
	);
};

export default Page5;
