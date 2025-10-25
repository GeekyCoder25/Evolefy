import RadioIcon from '@/assets/icons/radio';
import RadioActiveIcon from '@/assets/icons/radio-active';
import SendIcon from '@/assets/icons/send';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {
	AITaskSuggestion,
	createGoal,
	createGoalEvo,
} from '@/services/apis/goal';
import Foundation from '@expo/vector-icons/Foundation';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	TextInput as RNTextInput,
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

const Create = () => {
	const queryClient = useQueryClient();
	const insets = useSafeAreaInsets();
	const [taskName, setTaskName] = useState('');
	const [selectedPriority, setSelectedPriority] = useState('');
	const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
	const [selectedInterval, setSelectedInterval] = useState('');
	const [showIntervalDropdown, setShowIntervalDropdown] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	// AI Suggestions state
	const [showAISuggestions, setShowAISuggestions] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [aiSuggestions, setAiSuggestions] = useState<AITaskSuggestion[]>([]);
	const [creatingTaskFromSuggestion, setCreatingTaskFromSuggestion] = useState<
		string | null
	>(null);
	const [usedAITasks, setUsedAITasks] = useState<string[]>([]);
	const [inputText, setInputText] = useState('');

	const inputRef = useRef<RNTextInput | null>(null);
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				inputRef.current?.blur();
			}
		);
		return () => {
			keyboardDidHideListener?.remove();
		};
	}, []);

	const handlePrioritySelect = (priority: string) => {
		setSelectedPriority(priority);
		setShowPriorityDropdown(false);
	};

	const handleIntervalSelect = (interval: string) => {
		setSelectedInterval(interval);
		setShowIntervalDropdown(false);
	};

	const {mutate: createMutation, isPending} = useMutation({
		mutationFn: createGoal,
		onSuccess: async response => {
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Task created successfully',
			});
			setCreatingTaskFromSuggestion(null);
			if (!showAISuggestions) {
				router.back();
			}
			queryClient.invalidateQueries({queryKey: ['roadmap']});
			queryClient.invalidateQueries({queryKey: ['today_goals']});
			queryClient.invalidateQueries({queryKey: ['weekly_goals']});
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data.message
					: 'Failed to create task',
			});
			setCreatingTaskFromSuggestion(null);
		},
	});

	const {mutate: createEvoMutation, isPending: isCreatingEvo} = useMutation({
		mutationFn: createGoalEvo,
		onSuccess: async response => {
			// Show AI suggestions instead of going back
			setAiSuggestions(response.data);
			setShowAISuggestions(true);
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data.message
					: 'Failed to generate suggestions',
			});
		},
	});

	const handleCreateGoal = () => {
		if (!taskName.trim()) {
			return;
		}
		createMutation({
			task: taskName,
			priority: selectedPriority,
			due_date: selectedDate.toISOString(),
			recurring_interval: selectedInterval,
			recurring_interval_value: 1,
		});
	};

	const handleCreateFromSuggestion = (suggestion: AITaskSuggestion) => {
		setCreatingTaskFromSuggestion(suggestion.title);
		setUsedAITasks(prev => [...prev, suggestion.title]);
		createMutation({
			task: suggestion.title,
			priority: 'medium', // Default priority for AI suggestions
			due_date: new Date().toISOString(), // Today's date
			recurring_interval: 'daily', // Default to daily as requested
			recurring_interval_value: 1,
		});
	};

	const closeSuggestions = () => {
		setShowAISuggestions(false);
		usedAITasks.length && router.back();
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

	const sendMessage = () => {
		createEvoMutation({context: inputText});
		setShowModal(false);
		setInputText('');
		if (scrollViewRef.current) {
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({animated: true});
			}, 100);
		}
	};

	const selectedPriorityData = priorityOptions.find(
		p => p.id === selectedPriority
	);
	const selectedIntervalData = intervalOptions.find(
		i => i.id === selectedInterval
	);

	const aiContextModal = () => (
		<Modal
			visible={showModal}
			transparent={true}
			animationType="slide"
			onRequestClose={() => setShowModal(false)}
			statusBarTranslucent
		>
			<Pressable
				onPress={() => {
					setShowModal(false);
					Keyboard.dismiss();
				}}
				className="flex-1 bg-black/80 h-screen w-screen z-10 absolute"
			/>
			<View
				className="flex-1 rounded-t-3xl overflow-hidden z-20"
				style={{paddingTop: 20, marginTop: SCREEN_HEIGHT * 0.4}}
			>
				<KeyboardAvoidingView
					className="flex-1 rounded-t-3xl overflow-hidden z-20"
					style={{paddingTop: 20, marginTop: SCREEN_HEIGHT * 0.4}}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
				>
					<Image
						source={require('../../assets/images/onboarding_bg.jpg')}
						style={styles.bgImage}
					/>
					<View
						className="bg-[rgba(12, 49, 168, 0.5)] flex-1 rounded-t-3xl overflow-hidden"
						style={{backgroundColor: 'rgba(12, 49, 168, 0.1)'}}
					>
						<View className="flex-row justify-center items-center ">
							<View className="px-16 my-5 border-b-8 border-gray-700 rounded-full"></View>
						</View>
						<ScrollView
							ref={scrollViewRef}
							showsVerticalScrollIndicator={false}
							className="flex-1 pt-6"
							contentContainerStyle={{paddingBottom: 20}}
						>
							<View className="flex-row items-start mb-4 px-4">
								<View className="rounded-full p-2 mr-1">
									<Image
										source={require('../../assets/images/evoIcon.png')}
										style={{width: 30, height: 30}}
									/>
								</View>
								<View className="flex-1 flex-row py-2">
									<View
										className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]"
										style={{backgroundColor: 'rgba(0, 66, 86, 0.32)'}}
									>
										<Text className="text-white font-inter-semibold text-base leading-5">
											Hello, please describe the task I should set
										</Text>
									</View>
								</View>
							</View>
						</ScrollView>
						<View
							className="px-4 pb-0 flex-row items-center"
							style={{paddingBottom: insets.bottom + 30}}
						>
							<RNTextInput
								value={inputText}
								onChangeText={setInputText}
								placeholder="What kind of task do you want to create?"
								placeholderTextColor="#9CA3AF"
								className="flex-1 text-white font-inter-regular text-base bg-[#192024] rounded-2xl px-4 py-5 border border-white"
								multiline
								maxLength={500}
								onSubmitEditing={sendMessage}
								returnKeyType="send"
								ref={inputRef}
							/>
							<TouchableOpacity
								onPress={sendMessage}
								className="ml-3"
								disabled={inputText.trim() === ''}
							>
								<SendIcon />
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);

	// AI Suggestions Modal
	const renderAISuggestions = () => (
		<Modal
			visible={showAISuggestions}
			transparent={true}
			animationType="slide"
			onRequestClose={closeSuggestions}
		>
			<View className="flex-1 bg-black/50">
				<View
					className="flex-1 rounded-t-3xl overflow-hidden"
					style={{paddingTop: 20, marginTop: SCREEN_HEIGHT * 0.1}}
				>
					<Image
						source={require('../../assets/images/onboarding_bg.jpg')}
						style={styles.bgImage}
					/>
					{/* Header */}
					<View className="px-6 py-4 border-b border-gray-700">
						<View className="flex-row justify-between items-center">
							<Text className="text-white font-sora-semibold text-xl">
								Evo Task Suggestions
							</Text>
							<TouchableOpacity onPress={closeSuggestions}>
								<Text className="text-white font-inter-semibold text-xl">
									Done
								</Text>
							</TouchableOpacity>
						</View>
						<Text className="text-gray-400 font-inter-regular text-sm mt-2">
							Choose tasks to add to your daily routine
						</Text>
					</View>

					{/* Suggestions List */}
					<ScrollView
						className="flex-1 px-6"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingBottom: insets.bottom + 20,
							paddingTop: 20,
						}}
					>
						{aiSuggestions.map((suggestion, index) => (
							<View
								key={index}
								className="mb-4 bg-gray-900 rounded-2xl p-5 border border-gray-700"
							>
								<Text className="text-white font-inter-semibold text-lg mb-3">
									{suggestion.title}
								</Text>
								<Text className="text-gray-300 font-inter-regular text-sm mb-4 leading-5">
									{suggestion.description}
								</Text>

								{/* Task Details */}
								<View className="flex-row items-center gap-4 mb-4">
									<View className="flex-row items-center gap-2">
										<View className="w-2 h-2 bg-orange-500 rounded-full" />
										<Text className="text-gray-400 text-xs font-inter-medium">
											Medium Priority
										</Text>
									</View>
									<View className="flex-row items-center gap-2">
										<View className="w-2 h-2 bg-blue-500 rounded-full" />
										<Text className="text-gray-400 text-xs font-inter-medium">
											Daily Interval
										</Text>
									</View>
								</View>

								{/* Use Button */}
								<AppButton
									onPress={() => handleCreateFromSuggestion(suggestion)}
									buttonText={
										usedAITasks.includes(suggestion.title)
											? 'Created'
											: 'Use This Task'
									}
									loading={creatingTaskFromSuggestion === suggestion.title}
									disabled={
										!!creatingTaskFromSuggestion ||
										usedAITasks.includes(suggestion.title)
									}
									style={{
										paddingVertical: 12,
									}}
								/>
							</View>
						))}
					</ScrollView>
				</View>
			</View>
		</Modal>
	);

	return (
		<View style={styles.container}>
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			<Header showBack showProgress title="Create a task" />

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
								padding: 16,
								color: '#FFFFFF',
								fontSize: 16,
								fontFamily: 'Inter-Regular',
							}}
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
						{showPriorityDropdown && (
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
											<Foundation name="flag" size={24} color={option.color} />
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
					<View>
						<LinearGradient
							colors={['#00CCFF', '#1520A6']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0.4}}
							style={{borderRadius: 14, padding: 1}}
						>
							<TouchableOpacity
								onPress={() => setShowIntervalDropdown(!showIntervalDropdown)}
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
				</View>
			</ScrollView>

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

			{/* AI Suggestions Modal */}
			{renderAISuggestions()}
			{aiContextModal()}

			{/* Bottom Section */}
			<View
				className="px-[5%] pb-8"
				style={{paddingBottom: insets.bottom + 32}}
			>
				{/* Use Evo Assistant Button */}
				<TouchableOpacity
					onPress={() => setShowModal(true)}
					className="absolute right-[5%] gap-3"
					style={{
						shadowColor: '#3B82F6',
						shadowOffset: {width: 0, height: 4},
						shadowOpacity: 0.3,
						shadowRadius: 8,
						elevation: 8,
						bottom: insets.bottom + 150,
					}}
					disabled={isCreatingEvo}
				>
					<LinearGradient
						colors={['#00CCFF', '#1520A6']}
						start={{x: 0, y: 0}}
						end={{x: 1, y: 0.4}}
						style={{paddingHorizontal: 18, paddingBottom: 10, borderRadius: 10}}
					>
						<Image
							source={require('../../assets/images/evoIcon.png')}
							style={{width: 50, height: 50}}
						/>
					</LinearGradient>
					<LinearGradient
						colors={['#00CCFF', '#1520A6']}
						start={{x: 0, y: 0}}
						end={{x: 1, y: 0.4}}
						style={{borderRadius: 20}}
					>
						<Text className="text-white font-inter-bold text-base text-center px-3 py-1">
							{isCreatingEvo ? 'Generating...' : 'Use Evo'}
						</Text>
					</LinearGradient>
				</TouchableOpacity>

				{/* Create Goal Button */}
				<AppButton
					onPress={handleCreateGoal}
					disabled={
						!taskName.trim() ||
						!selectedPriority ||
						!selectedInterval ||
						isPending
					}
					buttonText="Create goal"
					loading={isPending}
				/>
			</View>
		</View>
	);
};

export default Create;

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
