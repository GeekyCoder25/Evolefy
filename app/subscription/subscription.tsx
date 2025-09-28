import CheckCircleIcon from '@/assets/icons/check-circle';
import CrownIcon from '@/assets/icons/crown-subscription';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {
	Feature,
	getSubscription,
	getSubscriptions,
	initializePayment,
	SubscriptionPlan,
} from '@/services/apis/subscription';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppButton from '../components/ui/button';

const Subscription = () => {
	const insets = useSafeAreaInsets();

	const {data} = useQuery({
		queryKey: ['subscription'],
		queryFn: getSubscriptions,
		gcTime: Infinity,
	});
	const {data: currentPlan} = useQuery({
		queryKey: ['currentPlan'],
		queryFn: getSubscription,
	});

	const subscriptions = data?.data;
	const currentPlanId = currentPlan?.data.attributes?.plan_id;

	return (
		<ImageBackground
			source={require('../../assets/images/noise-bg.png')}
			style={{flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
		>
			<LinearGradient
				colors={['#00CCFF', '#1520A6']}
				start={{x: 0, y: 0}}
				end={{x: 1, y: 0.4}}
				style={{
					flex: 1,
					opacity: 0.7,
					position: 'absolute',
					width: '100%',
					height: '100%',
				}}
			></LinearGradient>
			<View
				style={[styles.mainContent, {paddingTop: insets.top + 10}]}
				className=""
			>
				<View className="flex-row justify-end items-center gap-4 mb-6 px-[5%]">
					<TouchableOpacity onPress={router.back}>
						<Ionicons name="close-sharp" size={40} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
				<View className="w-full items-center my-10">
					<CrownIcon />
					<Text className="text-4xl text-white font-inter-bold mt-5">
						Evolefy
						<Text className="text-secondary"> pro</Text>
					</Text>

					<Text className="text-2xl text-white font-inter-bold mt-5">
						Get premium for more
					</Text>
					<Text className="text-sm text-white font-inter-medium mt-1">
						More Tools. More Power. One Subscription.
					</Text>
				</View>
				<ScrollView className="flex-row" bounces={false}>
					<FlatList
						data={subscriptions}
						renderItem={({item, index}) => (
							<Plan plan={item} index={index} currentPlanId={currentPlanId} />
						)}
						keyExtractor={({id}) => id.toString()}
						horizontal
						ListFooterComponent={() => <View className="w-10"></View>}
					/>
				</ScrollView>
			</View>
		</ImageBackground>
	);
};

export default Subscription;

const Plan = ({
	plan,
	index,
	currentPlanId,
}: {
	plan: SubscriptionPlan;
	index: number;
	currentPlanId?: number;
}) => {
	const queryClient = useQueryClient();
	const {user} = useGlobalStore();

	// Helper function to format feature display text
	const formatFeatureText = (feature: Feature): string => {
		const {name, label, type, unit} = feature.attributes;

		// Convert snake_case to readable text if label is not provided
		const displayName =
			label ||
			name
				.replace(/_/g, ' ')
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

		// For count type features, we need to determine the value based on plan tier
		if (type === 'count') {
			// let value = 'Included';

			// Assign values based on plan name and feature
			// if (plan.attributes.name === 'Premium') {
			// 	switch (
			// 		name
			// 	) {
			// 		case 'evo_ai_chat_messages_per_day':
			// 			value = '50';
			// 			break;
			// 		case 'evo_ai_goal_generation':
			// 			value = '10';
			// 			break;
			// 		case 'custom_goal_creation':
			// 			value = '20';
			// 			break;
			// 		case 'roadmap_steps':
			// 			value = '15';
			// 			break;
			// 		case 'communities_joined':
			// 			value = '3';
			// 			break;
			// 		default:
			// 			value = 'Included';
			// 	}
			// } else if (plan.attributes.name === 'Enterprise') {
			// 	switch (name) {
			// 		case 'evo_ai_chat_messages_per_day':
			// 			value = 'Unlimited';
			// 			break;
			// 		case 'evo_ai_goal_generation':
			// 			value = 'Unlimited';
			// 			break;
			// 		case 'custom_goal_creation':
			// 			value = 'Unlimited';
			// 			break;
			// 		case 'roadmap_steps':
			// 			value = 'Unlimited';
			// 			break;
			// 		case 'communities_joined':
			// 			value = 'Unlimited';
			// 			break;
			// 		default:
			// 			value = 'Included';
			// 	}
			// }

			// Add unit information if available
			if (unit) {
				const unitText = unit.replace('per_', '').replace('_', ' ');
				return `${displayName} ${unitText}`;
			}

			return `${displayName}`;
		}

		// For boolean features, just return the feature name
		return displayName;
	};

	const features = plan.relationships.features || [];

	const {mutate: subscribeMutation, isPending} = useMutation({
		mutationFn: () => initializePayment(plan.id, user?.email!),
		onSuccess: response => {
			router.push(`/subscription/pay?uri=${response.data.authorization_url}`);
			queryClient.invalidateQueries({queryKey: ['subscription_plans']});
			queryClient.invalidateQueries({queryKey: ['current_plan']});
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data.message
					: 'Subscription failed',
			});
		},
	});

	return (
		<View className="ml-10 mt-10 mb-20 rounded-3xl overflow-hidden">
			<ImageBackground
				source={
					index % 3 === 0
						? require('../../assets/images/noise-bg-card.png')
						: index % 3 === 1
							? require('../../assets/images/noise-bg-purple-card.png')
							: require('../../assets/images/noise-bg-green.png')
				}
				style={{flex: 1}}
			>
				<View className="px-8 my-10 flex-1">
					<View className="flex-row items-end gap-3">
						<CrownIcon />
						<Text className="text-white font-inter-semibold text-3xl">
							{plan.attributes.name}
							<Text className="text-base"> /</Text>
							<Text className="text-base font-inter-medium">
								{plan.attributes.duration_days}days
							</Text>
						</Text>
						<Text className="text-white font-inter-semibold text-4xl ml-3">
							₦{plan.attributes.price}
						</Text>
					</View>
					<ScrollView
						className="mt-10"
						contentContainerClassName="gap-5 pb-20"
						showsVerticalScrollIndicator={false}
					>
						{features.map(feature => (
							<View key={feature.id} className="flex-row items-center gap-2">
								<CheckCircleIcon />
								<Text
									className="text-white font-inter-medium flex-1"
									numberOfLines={2}
								>
									{formatFeatureText(feature)}
								</Text>
							</View>
						))}
					</ScrollView>

					<AppButton
						onPress={subscribeMutation}
						className="mt-5"
						buttonText={currentPlanId === plan.id ? 'Subscribed' : 'Subscribe'}
						loading={isPending}
						disabled={isPending || currentPlanId === plan.id}
					/>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	mainContent: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
	},
});
