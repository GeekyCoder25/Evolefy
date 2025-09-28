import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {ColorValue, StyleSheet, TouchableOpacity} from 'react-native';

interface CustomSwitchProps {
	value: boolean;
	onValueChange: (value: boolean) => void;
	activeColor?: [ColorValue, ColorValue];
	inactiveColor?: [ColorValue, ColorValue];
	size?: 'small' | 'medium' | 'large';
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
	value,
	onValueChange,
	activeColor = ['#00CCFF', '#1520A6'],
	inactiveColor = ['#4B5563', '#6B7280'],
	size = 'medium',
}) => {
	const sizeConfig = {
		small: {width: 48, height: 28, thumbSize: 20},
		medium: {width: 64, height: 40, thumbSize: 25},
		large: {width: 80, height: 48, thumbSize: 32},
	};

	const config = sizeConfig[size];

	return (
		<TouchableOpacity onPress={() => onValueChange(!value)} activeOpacity={0.8}>
			<LinearGradient
				colors={value ? activeColor : inactiveColor}
				start={{x: 0, y: 0}}
				end={{x: 1, y: 0.4}}
				style={[
					styles.switchContainer,
					{
						width: config.width,
						height: config.height,
					},
				]}
			>
				<LinearGradient
					colors={value ? ['#FFFFFF', '#FFFFFF'] : ['#FFFFFF', '#FFFFFF']}
					start={{x: 0, y: 0}}
					end={{x: 1, y: 0.4}}
					style={[
						styles.switch,
						{
							width: config.thumbSize,
							height: config.thumbSize,
							marginLeft: value ? 'auto' : 4,
							marginRight: value ? 4 : 'auto',
						},
					]}
				/>
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	switchContainer: {
		justifyContent: 'center',
		borderRadius: 100,
		padding: 4,
	},
	switch: {
		borderRadius: 100,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},
});

export default CustomSwitch;
