import {Ionicons} from '@expo/vector-icons';
import dayjs from 'dayjs';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

interface WeekStripProps {
	selectedDate: Date;
	setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const WeekStrip = ({selectedDate, setSelectedDate}: WeekStripProps) => {
	const [currentDate, setCurrentDate] = useState(dayjs());

	// Generate 7-day window with current day at center
	const daysToShow = Array.from({length: 7}, (_, i) =>
		currentDate.add(i - 3, 'day')
	);

	// Calendar setup
	const currentMonth = currentDate.month();
	const currentYear = currentDate.year();
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return (
		<View className="pt-8 pb-3">
			<LinearGradient
				colors={['#00CCFF', '#1520A6']}
				start={{x: 0, y: 0}}
				end={{x: 1, y: 0.4}}
				style={{borderRadius: 8}}
			>
				<View className="flex-row items-center justify-between p-2">
					<TouchableOpacity
						onPress={() => setCurrentDate(currentDate.subtract(7, 'day'))}
					>
						<Ionicons name="chevron-back" size={20} color="white" />
					</TouchableOpacity>
					<Text className="text-white font-inter-semibold text-lg">
						{monthNames[currentMonth]} {currentYear}
					</Text>
					<TouchableOpacity
						onPress={() => setCurrentDate(currentDate.add(7, 'day'))}
					>
						<Ionicons name="chevron-forward" size={20} color="white" />
					</TouchableOpacity>
				</View>
			</LinearGradient>
			<View className="flex-row items-center justify-between mt-5 bg-[#2E0E4B] px-2 py-4 rounded-lg">
				{/* Days */}
				<View className="flex-row flex-1 justify-around">
					{daysToShow.map((day, index) => {
						const isToday = day.isSame(dayjs(), 'day');
						return (
							<View key={index} className="items-center">
								<Text className="text-blue-200 font-inter-medium text-xs mb-2">
									{day.format('ddd')} {/* Mon, Tue... */}
								</Text>
								<TouchableOpacity
									className={`w-8 h-8 rounded-full items-center justify-center ${
										isToday ? 'bg-white' : ''
									}`}
								>
									<Text
										className={`font-inter-semibold ${
											isToday ? 'text-blue-600' : 'text-white'
										}`}
									>
										{day.format('D')}
									</Text>
								</TouchableOpacity>
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
};

export default WeekStrip;
