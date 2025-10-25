import {Image} from 'expo-image';
import React, {PropsWithChildren} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const MainContainer = ({
	children,
	className,
}: PropsWithChildren & {className?: string}) => {
	return (
		// <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<View className="flex-1 bg-background">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<View className={`flex-1 ${className}`}>{children}</View>
		</View>
		// </TouchableWithoutFeedback>
	);
};

export default MainContainer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
		backgroundColor: '#000000',
	},
	wrapper: {
		flex: 1,
	},
	mainContent: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	bgImage: {
		width: screenWidth,
		height: screenHeight,
		flex: 1,
		position: 'absolute',
	},
});
