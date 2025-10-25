import {SCREEN_HEIGHT} from '@/constants';
import {postFutureLetter} from '@/services/apis/user';
import {useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
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
import Toast from 'react-native-toast-message';
import MainContainer from '../components/MainContainer';
import ProgressIndicator from '../components/ProgressIndicator';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';
import TextInput from '../components/ui/TextInput';

const Letter = () => {
	const {date, time} = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const [letter, setLetter] = useState('');
	const [isUploading, setIsUploading] = useState(false);

	const handleNext = async () => {
		// You can pass the selected date and time to the next screen
		// router.push(
		// 	`/future/upload?date=${date}&time=${time}&letter=${encodeURIComponent(letter)}`
		// );
		try {
			setIsUploading(true);
			const formDataToSend = new FormData();
			formDataToSend.append('scheduled_date', date as string);
			formDataToSend.append('scheduled_time', time as string);
			formDataToSend.append('title', 'Letter');
			formDataToSend.append('content', letter as string);
			const response = await postFutureLetter(formDataToSend);
			if (response.data) {
				Toast.show({
					type: 'success',
					text1: 'Success',
					text2: 'Letter submitted successfully',
				});
				await queryClient.invalidateQueries({queryKey: ['future_letter']});
				router.dismissTo('/(tabs)');
			}
		} catch (error) {
			console.error('Upload failed:', error);
			Toast.show({
				type: 'error',
				text1: 'Upload Failed',
				text2: isAxiosError(error)
					? error.response?.data?.message || error.message
					: 'Submission failed. Please try again.',
			});
		} finally {
			setIsUploading(false);
		}
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
							{/* Skip */}
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
				disabled={letter.length < 50 || isUploading}
				loading={isUploading}
			/>
			<View style={{paddingBottom: insets.bottom + 30, marginTop: 20}} />
		</MainContainer>
	);
};

export default Letter;
