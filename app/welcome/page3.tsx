import {SCREEN_WIDTH} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {getOnboarding} from '@/services/apis/onboarding';
import {createStableRandomColor, toKebabCase} from '@/utils';
import {useQuery} from '@tanstack/react-query';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainContainer from '../components/MainContainer';
import ProgressIndicator from '../components/ProgressIndicator';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';

const Page3 = () => {
	const insets = useSafeAreaInsets();
	const {onboardingResponses, setOnboardingResponses} = useGlobalStore();
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const {data} = useQuery({
		queryKey: ['onboardingData'],
		queryFn: getOnboarding,
	});

	const pageData = data?.data[2];

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
		setSelectedOptions(prev =>
			pageData?.attributes.type === 'multi_choice'
				? prev.includes(optionId)
					? prev.filter(id => id !== optionId)
					: [...prev, optionId]
				: [optionId]
		);
	};
	const options = getUIOptionsFromAPI() || [];

	const handleNavigate = async () => {
		if (!pageData) return;
		const prev = onboardingResponses;
		const newValue =
			pageData?.attributes.type === 'multi_choice'
				? selectedOptions
				: selectedOptions[0];

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
		router.push('/welcome/page4');
	};

	const renderOption = (option: Option, index: number) => (
		<TouchableOpacity
			key={option.id}
			onPress={() => toggleOption(option.id)}
			className={`${option.color} rounded-md p-4 ${
				index % 2 === 0 ? 'mr-2' : 'ml-2'
			} mb-4 ${
				selectedOptions.includes(option.id)
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
				currentStep={3}
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
			</ScrollView>

			{/* Continue Button */}
			<AppButton
				onPress={handleNavigate}
				disabled={selectedOptions.length === 0}
			/>
			<View style={{paddingBottom: insets.bottom + 30}} />
		</MainContainer>
	);
};

export default Page3;

interface Option {
	id: string;
	label: string;
	color: string;
}
