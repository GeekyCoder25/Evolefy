import {HAS_ONBOARDED, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {
	getOnboarding,
	postOnboardingResponse,
} from '@/services/apis/onboarding';
import {createStableRandomColor, toKebabCase} from '@/utils';
import {MemoryStorage} from '@/utils/storage';
import {useMutation, useQuery} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {router} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainContainer from '../components/MainContainer';
import ProgressIndicator from '../components/ProgressIndicator';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';
import TextInput from '../components/ui/TextInput';

interface SelectedOption {
	field_id: number;
	value: string[];
}

const Page1 = () => {
	const insets = useSafeAreaInsets();
	const {onboardingResponses, setOnboardingResponses} = useGlobalStore();
	const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
	const {data} = useQuery({
		queryKey: ['onboardingData'],
		queryFn: getOnboarding,
	});
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		if (data?.data && selectedOptions.length === 0)
			setSelectedOptions(
				data?.data.map((response, index) => ({
					field_id: index,
					value: [],
				}))
			);
	}, [data?.data, selectedOptions.length]);

	const pageData = data?.data[currentStep];

	function mapApiOptionsToUIOptions(apiOptions: string[]) {
		return apiOptions.map((option, index) => ({
			id: toKebabCase(option),
			label: option,
			color: createStableRandomColor(option),
		}));
	}

	// Usage with your API data
	function getUIOptionsFromAPI() {
		const firstFieldOptions = pageData?.attributes?.options;

		if (!firstFieldOptions) {
			return [];
		}

		return mapApiOptionsToUIOptions(firstFieldOptions);
	}

	const toggleOption = (optionId: string): void => {
		setSelectedOptions(prev => {
			const currentStepIndex = prev.findIndex(
				option => option.field_id === currentStep
			);

			if (currentStepIndex === -1) return prev;

			const updatedOptions = [...prev];
			const currentStepData = updatedOptions[currentStepIndex];

			if (pageData?.attributes.type === 'multi_choice') {
				// For multi-choice: toggle the option in the values array
				const optionIndex = currentStepData.value.findIndex(
					v => v === optionId
				);

				if (optionIndex > -1) {
					// Remove if exists
					currentStepData.value = currentStepData.value.filter(
						v => v !== optionId
					);
				} else {
					// Add if doesn't exist
					currentStepData.value = [...currentStepData.value, optionId];
				}
			} else {
				// For single choice: replace the values array with single option
				currentStepData.value = [optionId];
			}

			updatedOptions[currentStepIndex] = currentStepData;
			return updatedOptions;
		});
	};

	const options = getUIOptionsFromAPI() || [];

	const handleNavigate = async () => {
		if (!pageData) return;
		setOnboardingResponses(selectedOptions);
		console.log(
			onboardingResponses.map(field =>
				field.value.length > 1 ? field : {...field, value: field.value[0]}
			)
		);
		if (currentStep === data!.data.length - 1) {
			submitMutation(
				onboardingResponses.map(field =>
					field.value.length > 1
						? {field_id: field.field_id + 1, value: field.value}
						: {field_id: field.field_id + 1, value: field.value[0]}
				)
			);
			return;
		}
		setCurrentStep(prev => prev + 1);
		// router.push('/welcome/page2');
	};

	const {mutate: submitMutation, isPending} = useMutation({
		mutationFn: postOnboardingResponse,
		onSuccess: async response => {
			router.dismissTo('/welcome/message?hasOnboard=1');
			console.log(response.data);
			const storage = new MemoryStorage();
			await storage.setItem(HAS_ONBOARDED, 'true');
		},
		onError: error => {
			if (isAxiosError(error)) console.log(error.response?.data);
		},
	});

	const renderOption = (option: Option, index: number) => (
		<TouchableOpacity
			key={option.id}
			onPress={() => toggleOption(option.label)}
			className={`${option.color} rounded-md p-4 ${
				index % 2 === 0 ? 'mr-2' : 'ml-2'
			} mb-4 ${
				selectedOptions
					.find(option => option.field_id === currentStep)
					?.value.includes(option.label)
					? 'opacity-100 border-2 border-[#00CCFF]'
					: 'opacity-80'
			}`}
			style={{
				flex: 1,
				minHeight: SCREEN_WIDTH * 0.3,
				justifyContent: 'center',
				backgroundColor: option.color,
			}}
		>
			<Text className="text-white font-sora-semibold text-center text-xl">
				{option.label}
			</Text>
		</TouchableOpacity>
	);

	const text = selectedOptions.find(option => option.field_id === currentStep)
		?.value[0];

	return (
		<MainContainer className="px-[3%]">
			<View style={{paddingTop: insets.top + 20}} />

			{/* Header */}
			<View className="flex flex-row justify-between items-center mb-12">
				<Back
					onPress={() => setCurrentStep(prev => (prev > 0 ? prev - 1 : 0))}
				/>
				<TouchableOpacity onPress={() => router.push('/welcome/page1')}>
					{/* <Text className="text-white font-sora-semibold text-base">Skip</Text> */}
				</TouchableOpacity>
			</View>

			{/* Progress Indicator */}
			<ProgressIndicator
				currentStep={currentStep + 1}
				totalSteps={data?.data.length ? data.data.length + 1 : 0}
			/>

			{/* Title */}
			<View className="mb-8">
				<Text className="text-white font-sora-semibold text-3xl leading-8">
					{pageData?.attributes.name}
				</Text>
			</View>

			{/* Options Grid */}
			<ScrollView showsVerticalScrollIndicator={false}>
				{pageData?.attributes.type === 'text' ? (
					<View className="flex-1 ">
						<TextInput
							multiline
							className="min-h-72"
							textAlignVertical="top"
							onChangeText={text => toggleOption(text)}
							value={
								(onboardingResponses.find(i => i.field_id === currentStep)
									?.value[0] as string) ||
								text ||
								''
							}
							style={{maxHeight: SCREEN_HEIGHT * 0.4, paddingBottom: 50}}
						/>
						{text && text.length < 20 && (
							<Text className="mt-2 font-sora-regular text-red-500 text-sm">
								Minimum input length is 20 characters
							</Text>
						)}
					</View>
				) : (
					<View className="flex flex-row gap-5">
						<View className="flex-1 gap-5">
							{options
								.filter((option, index) => index % 2 === 1)
								.map((option, index) => renderOption(option, index))}
						</View>
						<View className="flex-1 gap-5">
							{options
								.filter((option, index) => index % 2 === 0)
								.map((option, index) => renderOption(option, index))}
						</View>
					</View>
				)}
			</ScrollView>

			{/* Continue Button */}
			<AppButton
				onPress={handleNavigate}
				disabled={
					selectedOptions.length === 0 ||
					(pageData?.attributes.type === 'text' &&
						(!text?.length || (text?.length && text.length < 20))) ||
					isPending
				}
				loading={isPending}
			/>
			<View style={{paddingBottom: insets.bottom + 30}} />
		</MainContainer>
	);
};

export default Page1;

interface Option {
	id: string;
	label: string;
	color: string;
}
