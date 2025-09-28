import Ionicons from '@expo/vector-icons/Ionicons';
import {router} from 'expo-router';
import React from 'react';
import {TouchableOpacity} from 'react-native';

interface BackProps {
	onPress?: () => void;
	size?: number;
}

const Back = ({onPress, size}: BackProps) => {
	return (
		<TouchableOpacity
			className={`bg-white ${size ? '' : 'w-10 h-10'} rounded-full flex justify-center items-center`}
			style={
				size
					? {
							width: size,
							height: size,
						}
					: null
			}
			onPress={() => (onPress ? onPress() : router.back())}
		>
			<Ionicons name="arrow-back" size={24} color="black" />
		</TouchableOpacity>
	);
};

export default Back;
