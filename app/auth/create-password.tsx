import {resetPassword} from '@/services/apis/auth';
import Feather from '@expo/vector-icons/Feather';
import {useMutation} from '@tanstack/react-query';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import MainContainer from '../components/MainContainer';
import TextInput from '../components/ui/TextInput';
import AuthFooter from './components/AuthFooter';
import AuthHeader from './components/AuthHeader';

const CreateNewPasswordScreen = () => {
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const {email, code}: {email: string; code: string} = useLocalSearchParams();

	const {mutate: passwordMutation, isPending} = useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Password reset successful',
			});
			router.dismissTo('/auth/login');
		},
	});

	const handleCreatePassword = async () => {
		if (formData.password !== formData.confirmPassword) {
			return;
		}

		if (formData.password.length < 8) {
			return;
		}
		passwordMutation({
			email,
			token: code,
			password: formData.password,
			password_confirmation: formData.confirmPassword,
		});
	};

	const isFormValid =
		formData.password.length >= 8 &&
		formData.password === formData.confirmPassword;

	return (
		<MainContainer className="p-4">
			<ScrollView>
				<AuthHeader
					title="Create a New Password"
					subTitle="Let's secure your journey and get you back on track."
				/>
				<View className="gap-y-8">
					<View>
						<TextInput
							placeholder="Password"
							placeholderTextColor={'grey'}
							secureTextEntry={!showPassword}
							onChangeText={text =>
								setFormData(prev => ({...prev, password: text}))
							}
							value={formData.password}
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
						<TextInput
							placeholder="Confirm new password"
							placeholderTextColor={'grey'}
							secureTextEntry={!showConfirmPassword}
							onChangeText={text =>
								setFormData(prev => ({...prev, confirmPassword: text}))
							}
							value={formData.confirmPassword}
						/>
						<TouchableOpacity
							className="absolute right-4 top-4 z-10 p-1"
							onPress={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							<Feather
								name={showConfirmPassword ? 'eye-off' : 'eye'}
								size={20}
								color="#FFFFFF"
							/>
						</TouchableOpacity>
					</View>

					{/* Password Requirements */}
					<View className="gap-y-2">
						<Text className="text-gray-400 text-sm">
							Password must contain:
						</Text>
						<Text
							className={`text-sm ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}
						>
							• At least 8 characters
						</Text>
						<Text
							className={`text-sm ${formData.password && formData.password === formData.confirmPassword ? 'text-green-500' : 'text-gray-500'}`}
						>
							• Passwords match
						</Text>
					</View>
				</View>
			</ScrollView>
			<AuthFooter
				handlePress={handleCreatePassword}
				disabled={!isFormValid}
				// buttonText="Create an account"
				loading={isPending}
			/>
		</MainContainer>
	);
};

export default CreateNewPasswordScreen;
