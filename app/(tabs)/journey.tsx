// Types for API responses
import RadioIcon from '@/assets/icons/radio';
import RadioActiveIcon from '@/assets/icons/radio-active';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {completeGoal, getTodayGoal, getWeeklyGoals} from '@/services/apis/goal';
import {FontAwesome6} from '@expo/vector-icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {Image, ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WeekStrip from '../auth/components/WeekStrip';
import Header from './components/Header';

const Journey = () => {
	const insets = useSafeAreaInsets();
	const [selectedTab, setSelectedTab] = useState('Today schedule');
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [refreshing, setRefreshing] = useState(false);
	const queryClient = useQueryClient();
	// const [selectedTask, setSelectedTask] = useState(null);

	const {data: todayTasks} = useQuery({
		queryKey: ['today_goals'],
		queryFn: getTodayGoal,
	});
	const {data: weeklyTasks} = useQuery({
		queryKey: ['weekly_goals'],
		queryFn: getWeeklyGoals,
	});

	const tasks: Task[] =
		selectedTab === 'Today schedule'
			? todayTasks?.data.map(g => ({
					id: g.id,
					time: g.attributes.due_date,
					type: g.attributes.status,
					category: g.attributes.priority,
					title: g.attributes.task,
					completed: g.attributes.status === 'completed',
				})) || []
			: selectedTab === 'Weekly goal'
				? weeklyTasks?.data.map(g => ({
						id: g.id,
						time: g.attributes.target_completion_date,
						type: g.attributes.status,
						category: g.attributes.priority,
						title: g.attributes.title,
						completed: g.attributes.status === 'completed',
					})) || []
				: [];

	const stats = {
		todayGoals: todayTasks?.data.length || 0,
		todayCompleted: 0,
		totalGoals: weeklyTasks?.data.length || 0,
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({queryKey: ['today_goals']});
		await queryClient.invalidateQueries({queryKey: ['weekly_goals']});
		await queryClient.invalidateQueries({queryKey: ['roadmap']});
		queryClient.invalidateQueries({queryKey: ['roadmap-stats']});
		queryClient.invalidateQueries({queryKey: ['leaderboard']});
		setRefreshing(false);
	};

	return (
		<View className="flex-1 bg-background">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<Header showProgress title="Schedule" />

			<View className="px-[5%] py-5 ">
				{/* Stats Cards */}
				<View className="flex-row gap-3">
					<View className="flex-1">
						<LinearGradient
							colors={['#00CCFF', '#1520A6']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0.4}}
							style={[styles.statsCardGradient, {flex: 1}]}
						>
							<View className="p-4" style={[styles.statsCard, {flex: 1}]}>
								<Text className="text-white font-sora-semibold text-sm mb-1">
									Today goals
								</Text>
								<Text className="text-white text-2xl">{stats.todayGoals}</Text>
							</View>
						</LinearGradient>
					</View>
					<View className="flex-1">
						<LinearGradient
							colors={['#00CCFF', '#1520A6']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0.4}}
							style={styles.statsCardGradient}
						>
							<View className=" p-4" style={styles.statsCard}>
								<Text className="text-white font-inter-semibold text-sm mb-1">
									Today Completed Goals
								</Text>
								<Text className="text-white font-inter-bold text-2xl">
									{stats.todayCompleted}
								</Text>
							</View>
						</LinearGradient>
					</View>
					<View className="flex-1">
						<LinearGradient
							colors={['#00CCFF', '#1520A6']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0.4}}
							style={[styles.statsCardGradient, {flex: 1}]}
						>
							<View className="p-4" style={[styles.statsCard, {flex: 1}]}>
								<Text className="text-white font-inter-regular text-sm mb-1">
									Total Weekly Goals
								</Text>
								<Text className="text-white font-inter-bold text-2xl">
									{stats.totalGoals}
								</Text>
							</View>
						</LinearGradient>
					</View>
				</View>

				{/* Calendar */}

				<WeekStrip
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
			</View>

			{/* Tabs and Content */}
			<View className="flex-1 px-[5%]">
				{/* Tab Selector */}
				<View className="flex-row bg-gray-900/30 rounded-xl p-1 mb-5">
					{['Today schedule', 'Weekly goal', 'Monthly goal'].map(tab => (
						<TouchableOpacity
							key={tab}
							onPress={() => setSelectedTab(tab)}
							className={`flex-1 py-3 rounded-lg mx-5`}
						>
							<Text
								className={`font-inter-medium text-sm ${
									selectedTab === tab ? 'text-white' : 'text-gray-400'
								}`}
							>
								{tab}
							</Text>
							{selectedTab === tab && (
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={{
										height: 5,
										marginTop: 5,
										width: '60%',
										borderRadius: 10,
									}}
								/>
							)}
						</TouchableOpacity>
					))}
				</View>

				{/* Tasks List */}
				<ScrollView
					showsVerticalScrollIndicator={false}
					className="flex-1"
					contentContainerStyle={{paddingBottom: 100 + insets.bottom}}
					refreshControl={
						<RefreshControl
							onRefresh={handleRefresh}
							refreshing={refreshing}
							colors={[Colors.secondary]}
						/>
					}
				>
					{tasks.map(task => (
						<RenderTask key={task.id} task={task} />
					))}
				</ScrollView>

				{/* Floating Action Button */}
				<TouchableOpacity
					className="w-16 h-16 bg-white rounded-full items-center justify-center ml-auto"
					style={{
						shadowColor: '#000',
						shadowOffset: {width: 0, height: 4},
						shadowOpacity: 0.3,
						shadowRadius: 8,
						elevation: 8,
						bottom: insets.bottom + 100,
					}}
					onPress={() => router.push('/goal/create')}
				>
					<FontAwesome6 name="plus" size={40} color="#00CCFF" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Journey;

const RenderTask = ({task}: {task: Task}) => {
	const queryClient = useQueryClient();

	const {mutate: completeTaskMutate, isPending: isCompleting} = useMutation({
		mutationFn: completeGoal,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['today_goals']});
			queryClient.invalidateQueries({queryKey: ['weekly_goals']});
			queryClient.invalidateQueries({queryKey: ['goal', task.id]});
			queryClient.invalidateQueries({queryKey: ['roadmap']});
			queryClient.invalidateQueries({queryKey: ['roadmap-stats']});
			queryClient.invalidateQueries({queryKey: ['leaderboard']});
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Goal completed successfully.',
			});
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

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'urgent':
				return '#EF4444';
			case 'high':
				return '#8B5CF6';
			case 'medium':
				return '#3B82F6';
			case 'low':
				return '#10B981';
			default:
				return '#6B7280';
		}
	};

	return (
		<TouchableOpacity
			key={task.id}
			className="bg-[#2E0E4B] rounded-2xl mb-3 overflow-hidden"
			onPress={() => router.push(`/goal/view?id=${task.id}`)}
		>
			<ImageBackground
				source={require('../../assets/images/noise-bg-purple.png')}
			>
				<View className="flex-row items-center justify-between p-4 rounded-2xl">
					<View className="flex-1">
						<View className="flex-row items-center gap-3 mb-2">
							<Text className="text-white font-inter-medium text-sm">
								{task.time}
							</Text>
							<View
								className="px-2 py-1 rounded"
								style={{
									backgroundColor: getCategoryColor(task.category) + '20',
								}}
							>
								<Text
									className="font-inter-medium text-xs"
									style={{color: getCategoryColor(task.category)}}
								>
									{task.type}
								</Text>
							</View>
							<Text
								className="font-inter-medium text-xs"
								style={{color: getCategoryColor(task.category)}}
							>
								{task.category}
							</Text>
						</View>
						<Text className="text-white font-inter-medium text-base">
							{task.title}
						</Text>
					</View>
					<View className="ml-4">
						{isCompleting ? (
							<ActivityIndicator size="small" color="#E8D5F9" />
						) : task.completed ? (
							<RadioActiveIcon />
						) : (
							<TouchableOpacity onPress={() => completeTaskMutate(task.id)}>
								<RadioIcon />
							</TouchableOpacity>
						)}
					</View>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
		backgroundColor: '#000000',
	},
	wrapper: {
		flex: 1,
	},
	mainContent: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
	statsCardGradient: {
		borderRadius: 20,
		overflow: 'hidden',
		padding: 0.5,
	},
	statsCard: {
		backgroundColor: '#2D2D2D',
		borderRadius: 20,
	},
});

interface Task {
	id: number;
	time: string;
	type: 'pending' | 'in_progress' | 'completed';
	category: 'high' | 'medium' | 'low';
	title: string;
	completed: boolean;
}
