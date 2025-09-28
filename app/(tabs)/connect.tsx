import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {
	Community,
	getCommunities,
	getCommunityMessages,
	getMyCommunities,
	joinCommunity,
} from '@/services/apis/community';
import {FontAwesome6} from '@expo/vector-icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Header from './components/Header';

const categoryColors: Record<string, string> = {};

const getRandomColor = () => {
	return `#${Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, '0')}`;
};

const getCategoryColor = (category: string) => {
	if (!categoryColors[category]) {
		categoryColors[category] = getRandomColor();
	}
	return categoryColors[category];
};

const Connect = () => {
	const insets = useSafeAreaInsets();
	const [selectedTab, setSelectedTab] = useState('My communities');
	const queryClient = useQueryClient();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const {data: communitiesData, isPending} = useQuery({
		queryKey: ['allCommunities'],
		queryFn: getCommunities,
	});
	const {data: communities, isPending: isPendingMyCommunities} = useQuery({
		queryKey: ['communities'],
		queryFn: getMyCommunities,
	});

	const allCommunities = communitiesData?.data.filter(
		community => !communities?.data.some(myComm => myComm.id === community.id)
	);

	// const renderMentorCard = (mentor: any) => (
	// 	<View key={mentor.id} className="mr-4 items-center">
	// 		<View className="relative mb-2">
	// 			<View className="w-20 h-20 rounded-2xl bg-gray-700 overflow-hidden">
	// 				{mentor.image ? (
	// 					<Image source={{uri: mentor.image}} className="w-full h-full" />
	// 				) : (
	// 					<View className="w-full h-full bg-gray-600 items-center justify-center">
	// 						<Text className="text-white font-bold text-lg">
	// 							{mentor.name.charAt(0)}
	// 						</Text>
	// 					</View>
	// 				)}
	// 			</View>
	// 			<View
	// 				className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
	// 				style={{backgroundColor: getCategoryColor(mentor.category)}}
	// 			>
	// 				<Text className="text-white text-xs font-bold">M</Text>
	// 			</View>
	// 		</View>
	// 		<Text className="text-white font-inter-medium text-sm text-center mb-1">
	// 			{mentor.name}
	// 		</Text>
	// 		<Text className="text-gray-400 font-inter-regular text-xs text-center">
	// 			{mentor.role}
	// 		</Text>
	// 	</View>
	// );

	const RenderCommunityCard = ({community}: {community: Community}) => {
		const joinMutation = useMutation({
			mutationFn: joinCommunity,
			onSuccess: () => {
				queryClient.invalidateQueries({queryKey: ['allCommunities']});
				queryClient.invalidateQueries({queryKey: ['communities']});
			},
			onError: error => {
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: isAxiosError(error)
						? error.response?.data?.message
						: 'Failed to join community.',
				});
			},
		});
		return (
			<View key={community.id} className="mr-4 items-center">
				<View className="relative mb-2">
					<View className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
						{community.attributes.cover_image ? (
							<Image
								source={{uri: community.attributes.cover_image}}
								className="w-full h-full"
							/>
						) : (
							<View
								className="w-full h-full items-center justify-center"
								style={{
									backgroundColor: getCategoryColor(
										community.attributes.category
									),
								}}
							>
								<Text className="text-white font-inter-bold text-2xl">
									{community.attributes.name.charAt(0)}
								</Text>
							</View>
						)}
					</View>
				</View>
				<Text className="text-white font-inter-medium text-sm text-center mb-1">
					{community.attributes.name}
				</Text>
				<Text className="text-gray-400 font-inter-regular text-xs text-center mb-2">
					{community.attributes.member_count}{' '}
					{community.attributes.member_count > 1 ? 'members' : 'member'}
				</Text>

				<TouchableOpacity
					className="bg-blue-600 px-4 py-1.5 rounded-lg"
					onPress={() => joinMutation.mutate(community.id)}
					disabled={joinMutation.isPending}
				>
					{joinMutation.isPending ? (
						<ActivityIndicator color={Colors.primary} />
					) : (
						<Text className="text-white font-inter-medium text-sm">Join</Text>
					)}
				</TouchableOpacity>
			</View>
		);
	};

	const RenderMyCommunityItem = ({community}: {community: Community}) => {
		const {data: messages} = useQuery({
			queryKey: ['community_' + community.id],
			queryFn: () => getCommunityMessages(community.id),
		});

		return (
			<TouchableOpacity
				key={community.id}
				className="flex-row items-center justify-between p-4 mx-[7%] mb-3 rounded-2xl bg-gray-800/30"
				onPress={() =>
					router.navigate({
						pathname: '/community/messages',
						params: {
							id: community.id,
							name: community.attributes.name,
							description: community.attributes.description,
							cover_image: community.attributes.cover_image,
							member_count: community.attributes.member_count,
						},
					})
				}
			>
				<View className="flex-row items-center gap-3 flex-1">
					<View className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
						{community.attributes.cover_image ? (
							<Image
								source={{uri: community.attributes.cover_image}}
								className="w-full h-full"
								style={{width: 100, height: 100, borderRadius: 100}}
							/>
						) : (
							<View
								className="w-full h-full items-center justify-center"
								style={{
									backgroundColor: getCategoryColor(
										community.attributes.category
									),
								}}
							>
								<Text className="text-white font-sora-bold text-2xl">
									{community.attributes.name.charAt(0)}
								</Text>
							</View>
						)}
					</View>
					<View className="flex-1">
						<View className="flex-row items-center justify-between mb-1">
							<Text className="text-white font-inter-medium text-base">
								{community.attributes.name}
							</Text>
							{/* {community.attributes.member_count > 0 && (
								<View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
									<Text className="text-white text-xs font-bold">
										{community.attributes.member_count}
									</Text>
								</View>
							)} */}
						</View>
						<Text className="text-gray-400 font-inter-regular text-sm">
							{community.attributes.member_count}{' '}
							{community.attributes.member_count > 1 ? 'members' : 'member'}
						</Text>
						<Text className="text-gray-300 font-inter-regular text-sm mt-1 truncate whitespace-nowrap">
							{messages
								? messages.data.length > 0
									? messages.data[messages.data.length - 1].attributes.message
									: community.attributes.description
								: ''}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<View className="flex-1 bg-background">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<Header showProfile />

			<FlatList
				data={communities?.data}
				keyExtractor={item => item.id.toString()}
				renderItem={({item}) => <RenderMyCommunityItem community={item} />}
				showsVerticalScrollIndicator={false}
				className="flex-1"
				style={{paddingBottom: insets.bottom + 100}}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={async () => {
							setIsRefreshing(true);
							await queryClient.invalidateQueries({queryKey: ['communities']});
							setIsRefreshing(false);
						}}
						colors={[Colors.primary]}
					/>
				}
				ListHeaderComponent={
					<View className="py-5">
						{/*
					<View className="flex-row bg-gray-900/30 rounded-xl p-1 mb-6">
						{['All', 'My mentors', 'Books'].map(tab => (
							<TouchableOpacity
								key={tab}
								onPress={() => setSelectedTab(tab)}
								className="flex-1 py-3 rounded-lg items-center"
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
											height: 3,
											marginTop: 8,
											width: '60%',
											borderRadius: 10,
										}}
									/>
								)}
							</TouchableOpacity>
						))}
					</View>
							<View className="mb-8">
								<View className="flex-row justify-between items-center mb-4">
									<Text className="text-white font-sora-semibold text-lg">
										My mentors
									</Text>
									<TouchableOpacity>
										<Text className="text-blue-400 font-inter-medium text-sm">
											View all →
										</Text>
									</TouchableOpacity>
								</View>
								<ScrollView horizontal showsHorizontalScrollIndicator={false}>
									<View className="flex-row px-2">
										{mockMentors.map(renderMentorCard)}
									</View>
								</ScrollView>
							</View>

					*/}
						<View className="mb-4">
							<View className="flex-row justify-between items-center mb-4 px-[5%]">
								<Text className="text-white font-sora-semibold text-lg">
									Check out Communities
								</Text>
								{/* <TouchableOpacity>
										<Text className="text-blue-400 font-inter-medium text-sm">
											View all →
										</Text>
									</TouchableOpacity> */}
							</View>
							{isPending ? (
								<View className="items-center justify-center py-10">
									<ActivityIndicator color={Colors.primary} size="large" />
								</View>
							) : allCommunities && allCommunities.length > 0 ? (
								// FlatList for horizontal communities
								<FlatList
									data={allCommunities}
									keyExtractor={item => item.id.toString()}
									renderItem={({item}) => (
										<RenderCommunityCard community={item} />
									)}
									horizontal
									showsHorizontalScrollIndicator={false}
									className="px-[5%]"
								/>
							) : (
								<View className="items-center justify-center py-10">
									<Text className="text-gray-400 font-inter-medium text-base">
										You&apos;re all caught up
									</Text>
								</View>
							)}
						</View>

						{/* Bottom Section with Tabs */}
						<View className="mx-[5%] flex-row bg-gray-900/30 rounded-xl p-1 my-4">
							{['My communities'].map(tab => (
								<TouchableOpacity
									key={tab}
									className="flex-1 py-3 rounded-lg items-center"
									onPress={() => setSelectedTab(tab)}
								>
									<Text className="font-inter-medium text-sm text-white">
										{tab}
									</Text>
									{tab === selectedTab && (
										<LinearGradient
											colors={['#00CCFF', '#1520A6']}
											start={{x: 0, y: 0}}
											end={{x: 1, y: 0.4}}
											style={{
												height: 3,
												marginTop: 8,
												width: '60%',
												borderRadius: 10,
											}}
										/>
									)}
								</TouchableOpacity>
							))}
							<View className="flex-1" />
						</View>
					</View>
				}
				ListEmptyComponent={
					isPendingMyCommunities ? (
						<View className="items-center justify-center py-10">
							<ActivityIndicator color={Colors.primary} size="large" />
						</View>
					) : (
						<View className="items-center justify-center py-10">
							<Text className="text-gray-400 font-inter-medium text-base">
								You have not joined any communities yet.
							</Text>
						</View>
					)
				}
			/>

			<TouchableOpacity
				className="w-16 h-16 bg-[#0B0F1C] rounded-full items-center justify-center ml-auto right-[5%]"
				style={{
					shadowColor: '#000',
					shadowOffset: {width: 0, height: 4},
					shadowOpacity: 0.3,
					shadowRadius: 8,
					elevation: 8,
					bottom: insets.bottom + 100,
				}}
				onPress={() => router.push('/community/create')}
			>
				<FontAwesome6 name="plus" size={40} color="#FFFFFF" />
			</TouchableOpacity>
		</View>
	);
};

export default Connect;

const styles = StyleSheet.create({
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
});
