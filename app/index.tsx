import Logo from '@/assets/icons/logo';
import {ACCESS_TOKEN_KEY, HAS_ONBOARDED, LAST_LOGIN} from '@/constants';
import {Colors} from '@/constants/Colors';
import {useGlobalStore} from '@/context/store';
import {getUserProfile} from '@/services/apis/user';
import {MemoryStorage} from '@/utils/storage';
import {useQuery} from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import {router} from 'expo-router';
import React, {useEffect, useRef} from 'react';
import {
	Animated,
	Dimensions,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';

const {width} = Dimensions.get('window');

const SplashScreen = () => {
	const logoOpacity = useRef(new Animated.Value(0)).current;
	const logoScale = useRef(new Animated.Value(0.2)).current;
	const logoTranslateX = useRef(new Animated.Value(0)).current;
	const logoTranslateY = useRef(new Animated.Value(0)).current;
	const textOpacity = useRef(new Animated.Value(0)).current;
	const textScale = useRef(new Animated.Value(1)).current;
	const consumingScale = useRef(new Animated.Value(1)).current;
	const finalScale = useRef(new Animated.Value(1)).current;
	const {setUser} = useGlobalStore();

	const {data} = useQuery({
		queryKey: ['user'],
		queryFn: getUserProfile,
	});

	useEffect(() => {
		if (data) {
			setUser({...data.data.attributes, id: data.data.id});
			const storage = new MemoryStorage();
			if (data.data.attributes.has_completed_onboarding) {
				storage.setItem(HAS_ONBOARDED, 'true');
			} else {
				storage.removeItem(HAS_ONBOARDED);
			}
		}
	}, [data, setUser]);

	useEffect(() => {
		const animateSequence = () => {
			// Step 1: Logo and text fade in at their initial positions
			Animated.parallel([
				Animated.timing(logoOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.spring(logoScale, {
					toValue: 1,
					tension: 50,
					friction: 5,
					useNativeDriver: true,
				}),
				Animated.timing(textOpacity, {
					toValue: 1,
					duration: 400,
					delay: 300,
					useNativeDriver: true,
				}),
			]).start(() => {
				// Step 2: Logo moves left
				Animated.timing(logoTranslateX, {
					toValue: -width * 0.4, // Move left
					duration: 100,
					useNativeDriver: true,
				}).start(() => {
					// Step 3: Logo moves down to text level
					Animated.timing(logoTranslateY, {
						toValue: 60, // Move down to text level
						duration: 250,
						useNativeDriver: true,
					}).start(() => {
						// Step 4: Logo moves right slightly while growing and "consuming" the text
						Animated.parallel([
							Animated.timing(logoTranslateX, {
								toValue: width * 0.01, // Move right only to 50% of screen (15% from center)
								duration: 400,
								useNativeDriver: true,
							}),
							// Logo grows as it "consumes" the text
							Animated.timing(consumingScale, {
								toValue: 2, // Grows as it eats the text
								duration: 400,
								useNativeDriver: true,
							}),
							// Text disappears as logo "eats" it
							Animated.timing(textOpacity, {
								toValue: 0,
								duration: 400,
								delay: 100,
								useNativeDriver: true,
							}),
							// Text scales down as it gets "consumed"
							Animated.timing(textScale, {
								toValue: 0.1,
								duration: 400,
								delay: 100,
								useNativeDriver: true,
							}),
						]).start(() => {
							// Step 5: Logo returns to center and scales up even more dramatically
							Animated.parallel([
								Animated.spring(logoTranslateX, {
									toValue: 0,
									tension: 40,
									friction: 6,
									useNativeDriver: true,
								}),
								// Animated.spring(logoTranslateY, {
								// 	toValue: 0,
								// 	tension: 40,
								// 	friction: 6,
								// 	useNativeDriver: true,
								// }),
								// Final dramatic scale up (building on the consuming scale)
								Animated.timing(finalScale, {
									toValue: 5, // Even bigger final scale since it "ate" the text
									duration: 500,
									// tension: 30,
									// friction: 4,
									// delay: 200,
									useNativeDriver: true,
								}),
							]).start();
							setTimeout(() => {
								if (onAnimationComplete) {
									onAnimationComplete();
								}
							}, 500);
						});
					});
				}); // Wait 1 second after initial appearance
			});
		};

		animateSequence();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onAnimationComplete = async () => {
		const storage = new MemoryStorage();
		const token = await storage.getItem(ACCESS_TOKEN_KEY);
		const lastLogin = await storage.getItem(LAST_LOGIN);
		const hasOnboarded = await storage.getItem(HAS_ONBOARDED);
		if (lastLogin) {
			if (token) {
				if (hasOnboarded === 'true') router.replace('/(tabs)');
				else {
					const {status} = await Notifications.getPermissionsAsync();
					if (status === 'granted') router.replace('/welcome/message');
					else router.replace('/auth/enable-push');
				}
			} else router.replace('/auth/login');
		} else {
			router.replace('/onboarding');
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

			<View style={styles.content}>
				{/* Logo Container */}
				<Animated.View
					style={[
						styles.logoContainer,
						{
							opacity: logoOpacity,
							transform: [
								{translateX: logoTranslateX},
								{translateY: logoTranslateY},
								{
									scale: Animated.multiply(
										Animated.multiply(logoScale, consumingScale),
										finalScale
									),
								},
							],
						},
					]}
				>
					<View style={styles.logoWrapper}>
						<Logo />
					</View>
				</Animated.View>

				{/* Company Name - positioned below logo initially */}
				<Animated.View
					style={[
						styles.textContainer,
						{
							opacity: textOpacity,
							transform: [{scale: textScale}],
						},
					]}
				>
					<Text style={styles.companyName} className=" font-sora-bold text-7xl">
						EVOLEFY
					</Text>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.bg,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		flex: 1,
		marginTop: -100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoContainer: {
		position: 'absolute',
		zIndex: 10,
	},
	logoWrapper: {
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
		// Optional: Add background circle or styling
		backgroundColor: 'transparent',
		borderRadius: 50,
		// Uncomment below if you want a background circle
		// backgroundColor: '#16213e',
		// borderWidth: 3,
		// borderColor: '#0f3460',
		// shadowColor: '#e94560',
		// shadowOffset: { width: 0, height: 0 },
		// shadowOpacity: 0.8,
		// shadowRadius: 10,
		// elevation: 10,
	},
	logoImage: {
		width: 80,
		height: 80,
	},
	textContainer: {
		marginTop: 150, // Position below the logo initially
		zIndex: 5,
	},
	companyName: {
		color: '#ffffff',
		textAlign: 'center',
		textShadowOffset: {width: 0, height: 0},
	},
	pulseBackground: {
		position: 'absolute',
		width: 200,
		height: 200,
		borderRadius: 100,
		zIndex: 1,
	},
});

export default SplashScreen;
