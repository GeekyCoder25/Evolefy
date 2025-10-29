import {Colors} from '@/constants/Colors';
import {resendEmailVerification, verifyEmail} from '@/services/apis/auth';
import {useMutation} from '@tanstack/react-query';
import {LinearGradient} from 'expo-linear-gradient';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {
	ActivityIndicator,
	Dimensions,
	Keyboard,
	NativeSyntheticEvent,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TextInputKeyPressEventData,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MainContainer from '../components/MainContainer';
import AuthFooter from './components/AuthFooter';
import AuthHeader from './components/AuthHeader';

const VerifyOTPScreen = () => {
	const [otp, setOtp] = useState(['', '', '', '']);
	const [resendTimer, setResendTimer] = useState(60);
	const inputRefs = useRef<(TextInput | null)[]>([]);
	const [focusedInput, setFocusedInput] = useState(0);

	// Get email from navigation params if available
	const {email, type}: {email: string; type: 'reset'} = useLocalSearchParams();

	const {mutate: verifyMutation, isPending} = useMutation({
		mutationFn: verifyEmail,
		onSuccess: () => {
			if (type === 'reset')
				router.replace(
					`/auth/create-password?email=${email}&code=${otp.join('').replaceAll(',', '')}`
				);
			else router.dismissTo('/auth/login');
		},
		onError: (error: any) => {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2:
					error.response?.data?.message ||
					error.response?.data ||
					error.message,
			});
			setTimeout(() => {
				// clearOTP();
				otp.forEach((otp, index) => inputRefs.current[index]?.clear());
				inputRefs.current[0]?.focus();
			}, 1500);
		},
	});

	const {mutate: resendMutation, isPending: isResending} = useMutation({
		mutationFn: resendEmailVerification,
		onSuccess: () => {
			setResendTimer(60);
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: `OTP sent to ${email} successfully`,
			});
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

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendTimer]);

	const handleOtpChange = (text: string, index: number) => {
		const newOtp = [...otp];
		newOtp[index] = text;
		setOtp(newOtp);

		// Auto-focus next input
		if (text && index < 3 && inputRefs.current) {
			return inputRefs.current[index + 1]?.focus();
		} else if (text) {
			Keyboard.dismiss();
			console.log(index);
			setFocusedInput(4);
		}
	};

	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>,
		index: number
	) => {
		// Handle backspace
		if (e.nativeEvent.key === 'Backspace' && index > 0 && inputRefs.current) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerifyOtp = async () => {
		const code = otp.join('');
		if (code.length === 4) {
			// Verify OTP logic here
			console.log('Verifying OTP:', code);
			verifyMutation({email, code});
		}
	};

	const handleResendOtp = async () => {
		if (resendTimer === 0) {
			resendMutation({email});
		}
	};

	const isOtpComplete = otp.every(digit => digit !== '');

	return (
		<MainContainer className="p-4">
			<ScrollView>
				<AuthHeader
					title="Just One More Step..."
					subTitle={`We sent a verification code to ${email}. Please enter the code below`}
				/>
				<View className="gap-y-8">
					{/* OTP Input */}
					<View className="flex-row justify-between gap-10 mx-auto">
						{otp.map((digit, index) => (
							<LinearGradient
								key={index}
								colors={
									focusedInput === index
										? ['#00CCFF', '#1520A6']
										: ['transparent', 'transparent']
								}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0.4}}
								style={{
									borderRadius: 12,
									padding: 2,
								}}
							>
								<TextInput
									ref={ref => {
										inputRefs.current[index] = ref;
									}}
									className={`${
										Dimensions.get('window').width < 300
											? 'w-10 h-10 text-3xl'
											: 'w-20 h-20 text-5xl'
									} text-center font-sora-semibold border-0 border-white py-5 px-5 rounded-xl bg-[#192024] text-white`}
									maxLength={1}
									inputMode="numeric"
									value={digit}
									onChangeText={text => handleOtpChange(text, index)}
									onKeyPress={e => handleKeyPress(e, index)}
									autoFocus={index === 0}
									onFocus={() => setFocusedInput(index)}
									style={{
										borderWidth: focusedInput === index ? 0 : 1,
									}}
								/>
							</LinearGradient>
						))}
					</View>

					{/* Resend Timer */}
					{isResending ? (
						<ActivityIndicator color={Colors.primary} />
					) : (
						<View className="flex-row justify-center items-center gap-x-2">
							<Text className="text-gray-400 text-sm font-sora-regular">
								Didn&apos;t receive code?
							</Text>
							<Pressable
								onPress={handleResendOtp}
								disabled={resendTimer > 0}
								className={`${resendTimer > 0 ? 'opacity-50' : ''}`}
							>
								<Text
									className={`${resendTimer > 0 ? 'text-sm text-[#919191]' : 'text-blue-500 font-sora-semibold'}`}
								>
									{resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}
								</Text>
							</Pressable>
						</View>
					)}
				</View>
			</ScrollView>
			<AuthFooter
				handlePress={handleVerifyOtp}
				disabled={!isOtpComplete || isPending}
				buttonText="Next"
				loading={isPending}
			/>
		</MainContainer>
	);
};

export default VerifyOTPScreen;
