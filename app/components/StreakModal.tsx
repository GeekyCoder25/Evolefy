import FireIcon from '@/assets/icons/fire';
import StreakDayIcon from '@/assets/icons/streak-day';
import StreakDaysIcon from '@/assets/icons/streak-days';
import StreakAvatarIcon from '@/assets/icons/StreakAvatar';
import {STREAK_COUNT} from '@/constants';
import {useGlobalStore} from '@/context/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ImageBackground} from 'expo-image';
import React, {useEffect, useState} from 'react';
import {Modal, Platform, Text, View} from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WeekStrip from '../auth/components/WeekStrip';
import MainContainer from './MainContainer';
import AppButton from './ui/button';

const Streak = () => {
	const insets = useSafeAreaInsets();
	const {user, showStreakModal, setShowStreakModal} = useGlobalStore();
	const streakCount = user?.streak_count || 0;
	const [previousDayStreak, setPreviousDayStreak] = useState(streakCount - 1);

	// Shared values for animation
	const prevY = useSharedValue(0);
	const prevOpacity = useSharedValue(1);
	const currentY = useSharedValue(100); // starts below
	const currentOpacity = useSharedValue(0);

	useEffect(() => {
		// animate previous count upwards
		prevY.value = withTiming(-50, {
			duration: 1000,
			easing: Easing.out(Easing.ease),
		});
		prevOpacity.value = withTiming(0, {duration: 600});

		// animate current count from bottom
		currentY.value = withDelay(
			150,
			withTiming(0, {duration: 1000, easing: Easing.out(Easing.ease)})
		);
		currentOpacity.value = withDelay(150, withTiming(1, {duration: 1000}));
		setTimeout(() => {
			setPreviousDayStreak(streakCount);
		}, 1000);
	}, [currentOpacity, currentY, prevOpacity, prevY, streakCount]);

	const prevStyle = useAnimatedStyle(() => ({
		transform: [{translateY: prevY.value}],
		opacity: prevOpacity.value,
		position: 'absolute',
		marginTop: Platform.OS === 'ios' ? 10 : -20,
	}));

	const currentStyle = useAnimatedStyle(() => ({
		transform: [{translateY: currentY.value}],
		opacity: currentOpacity.value,
		marginTop: Platform.OS === 'ios' ? 10 : -20,
	}));

	const handleClose = () => {
		setShowStreakModal(false);
		AsyncStorage.setItem(STREAK_COUNT, streakCount.toString());
	};

	if (!streakCount) return null;

	return (
		<Modal
			statusBarTranslucent
			visible={showStreakModal}
			animationType="fade"
			onRequestClose={handleClose}
		>
			<ImageBackground source={require('../../assets/images/noise-bg.png')}>
				<View className="px-[5%] gap-5" style={{paddingTop: insets.top}} />
			</ImageBackground>
			<View className="absolute inset-0 bg-black/70" />

			<MainContainer>
				<View className="flex-1 justify-center items-center py-5 px-[5%]">
					<View className="flex-row items-center gap-5 relative">
						{/* Previous streak */}
						<Animated.Text
							className="text-white text-9xl font-inter-bold"
							style={prevStyle}
						>
							{previousDayStreak}
						</Animated.Text>

						{/* Current streak */}
						<Animated.Text
							className="text-white text-9xl font-inter-bold"
							style={currentStyle}
						>
							{streakCount}
						</Animated.Text>

						{previousDayStreak === 1 || streakCount === 1 ? (
							<StreakDayIcon />
						) : (
							<StreakDaysIcon />
						)}
					</View>
					<Text className="text-white font-inter-medium text-2xl mb-5">
						You are on fire <FireIcon /> <FireIcon /> <FireIcon />
					</Text>
					<View className="-mb-16">
						<StreakAvatarIcon />
					</View>
					<View className="w-full">
						<WeekStrip isStreak />
					</View>
				</View>
				<AppButton
					onPress={handleClose}
					style={{marginBottom: insets.bottom + 30, marginHorizontal: '5%'}}
				/>
			</MainContainer>
		</Modal>
	);
};

export default Streak;
