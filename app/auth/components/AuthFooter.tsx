import AppButton from '@/app/components/ui/button';
import {router} from 'expo-router';
import React from 'react';
import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface AuthFooterProps {
	buttonText?: string;
	disabled?: boolean;
	isSignUp?: boolean;
	loading: boolean;
	handlePress: () => void;
}

const AuthFooter = ({
	disabled,
	isSignUp,
	handlePress,
	loading,
	buttonText,
}: AuthFooterProps) => {
	const {bottom} = useSafeAreaInsets();
	return isSignUp ? (
		<View className="gap-5" style={{marginBottom: bottom}}>
			<AppButton
				onPress={handlePress}
				loading={loading}
				buttonText={buttonText}
				disabled={disabled}
			/>
			<Text className="text-[#AEAEAE] font-sora-regular text-center">
				Already have an account?{' '}
				<Text
					className="text-[#D9D9D9] font-sora-bold"
					onPress={() => router.replace('/auth/login')}
				>
					Login
				</Text>
			</Text>
		</View>
	) : (
		<View className="gap-5" style={{marginBottom: bottom}}>
			<AppButton
				onPress={handlePress}
				loading={loading}
				buttonText={buttonText}
				disabled={disabled}
			/>
			<Text className="text-[#AEAEAE] font-sora-regular text-center">
				Don&apos;t have an account?{' '}
				<Text
					className="text-[#D9D9D9] font-sora-bold"
					onPress={() => router.replace('/auth/signup')}
				>
					Sign up
				</Text>
			</Text>
		</View>
	);
};

export default AuthFooter;
