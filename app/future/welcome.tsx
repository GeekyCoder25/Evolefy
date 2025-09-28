import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Ionicons} from '@expo/vector-icons';
import {Image, ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppButton from '../components/ui/button';

const Welcome = () => {
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<LinearGradient colors={['#00CCFF', '#1520A6']} style={styles.gradient} />
			<ImageBackground source={require('../../assets/images/noise-bg.png')}>
				<View style={{paddingTop: insets.top}} />
			</ImageBackground>

			{/* Main Content Area */}
			<View className="flex-1 px-[5%] py-10">
				<TouchableOpacity
					className={`bg-white w-10 h-10 rounded-full flex justify-center items-center`}
					onPress={router.back}
				>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text className="text-white font-sora-semibold mt-5 mb-20 text-3xl leading-relaxed">
					Let’s Create A Glimpse Into Your Tomorrow
				</Text>
				<ImageBackground
					source={require('../../assets/images/future-me-steps.png')}
					style={{
						flex: 1,
						justifyContent: 'center',
						alignContent: 'center',
					}}
					contentFit="contain"
					contentPosition={'top center'}
				>
					<Image
						source={require('../../assets/images/futureme-welcome-bg.png')}
						style={{
							width: '100%',
							height: '100%',
							flex: 1,
							// backgroundColor: 'red',
						}}
						contentFit="contain"
					/>
				</ImageBackground>
				<AppButton onPress={() => router.push('/future/date-time')} />
			</View>

			{/* Bottom Section with Dots and Buttons */}
		</View>
	);
};

export default Welcome;
const styles = StyleSheet.create({
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
	gradient: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		opacity: 0.1,
		position: 'absolute',
	},
});
