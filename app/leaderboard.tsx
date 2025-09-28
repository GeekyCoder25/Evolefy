import CrownLeaderboardIcon from '@/assets/icons/crown-leaderboard';
import EVIcon from '@/assets/icons/ev';
import FireIcon from '@/assets/icons/fire';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {fetchLeaderboard, LeaderboardUser} from '@/services/apis/leaderboard';
import {getUserProfile} from '@/services/apis/user';
import {useQuery} from '@tanstack/react-query';
import {Image, ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Back from './components/ui/back';

// Types for the API response

const Leaderboard = () => {
	const insets = useSafeAreaInsets();
	// const {user} = useGlobalStore();

	const {data, error} = useQuery({
		queryKey: ['leaderboard'],
		queryFn: fetchLeaderboard,
	});

	const {data: user} = useQuery({
		queryKey: ['user'],
		queryFn: getUserProfile,
	});

	// Sort users by EV score in descending order
	const sortedUsers =
		data?.data?.sort((a, b) => b.attributes.ev_score - a.attributes.ev_score) ||
		[];

	// Get top 3 for podium
	const topThree = sortedUsers.slice(0, 3);
	const restOfUsers = sortedUsers.slice(3);

	// Find current user's position
	// const currentUserPosition =
	// 	sortedUsers.findIndex(u => u.id === user?.data?.id) + 1;

	const getPositionChange = () => {
		// This would typically come from comparing with previous data
		// For now, returning random changes for demo
		const changes = ['▲', '▼', ''];
		return changes[Math.floor(Math.random() * changes.length)];
	};

	const renderPodiumUser = (leaderboard: LeaderboardUser, position: number) => {
		const isFirst = position === 1;
		const isSecond = position === 2;

		return (
			<View
				key={leaderboard.id}
				className={`items-center ${isFirst ? 'order-2' : isSecond ? 'order-1' : 'order-3'}`}
			>
				<View
					className={`relative  mb-2`}
					style={{
						width: isFirst ? SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.2,
						height: isFirst ? SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.2,
					}}
				>
					{/* Profile Picture Container */}
					<View
						className={` rounded-full bg-gray-600 border-2 ${isFirst ? 'border-yellow-400' : isSecond ? 'border-gray-300' : 'border-orange-400'} overflow-hidden`}
						style={{
							width: isFirst ? SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.2,
							height: isFirst ? SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.2,
						}}
					>
						{leaderboard.attributes.profile_picture ? (
							<Image
								source={{uri: leaderboard.attributes.profile_picture}}
								style={{
									width: isFirst ? SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.2,
									height: isFirst ? SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.2,
								}}
							/>
						) : (
							<View className="w-full h-full bg-gray-500 items-center justify-center">
								<Text className="text-white font-inter-bold text-2xl">
									{leaderboard.attributes.fullname.charAt(0)}
								</Text>
							</View>
						)}
					</View>

					{/* Crown for first place */}
					{isFirst && (
						<View
							className="absolute  left-1/2 transform -translate-x-1/2"
							style={{top: -30}}
						>
							<CrownLeaderboardIcon />
						</View>
					)}

					{/* Position indicator */}
					<View
						className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${isFirst ? 'bg-yellow-500' : isSecond ? 'bg-gray-400' : 'bg-orange-500'} items-center justify-center`}
					>
						<Text className="text-white font-bold text-xs">{position}</Text>
					</View>
				</View>

				<Text className="text-white font-inter-medium text-sm text-center mb-1">
					{leaderboard.id === user?.data.id
						? 'You'
						: leaderboard.attributes.fullname.split(' ')[0]}
				</Text>
				<Text className="text-gray-400 font-inter-regular text-xs">
					{leaderboard.attributes.ev_score} EV
				</Text>
			</View>
		);
	};

	const renderLeaderboardItem = (
		leaderboardUser: LeaderboardUser,
		position: number
	) => {
		const isCurrentUser = leaderboardUser.id === user?.data?.id;
		const change = getPositionChange();

		return (
			<View
				key={leaderboardUser.id}
				className={`mx-[5%] my-3 rounded-3xl overflow-hidden`}
			>
				<LinearGradient
					colors={
						isCurrentUser
							? ['#00CCFF', '#1520A6']
							: ['transparent', 'transparent']
					}
					start={{x: 0, y: 0}}
					end={{x: 1, y: 0.4}}
				>
					<View
						className={`flex-row items-center justify-between pl-[1px] pr-4`}
					>
						<View className="flex-row items-center gap-3">
							<View className="w-12 h-12 rounded-full bg-gray-600 border border-[#006842] overflow-hidden">
								{leaderboardUser.attributes.profile_picture ? (
									<Image
										source={{uri: leaderboardUser.attributes.profile_picture}}
										className="w-full h-full"
										style={{
											width: 48,
											height: 48,
										}}
									/>
								) : (
									<View className="w-full h-full bg-gray-500 items-center justify-center">
										<Text className="text-white font-bold">
											{leaderboardUser.attributes.fullname.charAt(0)}
										</Text>
									</View>
								)}
							</View>
							<View>
								<Text className="text-white font-inter-semibold text-lg">
									{leaderboardUser.attributes.fullname}
								</Text>
								{/* <Text className="text-gray-400 font-inter-regular text-sm">
									{leaderboardUser.attributes.ev_score} EV •{' '}
									{leaderboardUser.attributes.streak_count} day streak
								</Text> */}
							</View>
						</View>

						<View className="flex-row items-center gap-2">
							<Text className="text-white font-inter-bold text-lg">
								{position}
							</Text>
							{change && (
								<Text
									className={`text-sm ${change === '▲' ? 'text-green-400' : change === '▼' ? 'text-red-400' : 'text-gray-400'}`}
								>
									{change}
								</Text>
							)}
						</View>
					</View>
				</LinearGradient>
			</View>
		);
	};

	// if (isLoading) {
	// 	return (
	// 		<View style={styles.container}>
	// 			<Image
	// 				source={require('../assets/images/onboarding_bg.jpg')}
	// 				style={styles.bgImage}
	// 			/>
	// 			<View className="flex-1 items-center justify-center">
	// 				<Text className="text-white font-inter-medium">
	// 					Loading leaderboard...
	// 				</Text>
	// 			</View>
	// 		</View>
	// 	);
	// }

	if (error) {
		return (
			<View style={styles.container}>
				<Image
					source={require('../assets/images/onboarding_bg.jpg')}
					style={styles.bgImage}
				/>
				<View className="flex-1 items-center justify-center">
					<Text className="text-red-400 font-inter-medium">
						Failed to load leaderboard
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			<ImageBackground source={require('../assets/images/noise-bg.png')}>
				<View className="px-[5%] pb-4" style={{paddingTop: insets.top + 10}}>
					<View className="flex-row justify-between items-center">
						<View className="flex-row items-center gap-1">
							<Back size={30} />
							<Text className="text-white font-sora-semibold text-lg ml-2">
								Leaderboard
							</Text>
						</View>
						<View className="flex-row gap-x-3">
							<View className="bg-secondary px-4 py-2 rounded-full flex-row items-center gap-2">
								<Text className="text-white font-inter-bold text-xs">
									{user?.data?.attributes.ev_score} EV
								</Text>
								<EVIcon />
							</View>
							<View className="bg-secondary px-4 py-2 rounded-full flex-row items-center gap-2">
								<Text className="text-white font-inter-bold text-xs">
									{user?.data?.attributes.streak_count} day
									{user?.data?.attributes.streak_count === 1 ? '' : 's'} streak
								</Text>
								<FireIcon />
							</View>
						</View>
					</View>
				</View>
			</ImageBackground>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{paddingBottom: insets.bottom + 100}}
			>
				{/* Podium Section */}
				{topThree.length >= 3 && (
					<ImageBackground source={require('../assets/images/winner.png')}>
						<View className="px-4 py-14">
							<View className="flex-row justify-center items-end gap-8 mb-8">
								{/* Second Place */}
								{renderPodiumUser(topThree[1], 2)}

								{/* First Place */}
								{renderPodiumUser(topThree[0], 1)}

								{/* Third Place */}
								{renderPodiumUser(topThree[2], 3)}
							</View>

							{/* Podium Base */}
							{/* <View className="flex-row justify-center items-end gap-8">
							<View className="w-16 h-8 bg-gray-400 rounded-t-lg" />
							<View className="w-20 h-12 bg-yellow-500 rounded-t-lg" />
							<View className="w-16 h-6 bg-orange-500 rounded-t-lg" />
						</View> */}
						</View>
					</ImageBackground>
				)}

				{/* Rest of the leaderboard */}
				<View className="mt-5">
					{restOfUsers.map((user, index) =>
						renderLeaderboardItem(user, index + 4)
					)}
				</View>

				{/* Current user position if not in top rankings */}
				{/* {currentUserPosition > 6 && (
					<View className="mx-4 mt-4">
						<Text className="text-gray-400 font-inter-regular text-center mb-2">
							Your current position
						</Text>
						{renderLeaderboardItem(
							sortedUsers.find(u => u.id === user?.data.id)!,
							currentUserPosition
						)}
					</View>
				)} */}
			</ScrollView>
		</View>
	);
};

export default Leaderboard;

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
	actionButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		minWidth: 80,
		alignItems: 'center',
	},
});
