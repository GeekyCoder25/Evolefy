import {getUserProfile} from '@/services/apis/user';
import {AxiosClient} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';
import Constants from 'expo-constants';
import {Image, ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppButton from '../components/ui/button';
import AuthHeader from './components/AuthHeader';

const EnablePushScreen = () => {
	const [granted, setGranted] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(false);
	const insets = useSafeAreaInsets();

	const {data: user} = useQuery({
		queryKey: ['user'],
		queryFn: getUserProfile,
	});

	const handleEnablePush = async () => {
		setLoading(true);
		try {
			const {status} = await Notifications.requestPermissionsAsync();
			setGranted(status === 'granted');
			if (status === 'granted') {
				const projectId =
					Constants?.expoConfig?.extra?.eas?.projectId ??
					Constants?.easConfig?.projectId;
				const pushTokenString = (
					await Notifications.getExpoPushTokenAsync({
						projectId,
					})
				).data;
				const axiosClient = new AxiosClient();
				const response = await axiosClient.post('/push-notice', {
					push_token: pushTokenString,
				});
				if (response.status === 200) {
					if (user?.data.attributes.has_completed_onboarding)
						return router.replace('/(tabs)');
					router.replace('/welcome/message');
				}
			} else {
				throw new Error('Permission denied');
			}
		} catch (e) {
			console.log(e, 'error');
			setGranted(false);
			setTimeout(() => {
				if (user?.data.attributes.has_completed_onboarding)
					return router.replace('/(tabs)');
				router.replace('/welcome/message');
			}, 1500);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<LinearGradient colors={['#00CCFF', '#1520A6']} style={styles.gradient} />
			<View style={[styles.content, {paddingBottom: insets.bottom + 20}]}>
				<AuthHeader
					title="Enable Push Notifications"
					subTitle="
					Stay up to date with reminders, quotes, and mentor check-ins. You can
					always change this later in settings."
				/>
				<ImageBackground
					source={require('../../assets/images/future-me-steps.png')}
					style={{
						flex: 1,
						justifyContent: 'center',
						alignContent: 'center',
						// marginTop: -SCREEN_HEIGHT * 0.2,
					}}
					contentFit="contain"
					contentPosition={'top center'}
				>
					<Image
						source={require('../../assets/images/futureme-welcome-bg.png')}
						style={{
							width: '100%',
							height: '100%',
							flex: 1,
							// backgroundColor: 'red',
						}}
						contentFit="contain"
					/>
				</ImageBackground>
				<AppButton
					onPress={handleEnablePush}
					buttonText={granted === true ? 'Enabled!' : 'Enable Notifications'}
					loading={loading}
					disabled={loading || granted === true}
				/>
				{granted === false && (
					<Text style={styles.error} className="text-red-400 mt-4">
						Permission denied. Please enable notifications in your device
						settings.
					</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	bgImage: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.3,
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.2,
	},
	content: {
		flex: 1,
		// alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 32,
	},
	title: {
		color: '#fff',
		textAlign: 'center',
		marginBottom: 12,
	},
	subtitle: {
		color: '#e5e7eb',
		textAlign: 'center',
		marginBottom: 24,
	},
	error: {
		color: '#f87171',
		textAlign: 'center',
		marginTop: 16,
	},
});

export default EnablePushScreen;
