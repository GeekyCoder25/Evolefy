import React, {useEffect} from 'react';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

const AnimatedIcon = ({IconComponent, yOffset, xOffset}: any) => {
	const translateY = useSharedValue(0);
	const translateX = useSharedValue(0);

	const repeatDelay = 1500;

	useEffect(() => {
		const timeout = setTimeout(() => {
			translateY.value = withRepeat(
				withSequence(
					withTiming(yOffset, {
						duration: 1000,
						easing: Easing.out(Easing.ease),
					}),
					withDelay(
						repeatDelay,
						withTiming(0, {
							duration: 0,
						})
					)
				),
				-1,
				false // don't reverse
			);

			translateX.value = withRepeat(
				withSequence(
					withTiming(xOffset, {
						duration: 1000,
						easing: Easing.out(Easing.ease),
					}),
					withDelay(
						repeatDelay,
						withTiming(0, {
							duration: 0,
						})
					)
				),
				-1,
				false
			);
		}, 500);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{translateY: translateY.value}, {translateX: translateX.value}],
	}));

	return (
		<Animated.View style={[{position: 'absolute', top: -20}, animatedStyle]}>
			<IconComponent />
		</Animated.View>
	);
};

export default AnimatedIcon;
