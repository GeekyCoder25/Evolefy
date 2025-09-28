import Back from '@/app/components/ui/back';
import LogoIcon from '@/assets/icons/logo';
import {router} from 'expo-router';
import React from 'react';
import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface AuthHeaderProps {
	title: string;
	subTitle: string;
}

const AuthHeader = ({title, subTitle}: AuthHeaderProps) => {
	const insets = useSafeAreaInsets();

	return (
		<View className="">
			<View style={{paddingTop: insets.top + 20}} />
			{router.canGoBack() && <Back />}
			<View className="flex-row justify-center items-center my-10">
				<LogoIcon />
				<Text className="text-white font-sora-bold text-6xl leading-loose">
					EVOLEFY
				</Text>
			</View>
			<View className="items-center gap-3 px-[10%] mb-10">
				<Text className="text-white font-sora-semibold text-2xl text-center">
					{title}
				</Text>
				<Text className="text-[#AEAEAE] font-sora-regular text-sm text-center">
					{subTitle}
				</Text>
			</View>
		</View>
	);
};

export default AuthHeader;
