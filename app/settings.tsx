import {
	ACCESS_TOKEN_KEY,
	HAS_ONBOARDED,
	HAS_OPENED_EVO,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
} from '@/constants';
import {deleteAccount} from '@/services/apis/user';
import {AxiosClient} from '@/utils/axios';
import {MemoryStorage} from '@/utils/storage';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import {router} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	ColorValue,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Header from './(tabs)/components/Header';
import AppButton from './components/ui/button';
import CustomSwitch from './components/ui/CustomSwitch';

const Settings = () => {
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const [notifications, setNotifications] = useState(false);
	const [visibility, setVisibility] = useState(true);
	const [isEnablingNotification, setIsEnablingNotification] = useState(false);

	useEffect(() => {
		Notifications.getPermissionsAsync().then(res =>
			setNotifications(!!res.granted)
		);
	}, []);

	const {mutate: deleteMutate, isPending} = useMutation({
		mutationFn: deleteAccount,
		onSuccess: response => {
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Account deleted successfully',
			});
			router.push('/auth/login');
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: isAxiosError(error)
					? error.response?.data.message
					: 'Error deleting account',
			});
		},
	});

	const handleDeleteAccount = () => {
		Alert.alert(
			'Delete Account',
			"This would delete your account and can't be got back.",
			[
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						deleteMutate();
						// Handle account deletion
						console.log('Account deletion confirmed');
					},
				},
			]
		);
	};

	const handleUpdateQuestionnaires = () => {
		// Navigate to questionnaires update screen
		console.log('Navigate to questionnaires');
		router.push('/welcome/message');
	};

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

	const handleNotificationChange = async () => {
		if (!notifications) {
			try {
				setIsEnablingNotification(true);
				const {status} = await Notifications.requestPermissionsAsync();
				if (status === 'granted') {
					const projectId =
						Constants?.expoConfig?.extra?.eas?.projectId ??
						Constants?.easConfig?.projectId;
					const pushTokenString = (
						await Notifications.getExpoPushTokenAsync({
							projectId,
						})
					).data;
					Clipboard.setStringAsync(pushTokenString);
					const axiosClient = new AxiosClient();
					const response = await axiosClient.post('/push-notice', {
						push_token: pushTokenString,
					});
					if (response.status === 200) {
						setNotifications(true);
					}
				}
			} finally {
				setIsEnablingNotification(false);
			}
		} else {
			setNotifications(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			<Header showBack showProgress title="Settings" />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{paddingBottom: insets.bottom + 100}}
			>
				<View className="px-[5%] pt-6">
					{/* <PushNotification /> */}
					<SettingsItem
						title="Notification"
						description="Manage reminders: Daily tasks, quotes, mentor check-ins."
						type="switch"
						value={notifications || isEnablingNotification}
						onValueChange={handleNotificationChange}
						isLoading={isEnablingNotification}
					/>

					<SettingsItem
						title="Set Visibility"
						description="Make goals visible to mentor/partner"
						type="switch"
						value={visibility}
						onValueChange={setVisibility}
					/>

					<SettingsItem
						title="Delete account"
						description="This would delete your account and can't be got back."
						type="button"
						buttonText="Delete"
						isDestructive={true}
						onPress={handleDeleteAccount}
						isLoading={isPending}
					/>

					<SettingsItem
						title="Update Questionnaires"
						description="Modify your responses to personalize insights."
						type="button"
						buttonText="Update"
						onPress={handleUpdateQuestionnaires}
					/>
				</View>
			</ScrollView>

			{/* Log out button */}
			<View
				className="px-[5%] pb-4 bg-transparent"
				style={{paddingBottom: insets.bottom + 16}}
			>
				<AppButton onPress={handleConfirmLogout} buttonText="Log out" />
			</View>
		</View>
	);
};

export default Settings;

interface SettingsItemProps {
	title: string;
	description: string;
	type: 'switch' | 'button';
	value?: boolean;
	onValueChange?: (value: boolean) => void;
	onPress?: () => void;
	buttonText?: string;
	buttonColor?: [ColorValue, ColorValue];
	isDestructive?: boolean;
	isLoading?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
	title,
	description,
	type,
	value,
	onValueChange,
	onPress,
	buttonText,
	buttonColor = ['#00CCFF', '#1520A6'],
	isDestructive = false,
	isLoading,
}) => {
	return (
		<View className="flex-row items-center py-5 border-b border-gray-800/30">
			<View className="flex-1 gap-y-1 pr-4">
				<Text className="text-white font-inter-semibold text-lg">{title}</Text>
				<Text className="text-gray-300 font-inter-regular text-sm leading-5">
					{description}
				</Text>
			</View>

			{type === 'switch' && onValueChange && (
				<CustomSwitch value={value || false} onValueChange={onValueChange} />
			)}

			{type === 'button' && onPress && (
				<TouchableOpacity
					onPress={onPress}
					activeOpacity={0.8}
					disabled={isLoading}
				>
					<LinearGradient
						colors={isDestructive ? ['#EF4444', '#DC2626'] : buttonColor}
						start={{x: 0, y: 0}}
						end={{x: 1, y: 0.4}}
						style={styles.actionButton}
					>
						{isLoading ? (
							<ActivityIndicator color={'#FFFFFF'} />
						) : (
							<Text className="text-white font-inter-semibold text-sm">
								{buttonText}
							</Text>
						)}
					</LinearGradient>
				</TouchableOpacity>
			)}
		</View>
	);
};

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
