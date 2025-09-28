import {register} from '@/services/apis/auth';
import Feather from '@expo/vector-icons/Feather';
import {useMutation} from '@tanstack/react-query';
import {router} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import TextInput from '../components/ui/TextInput';
import AuthFooter from './components/AuthFooter';
import AuthHeader from './components/AuthHeader';

const SignupScreen = () => {
	const [formData, setFormData] = useState({
		fullname: '',
		email: '',
		dob: '',
		password: '',
		password_confirmation: '',
		city: 'Nigeria',
	});
	const [error, setError] = useState({...formData, error: ''});
	const [age, setAge] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (age) {
			const currentYear = new Date().getFullYear();
			const birthYear = currentYear - parseInt(age, 10);
			const dob = new Date(birthYear, 1, 1).toISOString().split('T')[0];
			setFormData(prev => ({...prev, dob}));
		}
	}, [age]);

	const {mutate: signupMutation, isPending} = useMutation({
		mutationFn: register,
		onSuccess: () => {
			router.push(`/auth/verify-otp?email=${formData.email}`);
		},
		onError: (error: any) => {
			console.log(error.response.data || error);
			setError(error.response.data?.errors || {});
		},
	});

	const handleSignup = () => {
		if (Object.values(formData).some(field => field === '')) {
			setError(err => ({...err, error: 'Please fill in all fields'}));
			return;
		}
		if (formData.password !== formData.password_confirmation) {
			setError(err => ({...err, password: 'Passwords do not match'}));
			return;
		}
		if (formData.password.length < 6) {
			setError(err => ({
				...err,
				password: 'The password field must be at least 6 characters',
			}));
			return;
		}

		signupMutation(formData);
	};

	return (
		<MainContainer className="p-4 gap-5">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
				className="flex-1 justify-end"
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<AuthHeader
						title="Create an Account to Begin Your Journey"
						subTitle="Unlock your future now"
					/>
					<View className="">
						<View className="">
							<TextInput
								placeholder="Name"
								placeholderTextColor={'grey'}
								onChangeText={text => {
									setFormData(prev => ({...prev, fullname: text}));
									setError(prev => ({...prev, fullname: ''}));
								}}
								value={formData.fullname}
							/>
							<Text className="text-red-500 text-sm font-sora-regular my-1 ml-2">
								{error.fullname}
							</Text>
						</View>
						<View className="">
							<TextInput
								placeholder="Email"
								placeholderTextColor={'grey'}
								inputMode="email"
								onChangeText={text => {
									setFormData(prev => ({...prev, email: text}));
									setError(prev => ({...prev, email: ''}));
								}}
								value={formData.email}
							/>
							<Text className="text-red-500 text-sm font-sora-regular my-1 ml-2">
								{error.email}
							</Text>
						</View>
						<View className="">
							<TextInput
								placeholder="Age"
								placeholderTextColor={'grey'}
								inputMode="decimal"
								onChangeText={setAge}
								value={age}
								maxLength={2}
							/>
							<Text className="text-red-500 text-sm font-sora-regular my-1 ml-2">
								{error.dob}
							</Text>
						</View>

						<View className="relative">
							<TextInput
								placeholder="Password"
								placeholderTextColor={'grey'}
								secureTextEntry={!showPassword}
								onChangeText={text => {
									setFormData(prev => ({...prev, password: text}));
									setError(prev => ({...prev, password: ''}));
								}}
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
							<Text className="text-red-500 text-sm font-sora-regular my-1 ml-2">
								{error.password}
							</Text>
						</View>
						<View className="relative">
							<TextInput
								placeholder="Confirm new password"
								placeholderTextColor={'grey'}
								secureTextEntry={!showConfirmPassword}
								onChangeText={text => {
									setFormData(prev => ({...prev, password_confirmation: text}));
									setError(prev => ({...prev, password: ''}));
								}}
								value={formData.password_confirmation}
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
							<Text className="text-red-500 text-sm font-sora-regular my-1 ml-2">
								{error.error}
							</Text>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<AuthFooter
				isSignUp
				handlePress={handleSignup}
				loading={isPending}
				disabled={isPending}
			/>
		</MainContainer>
	);
};

export default SignupScreen;
