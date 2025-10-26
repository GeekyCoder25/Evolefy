import DailyChallengeIcon from '@/assets/icons/daily-challenge';
import {useGlobalStore} from '@/context/store';
import {completeChallenge, getDailyChallenge} from '@/services/apis/user';
import {useMutation, useQuery} from '@tanstack/react-query';
import {ImageBackground} from 'expo-image';
import React, {useEffect} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WeekStrip from '../auth/components/WeekStrip';
import MainContainer from './MainContainer';
import AppButton from './ui/button';

const DailyChallenge = () => {
	const insets = useSafeAreaInsets();
	const {showChallengeModal, setShowChallengeModal, user} = useGlobalStore();

	const completeChallengeMutation = useMutation({
		mutationFn: completeChallenge,
		onSuccess: response => {
			Toast.show({
				type: 'success',
				text1: 'Challenge Completed!',
				text2: response.message,
			});
			setShowChallengeModal(false);
		},
	});

	const {data: dailyChallenge} = useQuery({
		queryKey: ['dailyChallenge'],
		queryFn: getDailyChallenge,
		enabled: !!user,
	});

	useEffect(() => {
		if (dailyChallenge?.data.attributes.status === 'pending') {
			setShowChallengeModal(true);
			// Do something with the dailyChallenge data
		} else {
			setShowChallengeModal(false);
		}
	}, [dailyChallenge?.data.attributes.status, setShowChallengeModal]);

	const challengeText =
		dailyChallenge?.data.attributes.challenge ||
		'Complete your daily challenge to keep your streak going!';

	return (
		<Modal
			statusBarTranslucent
			visible={!!showChallengeModal}
			animationType="fade"
			onRequestClose={() => setShowChallengeModal(false)}
		>
			<ImageBackground source={require('../../assets/images/noise-bg.png')}>
				<View className="px-[5%] gap-5" style={{paddingTop: insets.top}} />
			</ImageBackground>
			<View className="absolute inset-0 bg-black/70" />

			<MainContainer>
				<View className="flex-1 justify-center items-center py-5 px-[5%]">
					<View className="flex-row items-between justify-between gap-5 relative w-full mt-5">
						<DailyChallengeIcon />
						<ImageBackground
							source={require('../../assets/images/challenge_category_bg.png')}
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								paddingHorizontal: 16,
							}}
							contentFit="contain"
						>
							<Text className="text-white text-base font-sora-semibold text-center capitalize">
								{dailyChallenge?.data.attributes.category}
							</Text>
						</ImageBackground>
					</View>
					<View className="flex-1 justify-center items-center px-[10%]">
						<Text className="text-white text-2xl text-center font-sora-semibold">
							{challengeText}
						</Text>
					</View>
					<View className="w-full">
						<WeekStrip isStreak />
					</View>
				</View>
				<View
					style={{
						marginBottom: insets.bottom + 30,
						marginHorizontal: '5%',
						marginTop: 20,
					}}
				>
					<AppButton
						onPress={() =>
							completeChallengeMutation.mutate(dailyChallenge!.data.id)
						}
						loading={completeChallengeMutation.isPending}
						disabled={completeChallengeMutation.isPending}
						buttonText="Done"
					/>
					<TouchableOpacity
						onPress={() => {
							setShowChallengeModal(false);
						}}
					>
						<Text className="text-center text-white font-sora-semibold underline my-5">
							I&apos;ll do this later
						</Text>
					</TouchableOpacity>
				</View>
			</MainContainer>
		</Modal>
	);
};

export default DailyChallenge;
