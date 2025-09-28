import {Colors} from '@/constants/Colors';
import {useGlobalStore} from '@/context/store';
import {MaterialIcons} from '@expo/vector-icons';
import {Image} from 'expo-image';
import React from 'react';
import {View} from 'react-native';

const ProfilePicture = ({width = 40, height = 40}) => {
	const {user} = useGlobalStore();

	return user?.profile_picture ? (
		<Image
			source={{
				uri: user?.profile_picture,
			}}
			style={{
				width,
				height,
				borderRadius: width,
			}}
		/>
	) : (
		<View className="w-10 h-10 rounded-full bg-[#e4f5e5] flex items-center justify-center">
			<MaterialIcons name="person" size={30} color={Colors.secondary} />
		</View>
	);
};

export default ProfilePicture;
