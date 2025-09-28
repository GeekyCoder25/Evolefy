import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {getFutureSelf} from '@/services/apis/user';
import {Ionicons} from '@expo/vector-icons';
import {useQuery} from '@tanstack/react-query';
import {ImageBackground} from 'expo-image';
import {router} from 'expo-router';
import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Dashboard = () => {
	const insets = useSafeAreaInsets();
	// const paramsData = JSON.parse(futureMe);=[]
	const {data: futureSelf} = useQuery({
		queryKey: ['future_self'],
		queryFn: getFutureSelf,
	});

	const futureMe = futureSelf?.data[0];

	const futureDate = futureMe?.attributes.date
		? new Date(futureMe.attributes.date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: '';
	return (
		<View>
			<ImageBackground source={require('../../assets/images/noise-bg.png')}>
				<View style={{paddingTop: insets.top}} />
			</ImageBackground>
			<ImageBackground
				source={{uri: futureMe?.attributes.transformed_image_url}}
				style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
			>
				<View className="absolute top-0 right-0 left-0 bottom-0 bg-black opacity-80" />
				<View className="px-[5%] py-5">
					<TouchableOpacity
						className={`bg-white w-10 h-10 rounded-full flex justify-center items-center`}
						onPress={router.back}
					>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
				</View>
				<ScrollView
					className="flex-1 px-[5%] py-20"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{paddingBottom: insets.bottom + 50}}
				>
					<View className="flex-row mb-20">
						<View className="bg-secondary py-7 px-6 rounded-xl w-1/2">
							<Text className="font-sora-bold text-[#AAEBFF] text-2xl">
								Elite
							</Text>
							<Text className="font-sora-bold my-2 text-white">
								Consistency Level
							</Text>
							<View className="bg-[#D9D9D970] h-4 w-full rounded-full overflow-hidden justify-center mt-1 mb-4">
								<View
									className="bg-[#451671] h-full absolute rounded-full"
									style={{
										width: `${futureMe?.attributes.consistency_level || 0}%`,
									}}
								/>
							</View>
						</View>
					</View>
					<View className="flex-row mb-20">
						<View className="bg-secondary py-7 px-6 rounded-xl w-1/2">
							<Text className="font-sora-bold text-[#A5FF99] text-2xl">
								+{futureMe?.attributes.overall_growth_percent}%
							</Text>
							<Text className="font-sora-bold my-2 text-white">
								Growth Potential
							</Text>
							<Text className="font-sora-bold my-2 text-white text-sm">
								Estimated personal development increase
							</Text>
						</View>
					</View>
					<View className="flex-row mb-20">
						<View className="bg-secondary py-7 px-6 rounded-xl w-1/2">
							<Text className="font-sora-bold text-[#A5FF99] text-2xl">
								{futureMe?.attributes.goal_achievement_percent}%
							</Text>
							<Text className="font-sora-bold my-2 text-white">
								Goal Achievement
							</Text>
							<Text className="font-sora-bold my-2 text-white text-sm">
								Projected success rate based on current trajectory
							</Text>
						</View>
					</View>
					<View className="bg-[#002F3D] px-8 py-5 rounded-2xl">
						<Text className="text-white font-sora-bold">{futureDate}</Text>

						<View className="gap-y-3 my-5">
							<Text className="text-[rgba(255,255,255,0.7)] font-sora-regular">
								Occupation:{' '}
								<Text className="font-sora-bold text-white">
									{futureMe?.attributes.future_occupation}
								</Text>
							</Text>
							<Text className="text-[rgba(255,255,255,0.7)] font-sora-regular">
								Networth:{' '}
								<Text className="font-sora-bold text-white">
									{futureMe?.attributes.estimated_networth}
								</Text>
							</Text>
							<Text className="text-[rgba(255,255,255,0.7)] font-sora-regular">
								Spiritual growth:{' '}
								<Text className="font-sora-bold text-white">
									{futureMe?.attributes.spiritual_growth}
								</Text>
							</Text>
							<Text className="text-[rgba(255,255,255,0.7)] font-sora-regular">
								Relationship:{' '}
								<Text className="font-sora-bold text-white">
									{futureMe?.attributes.relationship_status}
								</Text>
							</Text>
						</View>
					</View>
				</ScrollView>
			</ImageBackground>
		</View>
	);
};

export default Dashboard;
