import {ACCESS_TOKEN_KEY, HAS_ONBOARDED, LAST_LOGIN} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {login} from '@/services/apis/auth';
import {getOnboarding} from '@/services/apis/onboarding';
import {getUserProfile} from '@/services/apis/user';
import {MemoryStorage} from '@/utils/storage';
import Feather from '@expo/vector-icons/Feather';
import {useMutation, useQuery} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import * as Notifications from 'expo-notifications';
import {router} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TextInput as RNTextInput,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import TextInput from '../components/ui/TextInput';
import AuthFooter from './components/AuthFooter';
import AuthHeader from './components/AuthHeader';

const LoginScreen = () => {
	const {user, setUser} = useGlobalStore();
	const [isInputFocused, setIsInputFocused] = useState(false);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const inputRef = useRef<RNTextInput | null>(null);

	useQuery({
		queryKey: ['onboardingData'],
		queryFn: getOnboarding,
		enabled: !!user,
	});
	useQuery({
		queryKey: ['user'],
		queryFn: getUserProfile,
		enabled: !!user,
	});

	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setIsInputFocused(false);
				inputRef.current?.blur();
			}
		);
		return () => {
			keyboardDidHideListener?.remove();
		};
	}, []);

	const {mutate: loginMutation, isPending} = useMutation({
		mutationFn: login,
		onSuccess: async response => {
			const storage = new MemoryStorage();
			await storage.setItem(ACCESS_TOKEN_KEY, response.data.token);
			await storage.setItem(LAST_LOGIN, new Date().toISOString());
			setUser({...response.data.user.attributes, id: response.data.user.id});
			const {status} = await Notifications.getPermissionsAsync();
			if (response.data.user.attributes.has_completed_onboarding) {
				await storage.setItem(HAS_ONBOARDED, 'true');
				if (status !== 'granted') return router.replace('/auth/enable-push');
				return router.replace('/(tabs)');
			}
			if (status === 'granted') router.replace('/welcome/message');
			else router.replace('/auth/enable-push');
		},
		onError: error => {
			if (isAxiosError(error)) setErrorMessage(error.response?.data.message);
			else setErrorMessage(error.message);
		},
	});

	const handleLogin = () => {
		if (Object.values(formData).some(field => field === '')) {
			setErrorMessage('Please fill in all fields');
			return;
		}
		loginMutation(formData);
	};

	return (
		<KeyboardAvoidingView
			className="flex-1 bg-background"
			behavior={isInputFocused ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 120}
			style={{flex: 1}}
		>
			<MainContainer className="p-[3%]">
				<ScrollView>
					<AuthHeader
						title="Welcome back to building your future"
						subTitle="Enter your journey — one step closer to who you're becoming."
					/>
					<View className="gap-y-5">
						<TextInput
							placeholder="Email"
							placeholderTextColor={'grey'}
							inputMode="email"
							onChangeText={text => {
								setFormData(prev => ({...prev, email: text}));
								setErrorMessage('');
							}}
							value={formData.email}
						/>
						<View className="relative">
							<TextInput
								placeholder="Password"
								placeholderTextColor={'grey'}
								onChangeText={text => {
									setFormData(prev => ({...prev, password: text}));
									setErrorMessage('');
								}}
								value={formData.password}
								secureTextEntry={!showPassword}
							/>
							<TouchableOpacity
								className="absolute right-4 top-4 z-10 p-1"
								onPress={() => setShowPassword(!showPassword)}
							>
								<Feather
									name={showPassword ? 'eye-off' : 'eye'}
									size={20}
									color="#FFFFFF"
								/>
							</TouchableOpacity>
						</View>
						<View>
							<Text className="text-red-500 font-sora-regular text-sm">
								{errorMessage}
							</Text>
							<TouchableOpacity
								onPress={() =>
									router.push(`/auth/forgot?email=${formData.email}`)
								}
							>
								<Text className="text-white font-sora-semibold text-right">
									Forgot Password?
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View className="h-[30vh]" />
				</ScrollView>
				<AuthFooter
					handlePress={handleLogin}
					loading={isPending}
					disabled={isPending}
				/>
			</MainContainer>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
