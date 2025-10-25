import UploadIcon from '@/assets/icons/upload';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {postFutureSelf} from '@/services/apis/user';
import {Ionicons} from '@expo/vector-icons';
import {useQueryClient} from '@tanstack/react-query';
import {isAxiosError} from 'axios';
import {Image, ImageBackground} from 'expo-image';
import {launchImageLibraryAsync} from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppButton from '../components/ui/button';

const Upload = () => {
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const [photos, setPhotos] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const handlePickImage = async () => {
		const response = await launchImageLibraryAsync({
			quality: 0.1,
			aspect: [1, 1],
			allowsMultipleSelection: true,
		});
		if (response.assets && response.assets.length > 0) {
			const capturedAsset = response.assets.map(asset => asset.uri);
			setPhotos(capturedAsset);
		}
	};

	const handleSubmit = async () => {
		if (photos.length === 0) {
			alert('Please select at least one photo.');
			return;
		}
		try {
			setIsUploading(true);
			const formDataToSend = new FormData();
			const uriParts = photos[0].split('/');
			const filename = uriParts[uriParts.length - 1];

			let fileType = 'image/png';

			if (filename.toLowerCase().endsWith('.png')) {
				fileType = 'image/png';
			} else if (filename.toLowerCase().endsWith('.gif')) {
				fileType = 'image/gif';
			} else if (filename.toLowerCase().endsWith('.heic')) {
				fileType = 'image/heic';
			} else if (filename.toLowerCase().endsWith('.webp')) {
				fileType = 'image/webp';
			}

			if (filename.toLowerCase().endsWith('.png')) {
				fileType = 'image/png';
			} else if (filename.toLowerCase().endsWith('.gif')) {
				fileType = 'image/gif';
			} else if (filename.toLowerCase().endsWith('.heic')) {
				fileType = 'image/heic';
			} else if (filename.toLowerCase().endsWith('.webp')) {
				fileType = 'image/webp';
			}
			formDataToSend.append('image', {
				uri: photos[0],
				name: filename,
				type: fileType,
			} as any);
			// formDataToSend.append('future_date', date as string);
			// formDataToSend.append('future_time', time as string);
			// formDataToSend.append('message_to_future_self', letter as string);

			const response = await postFutureSelf(formDataToSend);
			if (response.data) {
				await queryClient.invalidateQueries({queryKey: ['future_self']});
				router.dismissTo('/(tabs)');
			}
			// Replace with your upload endpoint
		} catch (error) {
			console.error('Upload failed:', error);
			Toast.show({
				type: 'error',
				text1: 'Upload Failed',
				text2: isAxiosError(error)
					? error.response?.data?.message || error.message
					: 'Upload failed. Please try again.',
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<View className="flex-1">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<LinearGradient colors={['#00CCFF', '#1520A6']} style={styles.gradient} />
			<ImageBackground source={require('../../assets/images/noise-bg.png')}>
				<View style={{paddingTop: insets.top}} />
			</ImageBackground>

			{/* Main Content Area */}
			<View className="flex-1 px-[5%] py-10">
				<TouchableOpacity
					className={`bg-white w-10 h-10 rounded-full flex justify-center items-center`}
					onPress={router.back}
				>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text className="text-white font-sora-semibold mt-5 mb-20 text-3xl leading-relaxed">
					Please upload a picture of yourself
				</Text>
				<View className="flex-1 items-center">
					<TouchableOpacity
						onPress={handlePickImage}
						className={`border border-white justify-center items-center ${photos.length ? '' : 'px-20 py-10'} rounded-3xl overflow-hidden`}
					>
						{photos.length ? (
							<Image
								style={{width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8}}
								source={{uri: photos[0]}}
							/>
						) : (
							<>
								<UploadIcon />
								<Text className="text-white font-sora-semibold text-2xl mt-3 mb-2">
									Upload a picture
								</Text>
								<Text className="text-white font-sora-light text-sm leading-relaxed">
									Please select at least two.
								</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
				<AppButton
					onPress={handleSubmit}
					loading={isUploading}
					disabled={!photos.length || isUploading}
				/>
			</View>
		</View>
	);
};

export default Upload;

const styles = StyleSheet.create({
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
	gradient: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		opacity: 0.1,
		position: 'absolute',
	},
});
