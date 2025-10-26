import ProfilePicture from '@/app/components/ProfilePicture';
import Back from '@/app/components/ui/back';
import EVIcon from '@/assets/icons/ev';
import FireIcon from '@/assets/icons/fire';
import {STREAK_COUNT} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {getTodayGoal} from '@/services/apis/goal';
import {fetchLeaderboard} from '@/services/apis/leaderboard';
import {getRoadMapStats} from '@/services/apis/roadmap';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {useEffect} from 'react';
import {
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderProps {
	showLeaderboard?: boolean;
	showProgress?: boolean;
	showProfile?: boolean;
	showBack?: boolean;
	title?: string;
	hideRightElements?: boolean;
	onBackPress?: () => void;
}
const Header = ({
	showLeaderboard,
	showProgress,
	showProfile,
	showBack,
	hideRightElements,
	title,
	onBackPress,
}: HeaderProps) => {
	const insets = useSafeAreaInsets();

	const {user, setShowStreakModal} = useGlobalStore();

	const {data} = useQuery({
		queryKey: ['leaderboard'],
		queryFn: fetchLeaderboard,
	});

	const {data: roadmapStats} = useQuery({
		queryKey: ['roadmap-stats'],
		queryFn: getRoadMapStats,
	});

	const {data: todayTasks} = useQuery({
		queryKey: ['today_goals'],
		queryFn: getTodayGoal,
	});

	const progress = roadmapStats?.data.completion_rate || 0;

	const activities =
		todayTasks?.data.map(g => ({
			id: g.id.toString(),
			title: g.attributes.task,
			completed: g.attributes.status === 'completed',
		})) || [];

	const currentMonth = dayjs().month();
	const currentDate = dayjs().date();

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const toOrdinal = (n: number): string =>
		n + (n > 3 && n < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');

	const sortedUsers =
		data?.data?.sort((a, b) => b.attributes.ev_score - a.attributes.ev_score) ||
		[];

	const leaderboardPosition = sortedUsers.findIndex(u => u.id === user?.id) + 1;

	useEffect(() => {
		if (!user) return;
		AsyncStorage.getItem(STREAK_COUNT).then(value => {
			if (value !== user?.streak_count.toString()) {
				setShowStreakModal(true);
			}
		});
	}, [setShowStreakModal, user]);

	return (
		<ImageBackground source={require('../../../assets/images/noise-bg.png')}>
			<View
				className="px-[5%] pb-5 gap-5"
				style={{paddingTop: insets.top + 10}}
			>
				<View className="flex-row flex-wrap justify-between items-center gap-2">
					<View className="flex-row items-center gap-x-2 mr-auto">
						{showBack && <Back size={30} onPress={onBackPress} />}
						{showProfile && (
							<View className="flex-row items-center gap-2">
								<ProfilePicture />
								<Text className="text-white font-sora-semibold">
									Welcome {user?.fullname.split(' ')[0]}
								</Text>
							</View>
						)}
						{title && (
							<Text className="text-white font-sora-semibold text-lg">
								{title}
							</Text>
						)}
					</View>
					{!hideRightElements && (
						<View className="flex-row gap-x-3 ml-auto">
							<View className="bg-secondary px-4 py-2 rounded-full flex-row items-center gap-2">
								<Text className="text-white font-inter-bold text-xs">
									{user?.ev_score.toLocaleString()} EV
								</Text>
								<EVIcon />
							</View>
							<View className="bg-secondary px-4 py-2 rounded-full flex-row items-center gap-2">
								<Text className="text-white font-inter-bold text-xs">
									{user?.streak_count?.toLocaleString()} day
									{user?.streak_count === 1 ? '' : 's'} streak
								</Text>
								<FireIcon />
							</View>
							{showProfile && (
								<Pressable onPress={() => router.push('/notifications')}>
									<Ionicons
										name="notifications-outline"
										size={24}
										color="white"
									/>
								</Pressable>
							)}
						</View>
					)}
				</View>
				{showLeaderboard && (
					<View className="flex-row gap-4">
						{/* Activities Section */}
						<View
							className="flex-row flex-1 rounded-2xl h-28"
							style={{backgroundColor: 'rgba(217, 217, 217, 0.3)'}}
						>
							<View className="flex-1 px-4 py-3">
								<Text className="text-white font-inter-medium text-sm mb-3 opacity-80">
									{monthNames[currentMonth]} {toOrdinal(currentDate)} activity
								</Text>
								<ScrollView
									showsVerticalScrollIndicator={false}
									className="max-h-20"
								>
									{activities.map((activity, index) => (
										<View key={activity.id} className="mb-2">
											<Text className="text-white font-inter-regular text-sm leading-5">
												{activity.title}
											</Text>
										</View>
									))}
								</ScrollView>
							</View>

							{/* Leaderboard Position */}

							<TouchableOpacity
								onPress={() => router.push('/leaderboard')}
								className="w-24 h-full rounded-2xl justify-center items-center overflow-hidden"
							>
								<LinearGradient
									colors={['#00CCFF', '#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={[
										{
											flex: 1,
											height: '100%',
											width: '100%',
											borderRadius: 12,
											justifyContent: 'center',
											alignItems: 'center',
										},
									]}
								>
									<View className="flex-row items-center">
										{/* Trophy Icon */}
										<Text className="text-white text-5xl">🏆</Text>
										<Text className="text-white font-sora-semibold text-5xl">
											{leaderboardPosition}
										</Text>
									</View>
									<Text className="text-white font-sora-semibold text-sm mt-2">
										Leaderboard
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{/* Progress Bar */}
				{showProgress && (
					<View className="bg-[#0B0F1C] h-6 w-full rounded-full overflow-hidden justify-center">
						<View
							className="bg-secondary h-full absolute rounded-full"
							style={{width: `${progress}%`}}
						/>
						<Text className="text-white font-inter-semibold ml-3 text-sm">
							{progress}%
						</Text>
					</View>
				)}
			</View>
		</ImageBackground>
	);
};

export default Header;
