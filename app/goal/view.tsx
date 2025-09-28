import EditIcon from '@/assets/icons/edit';
import RadioIcon from '@/assets/icons/radio';
import RadioActiveIcon from '@/assets/icons/radio-active';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {completeGoal, getGoalById, updateGoal} from '@/services/apis/goal';
import {getRoadMap, RoadmapStep} from '@/services/apis/roadmap';
import Foundation from '@expo/vector-icons/Foundation';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Header from '../(tabs)/components/Header';
import AppButton from '../components/ui/button';
import TextInput from '../components/ui/TextInput';

const priorityOptions = [
	{
		id: 'low',
		label: 'Low',
		color: 'rgba(255, 255, 255, 0.7)',
	},
	{
		id: 'medium',
		label: 'Medium',
		color: '#FF9500',
	},
	{
		id: 'high',
		label: 'High',
		color: '#E21E1E',
	},
];

const intervalOptions = [
	{id: 'daily', label: 'Daily'},
	{id: 'weekly', label: 'Weekly'},
	{id: 'monthly', label: 'Monthly'},
	{id: 'yearly', label: 'Yearly'},
];

const ViewGoal = () => {
	const {id, roadmapId}: {id: string; roadmapId: string} =
		useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const {
		data: goal,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['goal', id],
		queryFn: () => getGoalById(Number(id)),
		enabled: !!id,
	});

	const {data: roadmap} = useQuery({
		queryKey: ['roadmap'],
		queryFn: getRoadMap,
	});

	const [taskName, setTaskName] = useState(goal?.data.attributes.task || '');
	const [selectedPriority, setSelectedPriority] = useState(
		goal?.data.attributes.priority || ''
	);
	const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
	const [selectedInterval, setSelectedInterval] = useState('');
	const [showIntervalDropdown, setShowIntervalDropdown] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapStep | null>(
		null
	);

	useEffect(() => {
		if (error) {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data.message
					: 'An error occurred',
			});
			router.back();
		}
	}, [error]);

	useEffect(() => {
		if (goal) {
			setTaskName(goal.data.attributes.task);
			setSelectedPriority(goal.data.attributes.priority);
		}
	}, [goal]);

	useEffect(() => {
		if (roadmap && roadmapId) {
			const selectedRoadmap = roadmap.data.find(
				r => r.id.toString() === roadmapId
			);
			if (selectedRoadmap) {
				setSelectedRoadmap(selectedRoadmap);
				setTaskName(selectedRoadmap.description);
				setSelectedPriority('high');
				setSelectedInterval('daily');
			}
		}
	}, [roadmap, roadmapId]);

	const handlePrioritySelect = (priority: string) => {
		setSelectedPriority(priority);
		setShowPriorityDropdown(false);
	};

	const handleIntervalSelect = (interval: string) => {
		setSelectedInterval(interval);
		setShowIntervalDropdown(false);
	};

	const {mutate: completeTaskMutate, isPending: isCompleting} = useMutation({
		mutationFn: completeGoal,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['today_goals']});
			queryClient.invalidateQueries({queryKey: ['weekly_goals']});
			queryClient.invalidateQueries({queryKey: ['goal', id]});
			queryClient.invalidateQueries({queryKey: ['roadmap']});
			queryClient.invalidateQueries({queryKey: ['roadmap-stats']});
			queryClient.invalidateQueries({queryKey: ['leaderboard']});
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Goal completed successfully.',
			});
			router.back();
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data?.message
					: 'Failed to complete the task. Please try again.',
			});
		},
	});

	const {mutate: updateTaskMutate, isPending: isUpdating} = useMutation({
		mutationFn: () =>
			updateGoal(id, {
				task: taskName,
				priority: selectedPriority,
				due_date: selectedDate.toISOString(),
				recurring_interval: selectedInterval,
				recurring_interval_value: 1,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['today_goals']});
			queryClient.invalidateQueries({queryKey: ['weekly_goals']});
			queryClient.invalidateQueries({queryKey: ['goal', id]});
			queryClient.invalidateQueries({queryKey: ['roadmap']});
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Goal updated successfully.',
			});
			router.back();
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data?.message
					: 'Failed to update the task. Please try again.',
			});
		},
	});

	const handleComplete = () => {
		if (!taskName.trim()) {
			return;
		}

		completeTaskMutate(Number(id || roadmapId));
	};

	const handleUpdate = () => {
		if (!taskName.trim()) {
			return;
		}
		updateTaskMutate();
	};

	const onDateChange = (event: any, date?: Date) => {
		if (Platform.OS === 'android') {
			setShowDatePicker(false);
		}
		if (date && event.type !== 'dismissed') {
			setSelectedDate(date);
		}
	};

	const onTimeChange = (event: any, time?: Date) => {
		if (Platform.OS === 'android') {
			setShowTimePicker(false);
		}
		if (time && event.type !== 'dismissed') {
			setSelectedTime(time);
		}
	};

	// const formatDate = (date: Date) => {
	// 	const today = new Date();
	// 	const isToday = date.toDateString() === today.toDateString();

	// 	if (isToday) return 'Today';

	// 	const options: Intl.DateTimeFormatOptions = {
	// 		month: 'short',
	// 		day: 'numeric',
	// 	};
	// 	return date.toLocaleDateString('en-US', options);
	// };

	// const formatTime = (time: Date) => {
	// 	return time.toLocaleTimeString('en-US', {
	// 		hour: '2-digit',
	// 		minute: '2-digit',
	// 		hour12: false,
	// 	});
	// };

	// const shouldShowDatePicker = () => {
	// 	return selectedInterval && selectedInterval !== 'hourly';
	// };

	const selectedPriorityData = priorityOptions.find(
		p => p.id === selectedPriority
	);
	const selectedIntervalData = intervalOptions.find(
		i => i.id === selectedInterval
	);

	return (
		<View style={styles.container}>
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			<Header showBack showProgress title="Task" />
			{isLoading ? (
				<ActivityIndicator
					size="large"
					color={Colors.primary}
					className="flex-1 justify-center items-center"
				/>
			) : (
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{paddingBottom: insets.bottom + 120}}
				>
					<View className="px-[5%] py-10 gap-y-5">
						{/* Task Input */}
						<View>
							<TextInput
								multiline
								className="min-h-32"
								textAlignVertical="top"
								onChangeText={setTaskName}
								value={taskName}
								placeholder="Create a task"
								placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
								showGradient
								style={{
									backgroundColor: 'rgba(45, 45, 45, 1)',
									borderRadius: 16,
									padding: 12,
									color: '#FFFFFF',
									fontSize: 16,
									fontFamily: 'Inter-Regular',
								}}
								editable={isEditing}
							/>
						</View>
						{/* Priority Selector */}
						<View>
							<LinearGradient
								colors={['#00CCFF', '#1520A6']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0.4}}
								style={{borderRadius: 14, padding: 1}}
							>
								<TouchableOpacity
									onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
									className="bg-gray-800 rounded-2xl px-5 py-4 flex-row justify-between items-center"
									style={{backgroundColor: 'rgb(45, 45, 45)'}}
									disabled={!isEditing}
								>
									<Text className="text-white font-inter-medium text-base">
										{selectedPriorityData
											? selectedPriorityData.label
											: 'Priority'}
									</Text>
									<View className="transform rotate-180">
										<Text className="text-white text-lg">
											{showPriorityDropdown ? '▲' : '▼'}
										</Text>
									</View>
								</TouchableOpacity>
							</LinearGradient>

							{/* Priority Dropdown */}
							{isEditing && showPriorityDropdown && (
								<View
									className="mt-2 rounded-2xl overflow-hidden border border-gray-700"
									style={{backgroundColor: 'rgb(45, 45, 45)'}}
								>
									<Text className="text-white font-inter-medium text-sm px-5 py-3 border-b border-gray-700">
										Priority
									</Text>
									{priorityOptions.map(option => (
										<TouchableOpacity
											key={option.id}
											onPress={() => handlePrioritySelect(option.id)}
											className="flex-row items-center justify-between px-5 py-4 border-b border-gray-700"
										>
											<View className="flex-row items-center gap-3">
												<Foundation
													name="flag"
													size={24}
													color={option.color}
												/>
												<Text
													className="font-inter-medium text-base"
													style={{color: option.color}}
												>
													{option.label}
												</Text>
											</View>
											{selectedPriority === option.id ? (
												<RadioActiveIcon />
											) : (
												<RadioIcon />
											)}
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>
						{/* Interval Selector */}
						{isEditing && (
							<View>
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={{borderRadius: 14, padding: 1}}
								>
									<TouchableOpacity
										onPress={() =>
											setShowIntervalDropdown(!showIntervalDropdown)
										}
										className="bg-gray-800 rounded-2xl px-5 py-4 flex-row justify-between items-center"
										style={{backgroundColor: 'rgb(45, 45, 45)'}}
									>
										<Text className="text-white font-inter-medium text-base">
											{selectedIntervalData
												? selectedIntervalData.label
												: 'Interval'}
										</Text>
										<View className="transform rotate-180">
											<Text className="text-white text-lg">
												{showIntervalDropdown ? '▲' : '▼'}
											</Text>
										</View>
									</TouchableOpacity>
								</LinearGradient>

								{/* Interval Dropdown */}
								{showIntervalDropdown && (
									<View
										className="mt-2 rounded-2xl overflow-hidden border border-gray-700"
										style={{backgroundColor: 'rgb(45, 45, 45)'}}
									>
										<Text className="text-white font-inter-medium text-sm px-5 py-3 border-b border-gray-700">
											Interval
										</Text>
										{intervalOptions.map(option => (
											<TouchableOpacity
												key={option.id}
												onPress={() => handleIntervalSelect(option.id)}
												className="flex-row items-center justify-between px-5 py-4 border-b border-gray-700"
											>
												<Text className="text-white font-inter-medium text-base">
													{option.label}
												</Text>
												{selectedInterval === option.id ? (
													<RadioActiveIcon />
												) : (
													<RadioIcon />
												)}
											</TouchableOpacity>
										))}
									</View>
								)}
							</View>
						)}
						{/* Date and Time Selection Row */}
						{/* {selectedInterval && (
						<View className="flex-row gap-3">
							{shouldShowDatePicker() && (
								<TouchableOpacity
									onPress={() => setShowDatePicker(true)}
									className="flex-1 bg-gray-800 rounded-2xl px-4 py-3 flex-row items-center gap-2"
									style={{backgroundColor: 'rgba(45, 45, 45, 0.8)'}}
								>
									<Text className="text-white font-inter-medium text-sm flex-1">
										{formatDate(selectedDate)}
									</Text>
									<View className="w-5 h-5 bg-gray-600 rounded items-center justify-center">
										<Text className="text-white text-xs">📅</Text>
									</View>
								</TouchableOpacity>
							)}

							<TouchableOpacity
								onPress={() => setShowTimePicker(true)}
								className={`${shouldShowDatePicker() ? 'flex-1' : 'flex-1'} bg-gray-800 rounded-2xl px-4 py-3 flex-row items-center gap-2`}
								style={{backgroundColor: 'rgba(45, 45, 45, 0.8)'}}
							>
								<Text className="text-white font-inter-medium text-sm flex-1">
									{formatTime(selectedTime)}
								</Text>
								<View className="w-5 h-5 bg-gray-600 rounded-full items-center justify-center">
									<Text className="text-white text-xs">🕐</Text>
								</View>
							</TouchableOpacity>

							{selectedInterval === 'daily' && (
								<TouchableOpacity
									className="bg-gray-800 rounded-2xl px-4 py-3 flex-row items-center gap-2"
									style={{backgroundColor: 'rgba(45, 45, 45, 0.8)'}}
								>
									<Text className="text-white font-inter-medium text-sm">
										Everyday
									</Text>
									<View className="w-5 h-5 bg-gray-600 rounded items-center justify-center">
										<Text className="text-white text-xs">🔄</Text>
									</View>
								</TouchableOpacity>
							)}
						</View>
					)} */}
					</View>
				</ScrollView>
			)}

			{/* Date Picker Modal */}
			<Modal
				visible={showDatePicker}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowDatePicker(false)}
			>
				<View className="flex-1 justify-center items-center bg-black/50">
					<View className="bg-gray-900 rounded-3xl p-6 mx-6 w-4/5">
						<Text className="text-white font-sora-semibold text-lg mb-4 text-center">
							Select Date
						</Text>
						<DateTimePicker
							value={selectedDate}
							mode={'date'}
							display="spinner"
							onChange={onDateChange}
							minimumDate={new Date()}
							themeVariant="dark"
							style={{backgroundColor: 'transparent'}}
						/>
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
				<View className="flex-1 justify-center items-center bg-black/50">
					<View className="bg-gray-900 rounded-3xl p-6 mx-6 w-4/5">
						<Text className="text-white font-sora-semibold text-lg mb-4 text-center">
							Select Time
						</Text>
						<DateTimePicker
							value={selectedTime}
							mode="time"
							display="spinner"
							onChange={onTimeChange}
							themeVariant="dark"
							style={{backgroundColor: 'transparent'}}
						/>
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
					</View>
				</View>
			</Modal>

			{/* Bottom Section */}
			<View
				className="px-[5%] pb-8"
				style={{paddingBottom: insets.bottom + 32}}
			>
				{/* Use Evo Assistant Button */}
				{!isEditing && goal && goal.data.attributes.status !== 'completed' && (
					<TouchableOpacity
						className="w-16 h-16 bg-white rounded-full items-center justify-center ml-auto"
						style={{
							shadowColor: '#000',
							shadowOffset: {width: 0, height: 4},
							shadowOpacity: 0.3,
							shadowRadius: 8,
							elevation: 8,
							bottom: insets.bottom + 50,
						}}
						onPress={() => setIsEditing(true)}
					>
						<EditIcon />
					</TouchableOpacity>
				)}

				{/* Create Goal Button */}
				{!isEditing &&
					(goal || selectedRoadmap) &&
					(goal?.data.attributes.status !== 'completed' ||
						selectedRoadmap?.status !== 'completed') && (
						<AppButton
							onPress={handleComplete}
							disabled={!taskName.trim() || !selectedPriority || isCompleting}
							buttonText="Complete goal"
							loading={isCompleting}
						/>
					)}

				{isEditing && (
					<AppButton
						onPress={handleUpdate}
						disabled={
							!taskName.trim() ||
							!selectedPriority ||
							!selectedInterval ||
							isUpdating
						}
						buttonText="Update goal"
						loading={isUpdating}
					/>
				)}
			</View>
		</View>
	);
};

export default ViewGoal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		position: 'absolute',
	},
});
