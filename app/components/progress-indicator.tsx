import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {Text, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import GradientText from './ui/gradient-text';

interface ProgressIndicatorProps {
	currentStep: number;
	totalSteps: number;
	maxWidth?: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
	currentStep,
	totalSteps,
	maxWidth,
}) => {
	// calculate fill percentage
	const progress = (currentStep / totalSteps) * 100;

	return (
		<View className="flex-row items-center mb-8">
			{/* Progress Dots */}
			<View
				className="flex-1 flex-row justify-center space-x-2 mr-auto"
				style={{maxWidth}}
			>
				{Array.from({length: totalSteps}, (_, index) => (
					<LinearGradient
						colors={
							index < currentStep
								? ['#00CCFF', '#00CCFF', '#1520A6']
								: ['#FFFFFF', '#FFFFFF']
						}
						start={{x: 0, y: 0}}
						end={{x: 1, y: 0}}
						key={index}
						style={{
							flex: 1,
							height: 5,
							marginHorizontal: 8,
							borderRadius: 20,
						}}
					/>
				))}
			</View>

			{/* Circular Progress */}
			<View className="ml-5">
				<AnimatedCircularProgress
					size={40}
					width={3}
					fill={progress} // ✅ Progress percentage
					tintColor="#00CCFF"
					backgroundColor="#FFFFFF"
					duration={500}
					rotation={0}
					lineCap="round"
				>
					{() => (
						<View className="flex-row justify-center items-end ">
							<GradientText
								text={currentStep}
								colors={['#00CCFF', '#00CCFF', '#1520A6']}
								className="text-xl font-sora-semibold"
							/>
							<GradientText
								text={'/'}
								colors={['#00CCFF', '#00CCFF', '#1520A6']}
								className="text-base font-sora-semibold"
							/>
							<Text className="text-white font-sora-semibold text-base">
								{totalSteps}
							</Text>
						</View>
					)}
				</AnimatedCircularProgress>
			</View>
		</View>
	);
};

export default ProgressIndicator;
