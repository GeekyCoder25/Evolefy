import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {getRoadMap, RoadmapStepsResponse} from '@/services/apis/roadmap';
import {getUserProfile} from '@/services/apis/user';
import {useQuery} from '@tanstack/react-query';
import {Image} from 'expo-image';
import React, {useEffect, useRef} from 'react';
import {
	Animated,
	Dimensions,
	Easing,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import FutureMe from './components/FutureMe';
import Header from './components/Header';

const {width: screenWidth} = Dimensions.get('window');

const ProgressPath = () => {
	const {setUser} = useGlobalStore();
	const insets = useSafeAreaInsets();

	const pulseAnim = useRef(new Animated.Value(1)).current;
	// Start pulsing animation
	useEffect(() => {
		const startPulsing = () => {
			Animated.loop(
				Animated.sequence([
					Animated.timing(pulseAnim, {
						toValue: 1.1,
						duration: 2000,
						easing: Easing.inOut(Easing.ease),
						useNativeDriver: true,
					}),
					Animated.timing(pulseAnim, {
						toValue: 1,
						duration: 2000,
						easing: Easing.inOut(Easing.ease),
						useNativeDriver: true,
					}),
				])
			).start();
		};

		startPulsing();
	}, [pulseAnim]);

	const {data} = useQuery({
		queryKey: ['user'],
		queryFn: getUserProfile,
	});

	useEffect(() => {
		if (data) {
			setUser({...data.data.attributes, id: data.data.id});
		}
	}, [data, setUser]);

	const {data: roadmap} = useQuery({
		queryKey: ['roadmap'],
		queryFn: getRoadMap,
		gcTime: Infinity,
	});

	const verticalSpacing = 180; // Space between each level
	const stepsPerLevel = 1; // How many steps per level (adjust as needed)

	const generateLevelsFromRoadmap = (
		roadmapData: RoadmapStepsResponse | undefined
	) => {
		if (!roadmapData?.data) return [];

		const steps = roadmapData.data;
		const levels = [];

		// Calculate completed steps
		const completedSteps = steps.filter(
			step => step.status === 'completed'
		).length;
		const inProgressSteps = steps.filter(
			step => step.status === 'in_progress'
		).length;

		// Calculate level progression
		const completedLevels = Math.floor(completedSteps / stepsPerLevel);
		const currentLevel = completedLevels + (inProgressSteps > 0 ? 1 : 0);
		const totalLevels = Math.ceil(steps.length / stepsPerLevel);

		for (let i = totalLevels; i >= 1; i--) {
			// Get steps for this level
			const levelSteps = steps.slice(
				(i - 1) * stepsPerLevel,
				i * stepsPerLevel
			);
			const levelCompletedSteps = levelSteps.filter(
				step => step.status === 'completed'
			).length;
			// const levelInProgressSteps = levelSteps.filter(
			// 	step => step.status === 'in_progress'
			// ).length;

			levels.push({
				id: i,
				goalId: steps[i - 1].id,
				completed: i < currentLevel, // Fully completed levels
				current: i === currentLevel, // Current level being worked on
				locked: i > currentLevel, // Future levels
				y: (totalLevels - i + 1) * verticalSpacing, // Vertical positioning
				steps: levelSteps, // Associated roadmap steps
				completedStepsCount: levelCompletedSteps,
				totalStepsCount: levelSteps.length,
				// Calculate progress percentage for current level
				progress:
					i === currentLevel
						? Math.round((levelCompletedSteps / levelSteps.length) * 100)
						: i < currentLevel
							? 100
							: 0,
			});
		}

		return levels;
	};

	// Alternative: Use step numbers directly as levels
	// const generateLevelsFromStepNumbers = (
	// 	roadmapData: RoadmapStepsResponse | undefined
	// ) => {
	// 	if (!roadmapData?.data) return [];

	// 	const steps = roadmapData.data;
	// 	const levels = [];

	// 	// Find current progress
	// 	const completedSteps = steps.filter(step => step.status === 'completed');
	// 	const inProgressStep = steps.find(step => step.status === 'in_progress');

	// 	const maxCompletedLevel =
	// 		completedSteps.length > 0
	// 			? Math.max(...completedSteps.map(step => step.step_number))
	// 			: 0;
	// 	const currentLevel = inProgressStep?.step_number || maxCompletedLevel + 1;

	// 	// Generate levels based on step numbers
	// 	for (let i = steps.length; i >= 1; i--) {
	// 		const step = steps.find(s => s.step_number === i);

	// 		levels.push({
	// 			id: i,
	// 			completed: i <= maxCompletedLevel,
	// 			current: i === currentLevel,
	// 			locked: i > currentLevel,
	// 			y: (steps.length - i + 1) * verticalSpacing,
	// 			step: step, // Associated roadmap step
	// 			progress:
	// 				i === currentLevel && inProgressStep
	// 					? 50
	// 					: i <= maxCompletedLevel
	// 						? 100
	// 						: 0,
	// 		});
	// 	}

	// 	return levels;
	// };

	// Usage
	const levels = generateLevelsFromRoadmap(roadmap);

	// Or if you want to use step numbers as levels directly:
	// const levels = generateLevelsFromStepNumbers(roadmap);

	// You can also add current level progress from external state
	const currentLevelProgress = 0; // From your component state or props
	// const levelsWithProgress = levels.map(level => ({
	// 	...level,
	// 	progress: level.current ? currentLevelProgress : level.progress,
	// }));

	// Calculate x positions to create the winding path
	const getXPosition = (index: number) => {
		const centerX = screenWidth / 2.3;
		const amplitude = screenWidth * 0.3; // How far left/right the path goes
		const frequency = 0.9; // How often it switches sides

		return centerX + Math.sin(index * frequency) * amplitude;
	};

	// Create the curved path between points

	const totalHeight = levels.length * verticalSpacing + 200;

	const createPathSegments = () => {
		if (levels.length < 2) return [];

		const segments = [];

		for (let i = 0; i < levels.length - 1; i++) {
			const currentLevel = levels[i];
			const nextLevel = levels[i + 1];

			const currentX = getXPosition(i);
			const currentY = currentLevel.y;
			const nextX = getXPosition(i + 1);
			const nextY = nextLevel.y;

			// Control points for smooth curve
			const cp1x = currentX;
			const cp1y = currentY + (nextY - currentY) * 0.5;
			const cp2x = nextX;
			const cp2y = nextY - (nextY - currentY) * 0.5;

			const pathData = `M ${currentX} ${currentY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`;

			// Path uses gradient if the CURRENT level is completed
			let color;
			if (currentLevel.completed || currentLevel.current) {
				color = 'url(#activeGradient)';
			} else if (nextLevel.current) {
				// For current level, show progress gradient
				color = 'url(#progressGradient)';
			} else {
				color = '#919191';
			}

			segments.push({
				path: pathData,
				color: color,
			});
		}

		return segments;
	};

	return (
		<View
			className="flex-1 bg-background"
			style={{marginBottom: insets.bottom + 10}}
		>
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<Header title="My journey" />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{minHeight: totalHeight}}
				ref={scrollViewRef => {
					if (scrollViewRef) {
						setTimeout(() => {
							// Find current level or last completed
							const targetLevel =
								levels.find(level => level.current) ||
								levels.filter(level => level.completed).pop() ||
								levels[0];
							if (!targetLevel) return;
							// Scroll to center this level on screen
							const scrollToY =
								targetLevel.y - Dimensions.get('window').height / 3;

							scrollViewRef.scrollTo({
								y: Math.max(0, scrollToY),
								animated: false,
							});
						}, 100);
					}
				}}
			>
				{/* The connecting path */}
				<Svg width={screenWidth} height={totalHeight} className="absolute">
					<Defs>
						<LinearGradient
							id="activeGradient"
							x1="0%"
							y1="0%"
							x2="0%"
							y2="100%"
						>
							<Stop offset="0%" stopColor="#00CCFF" />
							<Stop offset="100%" stopColor="#1520A6" />
						</LinearGradient>

						<LinearGradient
							id="progressGradient"
							x1="0%"
							y1="100%"
							x2="0%"
							y2="0%"
						>
							<Stop offset="0%" stopColor="#1520A6" />
							<Stop offset={`${currentLevelProgress}%`} stopColor="#00CCFF" />
							<Stop offset={`${currentLevelProgress}%`} stopColor="#919191" />
							<Stop offset="100%" stopColor="#919191" />
						</LinearGradient>
					</Defs>
					{createPathSegments().map((segment, index) => (
						<Path
							key={index}
							d={segment.path}
							stroke={segment.color}
							strokeWidth="50"
							fill="none"
							strokeLinecap="round"
						/>
					))}
				</Svg>

				{/* Level nodes */}
				{levels.map((level, index) => {
					const x = getXPosition(index);

					return (
						<View
							key={level.id}
							className="absolute"
							style={{
								left: x - 40,
								top: level.y - 40,
							}}
							// disabled={level.locked}
							// onPress={() =>
							// 	router.push(`/goal/view?roadmapId=${level.goalId}`)
							// }
						>
							{level.completed && (
								<Animated.View
									className="absolute w-24 h-24 rounded-full border-4 "
									style={{
										width: 75,
										height: 75,
										left: -2,
										top: -2,
										opacity: 0.8,
										borderColor: '#008B58',
										transform: [{scale: pulseAnim}],
									}}
								/>
							)}
							<View
								className="w-20 h-20 rounded-full items-center justify-center"
								style={{
									backgroundColor: level.completed
										? '#008B58'
										: level.current
											? '#80E7C1'
											: '#919191',
									filter: 'contrast(1.1) brightness(0.95)',
								}}
							>
								{/* Overlay div for noise texture */}
								<View
									className="absolute inset-0 w-20 h-20 rounded-full"
									style={{
										backgroundColor: 'transparent',
										backgroundImage: `
                                                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                                    radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 0%, transparent 50%),
                                                    radial-gradient(circle at 75% 25%, rgba(255,255,255,0.05) 0%, transparent 50%),
                                                    radial-gradient(circle at 25% 75%, rgba(0,0,0,0.05) 0%, transparent 50%)
                                                `,
										backgroundSize: '4px 4px, 6px 6px, 3px 3px, 5px 5px',
										opacity: 0.6,
									}}
								/>
								<Text
									className="text-white font-sora-bold"
									style={{fontSize: 48}}
								>
									{level.id}
								</Text>
							</View>

							{/* Circular progress for current level */}
							{level.current && (
								<View className="absolute z-10">
									<Svg width="150" height="150">
										{/* Progress circle */}
										<Circle
											cx="60"
											cy="35"
											r="35"
											stroke="#007E4F"
											strokeWidth="5"
											fill="none"
											strokeDasharray={`${2 * Math.PI * 42}`}
											strokeDashoffset={`${2 * Math.PI * 42 * (1 - level.progress / 100)}`}
											strokeLinecap="round"
											transform="rotate(-90 48 48)"
										/>
									</Svg>
								</View>
							)}
						</View>
					);
				})}
			</ScrollView>
			<FutureMe />
		</View>
	);
};

export default ProgressPath;

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
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
});
