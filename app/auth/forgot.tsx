import {resendEmailVerification} from '@/services/apis/auth';
import {useMutation} from '@tanstack/react-query';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import Toast from 'react-native-toast-message';
import MainContainer from '../components/MainContainer';
import TextInput from '../components/ui/TextInput';
import AuthFooter from './components/AuthFooter';
import AuthHeader from './components/AuthHeader';

const ResetPasswordScreen = () => {
	const {email: paramsEmail}: {email: string} = useLocalSearchParams();
	console.log(paramsEmail);
	const [email, setEmail] = useState(paramsEmail || '');

	const {mutate: resendMutation, isPending: isResetting} = useMutation({
		mutationFn: resendEmailVerification,
		onSuccess: () => {
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: `OTP sent to ${email} successfully`,
			});
			router.replace(`/auth/verify-otp?email=${email}&type=reset`);
		},
		onError: (error: any) => {
			console.log('err', error.response?.data);
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2:
					error.response?.data?.message ||
					error.response?.data ||
					error.message,
			});
		},
	});

	const handleResetPassword = async () => {
		if (!email.trim()) return;

		try {
			// Reset password logic here
			console.log('Sending reset email to:', email);
			resendMutation({email});
		} catch (error) {
			console.error('Reset password error:', error);
		}
	};

	const isEmailValid = email.includes('@') && email.includes('.');

	return (
		<MainContainer className="p-4">
			<ScrollView>
				<AuthHeader
					title="Let's Reset That Password"
					subTitle="Enter your email address and we'll send you a link to reset your
						password"
				/>
				<View className="gap-y-8">
					<TextInput
						placeholder="Email"
						placeholderTextColor={'grey'}
						inputMode="email"
						autoCapitalize="none"
						onChangeText={setEmail}
						value={email}
					/>
				</View>
			</ScrollView>
			<AuthFooter
				handlePress={handleResetPassword}
				disabled={!isEmailValid || isResetting}
				loading={isResetting}
			/>
		</MainContainer>
	);
};

export default ResetPasswordScreen;
