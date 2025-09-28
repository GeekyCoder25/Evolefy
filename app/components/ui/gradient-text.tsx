import MaskedView from '@react-native-masked-view/masked-view';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {ColorValue, Text} from 'react-native';

interface GradientTextProps {
	text: string | number;
	colors: [ColorValue, ColorValue, ...ColorValue[]];
	className: string;
}

const GradientText: React.FC<GradientTextProps> = ({
	text,
	colors,
	className,
}) => {
	return (
		<MaskedView
			maskElement={
				<Text className={className} style={[{backgroundColor: 'transparent'}]}>
					{text}
				</Text>
			}
		>
			<LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
				<Text className={className} style={[{opacity: 0}]}>
					{text}
				</Text>
			</LinearGradient>
		</MaskedView>
	);
};

export default GradientText;
