import ConnectIcon from '@/assets/icons/connect';
import GoalIcon, {GoalActiveIcon} from '@/assets/icons/goal';
import HomeIcon, {HomeActiveIcon} from '@/assets/icons/home';
import JourneyIcon, {JourneyActiveIcon} from '@/assets/icons/journey';
import MoreIcon from '@/assets/icons/more';
import ProfileIcon, {ProfileActiveIcon} from '@/assets/icons/profile';
import {HapticTab} from '@/components/HapticTab';
import {HAS_OPENED_EVO} from '@/constants';
import {MemoryStorage} from '@/utils/storage';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Image} from 'expo-image';
import {router, Tabs} from 'expo-router';
import React from 'react';
import {Platform, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface TabConfig {
	name: string;
	title: string;
	icon: React.JSX.Element;
}

const storage = new MemoryStorage();
// Custom Tab Bar Component
const tabs: TabConfig[] = [
	{
		name: 'index',
		title: 'Home',
		icon: <HomeIcon />,
	},
	{
		name: 'journey',
		title: 'My journey',
		icon: <JourneyIcon />,
	},
	{
		name: 'goals',
		title: 'My goals',
		icon: <ConnectIcon />,
	},
	{
		name: 'more',
		title: 'Profile',
		icon: <MoreIcon />,
	},
];

const AiIcon: React.FC = () => (
	<>
		<TouchableOpacity
			onPress={() => router.push('/evo')}
			className="absolute top-[-30px] left-1/2 transform translate-x-1 w-20 h-20 rounded-full bg-background justify-center items-center border-3 border-background"
		>
			<Image
				source={require('../../assets/images/evoIcon.png')}
				style={{width: 50, height: 50}}
			/>
		</TouchableOpacity>
		<View className="absolute top-[-80px] left-0 right-0 flex-row justify-center items-center">
			{storage.getItem(HAS_OPENED_EVO).then(
				res =>
					!res && (
						<TouchableOpacity
							onPress={() => router.push('/evo')}
							className="rounded-full flex-row justify-center items-center gap-x-2 px-5 pb-1"
							style={{backgroundColor: 'rgba(232, 213, 249, 1)'}}
						>
							<Image
								source={require('../../assets/images/evoIcon.png')}
								style={{width: 50, height: 50}}
							/>
							<Text className="font-inter-bold mt-1">
								Hi, I’m Evo, Click here let’s chat
							</Text>
						</TouchableOpacity>
					)
			)}
		</View>
	</>
);

function CustomTabBar({state, descriptors, navigation}: BottomTabBarProps) {
	const insets = useSafeAreaInsets();
	return (
		<View
			className="absolute bg-background h-20 right-[3%] left-[3%] flex-row justify-between items-center px-10 rounded-3xl gap-5"
			style={{bottom: insets.bottom + (Platform.OS === 'ios' ? 0 : 10)}}
		>
			<AiIcon />
			{state.routes.map((route, index) => {
				const {options} = descriptors[route.key];

				// Find the tab configuration for this route
				const tabConfig = tabs.find(tab => tab.name === route.name);
				if (!tabConfig) return null; // Skip if no config found

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				const renderIcon = () => {
					switch (route.name) {
						case 'index':
							return isFocused ? <HomeActiveIcon /> : <HomeIcon />;
						case 'journey':
							return isFocused ? <JourneyActiveIcon /> : <JourneyIcon />;
						case 'goals':
							return isFocused ? <GoalActiveIcon /> : <GoalIcon />;
						case 'more':
							return isFocused ? <ProfileActiveIcon /> : <ProfileIcon />;
						default:
							return <HomeIcon />; // Fallback icon
					}
				};
				return (
					<Pressable
						key={route.key}
						accessibilityRole="button"
						accessibilityState={isFocused ? {selected: true} : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						onPress={onPress}
						onLongPress={onLongPress}
						className={`${index < 2 ? '-ml-16' : '-mr-16'} flex-1 items-center py-2`}
					>
						{renderIcon()}

						<Text
							className={`mt-1 text-xs text-center text-white font-sora-regular leading-tight ${
								isFocused ? 'opacity-100' : 'opacity-50'
							}`}
							numberOfLines={1}
							adjustsFontSizeToFit
						>
							{tabConfig.title}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

export default function TabLayout() {
	return (
		<Tabs
			tabBar={props => <CustomTabBar {...props} />}
			screenOptions={{
				headerShown: false,
				tabBarButton: HapticTab,
			}}
		>
			{tabs.map(tab => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						title: tab.title,
						tabBarAccessibilityLabel: `${tab.title} tab`,
					}}
				/>
			))}
		</Tabs>
	);
}
