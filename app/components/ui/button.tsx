import {Colors} from '@/constants/Colors';
import React from 'react';
import {
	ActivityIndicator,
	StyleProp,
	Text,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';

interface AppButtonProps {
	onPress: () => void | Promise<void>;
	loading?: boolean;
	buttonText?: string;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	className?: string;
}
const AppButton = (props: AppButtonProps) => {
	return (
		<TouchableOpacity
			className={`bg-white py-5 rounded-full items-center border border-white ${props.className}`}
			onPress={props.onPress}
			disabled={props.disabled}
			style={[props.style, {opacity: props.disabled ? 0.5 : 1}]}
		>
			{props.loading ? (
				<ActivityIndicator color={Colors.bg} />
			) : (
				<Text className="font-sora-semibold text-base">
					{props.buttonText || 'Continue'}
				</Text>
			)}
		</TouchableOpacity>
	);
};

export default AppButton;
