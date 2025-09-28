import {minimumDate} from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {Modal, Platform, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainContainer from '../components/MainContainer';
import ProgressIndicator from '../components/progress-indicator';
import Back from '../components/ui/back';
import AppButton from '../components/ui/button';

const DateTime = () => {
	const insets = useSafeAreaInsets();
	const [selectedDate, setSelectedDate] = useState(minimumDate(1));
	const [selectedTime, setSelectedTime] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const formatDate = (date: Date) => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		return date.toLocaleDateString('en-US', options);
	};

	const formatTime = (time: Date) => {
		return time.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	};

	const onDateChange = (event: any, date?: Date) => {
		setShowDatePicker(Platform.OS === 'ios');
		if (date) {
			setSelectedDate(date);
		}
	};

	const onTimeChange = (event: any, time?: Date) => {
		setShowTimePicker(Platform.OS === 'ios');
		if (time) {
			setSelectedTime(time);
		}
	};

	const handleNext = () => {
		// You can pass the selected date and time to the next screen
		const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
		const formattedTime = selectedTime.toTimeString().slice(0, 5); // HH:MM
		router.push(`/future/letter?date=${formattedDate}&time=${formattedTime}`);
	};

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
			<ProgressIndicator currentStep={1} totalSteps={2} maxWidth={200} />

			{/* Title */}
			<View className="mb-8">
				<Text className="text-white text-lg leading-8 font-sora-regular opacity-70 mb-2">
					Letter to futureself
				</Text>
				<Text className="text-white font-sora-semibold text-3xl leading-8">
					Please select a specific date and time in the future
				</Text>
			</View>

			<View className="gap-6 flex-1">
				{/* Date Selection */}
				<TouchableOpacity
					onPress={() => {
						setShowTimePicker(false);
						setShowDatePicker(true);
					}}
					className="bg-gray-800 rounded-2xl px-5 py-4 flex-row justify-between items-center border border-gray-700"
					style={{backgroundColor: 'rgba(45, 45, 45, 0.8)'}}
				>
					<Text className="text-white font-inter-medium text-base">
						{formatDate(selectedDate)}
					</Text>
					<View className="w-6 h-6 bg-gray-600 rounded-sm flex justify-center items-center">
						<Text className="text-white text-xs">📅</Text>
					</View>
				</TouchableOpacity>

				{/* Time Selection */}
				<TouchableOpacity
					onPress={() => {
						setShowDatePicker(false);
						setShowTimePicker(true);
					}}
					className="bg-gray-800 rounded-2xl px-5 py-4 flex-row justify-between items-center border border-gray-700"
					style={{backgroundColor: 'rgba(45, 45, 45, 0.8)'}}
				>
					<Text className="text-white font-inter-medium text-base">
						{formatTime(selectedTime)}
					</Text>
					<View className="w-6 h-6 bg-gray-600 rounded-full flex justify-center items-center">
						<Text className="text-white text-xs">🕐</Text>
					</View>
				</TouchableOpacity>
			</View>
			<AppButton
				onPress={handleNext}
				style={{marginBottom: insets.bottom + 50}}
			/>

			{/* Date Picker Modal */}
			<Modal
				visible={showDatePicker}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowDatePicker(false)}
			>
				<View
					className={`${Platform.OS === 'ios' ? 'flex-1 justify-center items-center bg-black/50' : ''}`}
				>
					<View
						className={`${Platform.OS === 'ios' ? 'bg-gray-900 rounded-3xl p-6 mx-6 w-4/5' : ''}`}
					>
						{Platform.OS === 'ios' && (
							<Text className="text-white font-sora-semibold text-lg mb-4 text-center">
								Select Date
							</Text>
						)}
						<DateTimePicker
							value={selectedDate}
							mode="date"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={onDateChange}
							minimumDate={minimumDate(1)}
							themeVariant="dark"
							style={{backgroundColor: 'transparent'}}
						/>
						{Platform.OS === 'ios' && (
							<View className="flex-row justify-between mt-6 gap-3">
								<TouchableOpacity
									onPress={() => setShowDatePicker(false)}
									className="flex-1 bg-gray-700 rounded-xl py-3"
								>
									<Text className="text-white font-sora-medium text-center">
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setShowDatePicker(false)}
									className="flex-1 bg-secondary rounded-xl py-3"
								>
									<Text className="text-white font-sora-medium text-center">
										Done
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</Modal>

			{/* Time Picker Modal */}
			<Modal
				visible={showTimePicker}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowTimePicker(false)}
			>
				<View
					className={`${Platform.OS === 'ios' ? 'flex-1 justify-center items-center bg-black/50' : ''}`}
				>
					<View
						className={`${Platform.OS === 'ios' ? 'bg-gray-900 rounded-3xl p-6 mx-6 w-4/5' : ''}`}
					>
						{Platform.OS === 'ios' && (
							<Text className="text-white font-sora-semibold text-lg mb-4 text-center">
								Select Time
							</Text>
						)}
						<DateTimePicker
							value={selectedTime}
							mode="time"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={onTimeChange}
							themeVariant="dark"
							style={{backgroundColor: 'transparent'}}
						/>
						{Platform.OS === 'ios' && (
							<View className="flex-row justify-between mt-6 gap-3">
								<TouchableOpacity
									onPress={() => setShowTimePicker(false)}
									className="flex-1 bg-gray-700 rounded-xl py-3"
								>
									<Text className="text-white font-sora-medium text-center">
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setShowTimePicker(false)}
									className="flex-1 bg-secondary rounded-xl py-3"
								>
									<Text className="text-white font-sora-medium text-center">
										Done
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</Modal>
		</MainContainer>
	);
};

export default DateTime;
