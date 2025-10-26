import CupIcon from '@/assets/icons/cup';
import DartIcon from '@/assets/icons/dart';
import FireIcon from '@/assets/icons/fire-dashboard';
import MentorIcon from '@/assets/icons/mentor';
import {ACCESS_TOKEN_KEY, HAS_ONBOARDED, HAS_OPENED_EVO} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {getTodayGoal} from '@/services/apis/goal';
import {fetchLeaderboard} from '@/services/apis/leaderboard';
import {getRoadMap} from '@/services/apis/roadmap';
import {MemoryStorage} from '@/utils/storage';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from './(tabs)/components/Header';
import WeekStrip from './auth/components/WeekStrip';
import MainContainer from './components/MainContainer';
import AppButton from './components/ui/button';

const Dashboard = () => {
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const {user} = useGlobalStore();

	const {data: leaderboard} = useQuery({
		queryKey: ['leaderboard'],
		queryFn: fetchLeaderboard,
	});

	const {data: todayTasks} = useQuery({
		queryKey: ['today_goals'],
		queryFn: getTodayGoal,
	});

	const {data: roadmap} = useQuery({
		queryKey: ['roadmap'],
		queryFn: getRoadMap,
		gcTime: Infinity,
	});

	const sortedUsers =
		leaderboard?.data?.sort(
			(a, b) => b.attributes.ev_score - a.attributes.ev_score
		) || [];

	const leaderboardPosition = sortedUsers.findIndex(u => u.id === user?.id) + 1;

	const steps = roadmap?.data || [];

	// Calculate completed steps
	const completedSteps = steps.filter(
		step => step.status === 'completed'
	).length;

	const pendingTasks = todayTasks?.data.filter(
		g => g.attributes.status !== 'completed'
	);

	const handleLogout = async () => {
		const storage = new MemoryStorage();
		storage.removeItem(ACCESS_TOKEN_KEY);
		storage.removeItem(HAS_ONBOARDED);
		storage.removeItem(HAS_OPENED_EVO);
		router.dismissAll();
		router.replace('/auth/login');
		queryClient.clear();
	};

	const handleConfirmLogout = () => {
		Alert.alert('Log Out', 'Are you sure you want to log out?', [
			{text: 'Cancel', style: 'cancel'},
			{
				text: 'Log Out',
				style: 'destructive',
				onPress: handleLogout,
			},
		]);
	};

	return (
		<View className="flex-1">
			<Header title="Dashboard" showBack />

			<MainContainer>
				<ScrollView className="flex-1 px-[5%]">
					{/* <StreakAvatarIcon /> */}
					<View className="w-full">
						<WeekStrip />

						<View className="flex-row mt-10 gap-4">
							<View className="flex-1 h-[100px]">
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={styles.statsCardGradient}
								>
									<View style={styles.statsCard}>
										<Text className="text-white font-inter-semibold text-sm">
											Total goal completed
										</Text>

										<View className="mt-2 flex-row justify-between items-center">
											<Text className="text-white text-4xl font-inter-semibold">
												{completedSteps?.toLocaleString()}
											</Text>

											<DartIcon />
										</View>
									</View>
								</LinearGradient>
							</View>
							<View className="flex-1 h-[100px]">
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={styles.statsCardGradient}
								>
									<View style={styles.statsCard}>
										<Text className="text-white font-inter-semibold text-sm">
											Total pending goals
										</Text>

										<View className="mt-2 flex-row justify-between items-center">
											<Text className="text-white text-4xl font-inter-semibold">
												{pendingTasks?.length?.toLocaleString()}
											</Text>

											<DartIcon />
										</View>
									</View>
								</LinearGradient>
							</View>
						</View>
						<View className="flex-row mt-10 gap-4">
							<View className="flex-1 h-[100px]">
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={styles.statsCardGradient}
								>
									<View style={styles.statsCard}>
										<Text className="text-white font-inter-semibold text-sm">
											Total mentors
										</Text>

										<View className="mt-2 flex-row justify-between items-center">
											<Text className="text-white text-4xl font-inter-semibold">
												0
											</Text>

											<MentorIcon />
										</View>
									</View>
								</LinearGradient>
							</View>
							<View className="flex-1 h-[100px]">
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={styles.statsCardGradient}
								>
									<View style={styles.statsCard}>
										<Text className="text-white font-inter-semibold text-sm">
											Total streaks
										</Text>

										<View className="mt-2 flex-row justify-between items-center">
											<Text className="text-white text-4xl font-inter-semibold">
												{user?.streak_count?.toLocaleString()}
											</Text>

											<FireIcon />
										</View>
									</View>
								</LinearGradient>
							</View>
						</View>
						<View className="flex-row mt-10 gap-4">
							<View className="flex-1 h-[100px]">
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={styles.statsCardGradient}
								>
									<View style={styles.statsCard}>
										<Text className="text-white font-inter-semibold text-sm">
											Evo Score
										</Text>

										<View className="mt-2 flex-row justify-between items-center">
											<Text className="text-white text-4xl font-inter-semibold">
												{user?.ev_score?.toLocaleString()}
											</Text>
											<Image
												source={require('../assets/images/evoIcon.png')}
												style={{width: 50, height: 50}}
											/>
										</View>
									</View>
								</LinearGradient>
							</View>
							<View className="flex-1 h-[100px]">
								<LinearGradient
									colors={['#00CCFF', '#1520A6']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0.4}}
									style={styles.statsCardGradient}
								>
									<View style={styles.statsCard}>
										<Text className="text-white font-inter-semibold text-sm">
											Leaderboard
										</Text>

										<View className="mt-2 flex-row justify-between items-center">
											<Text className="text-white text-4xl font-inter-semibold">
												{leaderboardPosition?.toLocaleString()}
											</Text>

											<CupIcon />
										</View>
									</View>
								</LinearGradient>
							</View>
						</View>
					</View>
				</ScrollView>
				<AppButton
					onPress={handleConfirmLogout}
					style={{marginBottom: insets.bottom + 30, marginHorizontal: '5%'}}
					buttonText="Log out"
				/>
			</MainContainer>
		</View>
	);
};

export default Dashboard;

const styles = StyleSheet.create({
	statsCardGradient: {
		borderRadius: 20,
		overflow: 'hidden',
		padding: 0.5,
		flex: 1,
		height: 150,
	},
	statsCard: {
		backgroundColor: '#003646',
		borderRadius: 20,
		flex: 1,
		padding: 15,
	},
});
