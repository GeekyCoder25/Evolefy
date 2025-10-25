import BrandIcon from '@/assets/icons/brand';
import Onboarding2Icon1 from '@/assets/icons/Onboarding2Icon1';
import Onboarding2Icon2 from '@/assets/icons/Onboarding2Icon2';
import Onboarding2Icon3 from '@/assets/icons/Onboarding2Icon3';
import Onboarding2Icon4 from '@/assets/icons/Onboarding2Icon4';
import Onboarding2Step1 from '@/assets/icons/Onboarding2Step1';
import {Image, ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {
	Animated,
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AnimatedIcon from './components/AnimatedIcon';
import AppButton from './components/ui/button';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const OnboardingCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);
	const insets = useSafeAreaInsets();
	const [page1Timer1, setPage1Timer1] = useState(0);

	const bgTranslateX = useRef(new Animated.Value(0)).current;
	const bgTranslateY = useRef(new Animated.Value(0)).current;

	// Add this useEffect to start the animation:
	useEffect(() => {
		const animateBackground = () => {
			const moveDistance = 15; // Adjust for more/less movement

			const backgroundAnimation = Animated.loop(
				Animated.sequence([
					// Bottom-left to top-right
					Animated.parallel([
						Animated.timing(bgTranslateX, {
							toValue: moveDistance,
							duration: 5000,
							useNativeDriver: true,
						}),
						Animated.timing(bgTranslateY, {
							toValue: -moveDistance,
							duration: 5000,
							useNativeDriver: true,
						}),
					]),
					// Top-right to bottom-left
					Animated.parallel([
						Animated.timing(bgTranslateX, {
							toValue: -moveDistance,
							duration: 5000,
							useNativeDriver: true,
						}),
						Animated.timing(bgTranslateY, {
							toValue: moveDistance,
							duration: 5000,
							useNativeDriver: true,
						}),
					]),
					// Return to center
					Animated.parallel([
						Animated.timing(bgTranslateX, {
							toValue: 0,
							duration: 5000,
							useNativeDriver: true,
						}),
						Animated.timing(bgTranslateY, {
							toValue: 0,
							duration: 5000,
							useNativeDriver: true,
						}),
					]),
				])
			);

			backgroundAnimation.start();
		};

		animateBackground();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setPage1Timer1(prev => {
				if (prev < onboardingData[currentIndex].images.length - 1)
					return prev + 1;
				else return 0;
			});
		}, 1000);

		return () => clearInterval(interval);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentIndex]);

	const onboardingData = [
		{
			id: 1,
			title: 'Evolve into\nyour future',
			description:
				'Embark on your journey by taking charge of your growth and setting clear goals.',
			illustration: '🎯', // You can replace with actual images
			primaryColor: '#00D4FF',
			secondaryColor: '#00A8CC',
			bg: require('../assets/images/onboarding_bg1.jpg'),
			images: [
				{
					key: (
						<Image
							source={require('../assets/images/onboarding1.png')}
							style={{width: 500, height: 500}}
							contentFit="scale-down"
						/>
					),
				},
				// {key: <Onboarding1Step2 />},
				// {key: <Onboarding1Step3 />},
			],
		},
		{
			id: 2,
			title: 'Plan and Track\nYour Journey',
			description:
				'Set goals, track milestones, and visualize your progress towards step.',
			illustration: '📦',
			primaryColor: '#8B5CF6',
			secondaryColor: '#7C3AED',
			bg: require('../assets/images/onboarding_bg2.jpg'),
			images: [{key: <Onboarding2Step1 />}],
			hasCustom: true,
		},
		{
			id: 3,
			title: 'Connect with\nMentors & Peers',
			description:
				'Get support, accountability, and guidance from those who share your future.',
			illustration: '👥',
			primaryColor: '#10B981',
			secondaryColor: '#059669',
			bg: require('../assets/images/onboarding_bg3.jpg'),
			images: [
				{
					key: (
						<Image
							source={require('../assets/images/onboarding3.png')}
							style={{width: 500, height: 500}}
							contentFit="contain"
						/>
					),
				},
			],
		},
	];

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const contentOffset = event.nativeEvent.contentOffset;
		const index = Math.round(contentOffset.x / screenWidth);
		setCurrentIndex(index);
	};

	const scrollToIndex = (index: number) => {
		if (scrollViewRef.current)
			scrollViewRef.current.scrollTo({
				x: index * screenWidth,
				animated: true,
			});
		setCurrentIndex(index);
	};

	const handleNext = () => {
		if (currentIndex < onboardingData.length - 1) {
			scrollToIndex(currentIndex + 1);
		}
	};

	const handleLogin = () => {
		router.push('/auth/login');
	};

	const handleCreateAccount = () => {
		router.push('/auth/signup');
	};

	const renderDots = () => (
		<View style={styles.dotsContainer}>
			{onboardingData.map((_, index) =>
				currentIndex === index ? (
					<LinearGradient
						key={index}
						colors={['#00CCFF', '#1520A6']}
						start={{x: 0, y: 0}}
						end={{x: 1, y: 0}}
						style={[
							styles.dot,
							{
								width: 42,
							},
						]}
					/>
				) : (
					<View
						key={index}
						style={[
							styles.dot,
							{
								backgroundColor: '#FFFFFF',
								width: 8,
							},
						]}
					/>
				)
			)}
		</View>
	);

	const renderOnboardingItem = (item: any, index: number) => (
		<View style={styles.container} key={item.id}>
			<Animated.View
				style={{
					transform: [{translateX: bgTranslateX}, {translateY: bgTranslateY}],
				}}
			>
				<ImageBackground
					source={item.bg}
					style={[
						styles.bgImage,
						{
							width: screenWidth + 30, // Slightly larger to prevent edges
							height: screenHeight + 30,
							marginLeft: -25,
							marginTop: -25,
						},
					]}
					contentFit={item.id === onboardingData.length ? 'contain' : 'cover'}
				/>
			</Animated.View>
			<ImageBackground
				source={require('../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage2}
			/>
			{/* <View > */}
			<LinearGradient colors={['#00CCFF', '#1520A6']} style={styles.gradient} />

			<View style={[styles.slide, {paddingTop: insets.top + 30}]}>
				{/* Content */}
				<BrandIcon />
				<View style={styles.content}>
					{/* Illustration Area */}
					<View style={styles.illustrationContainer}>
						{item.hasCustom && (
							<View style={{position: 'absolute', zIndex: 1}}>
								<AnimatedIcon
									IconComponent={Onboarding2Icon1}
									xOffset={-120}
									yOffset={-100}
								/>
								<AnimatedIcon
									IconComponent={Onboarding2Icon2}
									xOffset={-50}
									yOffset={-130}
								/>
								<AnimatedIcon
									IconComponent={Onboarding2Icon3}
									xOffset={50}
									yOffset={-130}
								/>
								<AnimatedIcon
									IconComponent={Onboarding2Icon4}
									xOffset={120}
									yOffset={-100}
								/>
							</View>
						)}
						{item.images.map((image: any, index: any) => (
							<View
								key={index}
								style={{
									position: 'absolute',
									opacity: item.id === 1 ? (page1Timer1 === index ? 1 : 0) : 1,
								}}
							>
								{image.key}
							</View>
						))}

						{/* <View
							style={[
								styles.illustrationBackground,
								{backgroundColor: item.primaryColor + '20'},
							]}
						>
							<Text style={styles.illustration}>{item.illustration}</Text>
							<View
								style={[
									styles.decorativeCircle,
									styles.circle1,
									{backgroundColor: item.primaryColor},
								]}
							/>
							<View
								style={[
									styles.decorativeCircle,
									styles.circle2,
									{backgroundColor: item.secondaryColor},
								]}
							/>
							<View
								style={[
									styles.decorativeCircle,
									styles.circle3,
									{backgroundColor: '#FF6B6B'},
								]}
							/>
						</View> */}
					</View>

					{/* Text Content */}
					<View style={styles.textContainer}>
						<Text
							style={styles.title}
							className="font-sora-bold text-4xl leading-normal"
						>
							{item.title}
						</Text>
						<Text
							style={styles.description}
							className="font-sora-regular text-md"
						>
							{item.description}
						</Text>
					</View>
				</View>
				<View style={styles.bottomSection}>
					{/* Page Indicators */}
					{renderDots()}

					{/* Buttons */}
					<View style={styles.buttonContainer}>
						{onboardingData[onboardingData.length - 1].id === item.id ? (
							<>
								<TouchableOpacity
									style={styles.loginButton}
									onPress={handleLogin}
								>
									<Text
										style={styles.loginButtonText}
										className="font-sora-semibold text-base"
									>
										Login
									</Text>
								</TouchableOpacity>
								<AppButton
									onPress={handleCreateAccount}
									buttonText={'Create an account'}
								/>
							</>
						) : (
							<AppButton onPress={handleNext} />
						)}
					</View>
				</View>
			</View>

			{/* </View> */}
		</View>
	);

	return (
		<View style={styles.wrapper}>
			<StatusBar barStyle="light-content" backgroundColor="#0F1419" />

			{/* Main Content Area */}
			<View style={styles.mainContent}>
				<ScrollView
					ref={scrollViewRef}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					style={styles.scrollView}
					bounces={false}
				>
					{onboardingData.map((item, index) =>
						renderOnboardingItem(item, index)
					)}
				</ScrollView>
			</View>

			{/* Bottom Section with Dots and Buttons */}
		</View>
	);
};

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
		opacity: 0.2,
		position: 'absolute',
	},
	bgImage2: {
		width: screenWidth,
		height: screenHeight,
		flex: 1,
		opacity: 0.5,
		// zIndex: 10,
		position: 'absolute',
	},
	slide: {
		width: screenWidth,
		height: screenHeight,
		flex: 1,
		position: 'relative',
		zIndex: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	gradient: {
		flex: 1,
		width: screenWidth,
		height: screenHeight,
		opacity: 0.1,
		position: 'absolute',
	},
	header: {
		alignItems: 'center',
		marginBottom: 40,
	},
	headerText: {
		color: '#8B949E',
		fontSize: 14,
		marginBottom: 20,
	},
	logo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logoText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	content: {
		flex: 1,
		justifyContent: 'center',
	},
	illustrationContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// marginVertical: 40,
		overflow: 'hidden',
	},
	illustrationBackground: {
		width: 200,
		height: 200,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	illustration: {
		fontSize: 60,
		zIndex: 1,
	},
	decorativeCircle: {
		position: 'absolute',
		width: 12,
		height: 12,
		borderRadius: 6,
	},
	circle1: {
		top: 30,
		right: 40,
	},
	circle2: {
		bottom: 50,
		left: 20,
	},
	circle3: {
		top: 60,
		left: 30,
	},
	textContainer: {
		alignItems: 'center',
		marginBottom: 40,
		maxWidth: '80%',
	},
	title: {
		color: '#FFFFFF',
		textAlign: 'center',
		marginBottom: 16,
	},
	description: {
		color: '#FFFFFF',
		textAlign: 'center',
		lineHeight: 24,
		paddingHorizontal: 20,
	},
	bottomSection: {
		paddingHorizontal: 24,
		paddingBottom: 50,
		width: '100%',
	},
	dotsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 40,
	},
	dot: {
		height: 6,
		borderRadius: 4,
		marginHorizontal: 4,
	},
	buttonContainer: {
		gap: 16,
	},
	primaryButton: {
		backgroundColor: '#FFFFFF',
		paddingVertical: 20,
		borderRadius: 40,
		alignItems: 'center',
	},
	primaryButtonText: {
		color: '#1E1E1E',
	},
	loginButton: {
		backgroundColor: 'transparent',
		paddingVertical: 20,
		borderRadius: 40,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#FFFFFF',
	},
	loginButtonText: {
		color: '#FFFFFF',
	},
});

export default OnboardingCarousel;
