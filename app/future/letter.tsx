import {SCREEN_HEIGHT} from '@/constants';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
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

const Letter = () => {
	const {date, time} = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [letter, setLetter] = useState('');
	const handleNext = () => {
		// You can pass the selected date and time to the next screen
		router.push(
			`/future/upload?date=${date}&time=${time}&letter=${encodeURIComponent(letter)}`
		);
	};

	return (
		<MainContainer className="px-[3%]">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
				className="flex-1"
			>
				<View style={{paddingTop: insets.top + 20}} />

				{/* Header */}
				<View className="flex flex-row justify-between items-center mb-6">
					<Back />
					<TouchableOpacity onPress={() => router.push('/welcome/page1')}>
						<Text className="text-white font-sora-semibold text-base">
							Skip
						</Text>
					</TouchableOpacity>
				</View>

				{/* Progress Indicator */}
				<ProgressIndicator currentStep={2} totalSteps={2} maxWidth={200} />

				{/* Title */}
				<View className="mb-8">
					<Text className="text-white text-lg leading-8 font-sora-regular opacity-70 mb-2">
						Letter to futureself
					</Text>
					<Text className="text-white font-sora-semibold text-3xl leading-8">
						Take a moment to write to your future self.
					</Text>
				</View>

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<TextInput
						multiline
						className="min-h-72"
						textAlignVertical="top"
						onChangeText={setLetter}
						value={letter}
						style={{maxHeight: SCREEN_HEIGHT * 0.4, paddingBottom: 50}}
						maxLength={1000}
					/>
					{letter && letter.length < 50 && (
						<Text className="mt-2 font-sora-regular text-red-500 text-sm">
							Minimum input length is 50 characters
						</Text>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
			<AppButton
				onPress={handleNext}
				// style={{marginBottom: insets.bottom + 50, marginTop: 20}}
				disabled={letter.length < 50}
			/>
			<View style={{paddingBottom: insets.bottom + 30, marginTop: 20}} />
		</MainContainer>
	);
};

export default Letter;
