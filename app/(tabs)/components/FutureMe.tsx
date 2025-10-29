import LetterIcon from '@/assets/icons/letter';
import {SCREEN_HEIGHT} from '@/constants';
import {getFutureSelf} from '@/services/apis/user';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useQuery} from '@tanstack/react-query';
import {Image} from 'expo-image';
import {router} from 'expo-router';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FutureMe = () => {
	const insets = useSafeAreaInsets();

	const {data: futureSelf, isPending} = useQuery({
		queryKey: ['future_self'],
		queryFn: getFutureSelf,
	});

	const futureMe = futureSelf?.data[0];
	const futurePic = futureMe?.attributes.transformed_image_url;

	return (
		<View
			className="absolute right-3 gap-3"
			style={{bottom: insets.bottom + SCREEN_HEIGHT * 0.2}}
		>
			<TouchableOpacity
				onPress={() => router.push('/future/date-time')}
				className="bg-white w-20 h-20 rounded-full flex justify-center items-center"
			>
				<LetterIcon />
			</TouchableOpacity>

			{!isPending && (
				<TouchableOpacity
					onPress={() =>
						router.push(futureMe ? `/future/dashboard` : '/future/welcome')
					}
					className="items-center gap-y-2 w-20 h-20"
				>
					<Image
						source={
							futurePic
								? {uri: futurePic}
								: require('../../../assets/images/futureme-welcome-bg.png')
						}
						style={{
							width: 80,
							height: 80,
							borderRadius: 80,
							borderColor: '#FFFFFF',
							borderWidth: 1,
						}}
					/>
					<View className="bg-[#5F1D9C] px-2 py-1 rounded-full flex-row items-center gap-x-1">
						<Text className="text-white font-sora-semibold text-xs">
							Future me
						</Text>
						<FontAwesome6 name="arrow-right-long" size={10} color="white" />
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default FutureMe;
