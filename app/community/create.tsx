import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {createCommunity} from '@/services/apis/community';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Image} from 'expo-image';
import {launchImageLibraryAsync} from 'expo-image-picker';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Header from '../(tabs)/components/Header';
import AppButton from '../components/ui/button';
import CustomSwitch from '../components/ui/CustomSwitch';
import TextInput from '../components/ui/TextInput';

const CreateCommunity = () => {
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		isPublic: false,
		photo: '',
	});
	const [error, setError] = useState({
		name: '',
		description: '',
		error: '',
	});

	const {mutate: createMutate, isPending} = useMutation({
		mutationFn: createCommunity,
		onSuccess: response => {
			queryClient.invalidateQueries({queryKey: ['communities']});
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Community created successfully',
			});
			router.back();
		},
		onError: (error: any) => {
			setError(
				error.response?.data?.errors || {
					error:
						error.response?.data.error ||
						error.response?.data?.message ||
						'Network error',
				}
			);
		},
	});

	const handlePickImage = async () => {
		const response = await launchImageLibraryAsync({
			allowsEditing: true,
			quality: 0.1,
			aspect: [1, 1],
		});
		if (response.assets && response.assets.length > 0) {
			const capturedAsset = response.assets[0].uri;
			setFormData(prev => ({
				...prev,
				profile_picture: capturedAsset,
			}));
			setFormData(prev => ({...prev, photo: capturedAsset}));
		}
	};

	return (
		<View className="flex-1 bg-background">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<Header title="Create a community" showBack />

			<View
				className="w-full px-[5%] gap-3 flex-1"
				style={{marginBottom: insets.bottom + 20}}
			>
				<ScrollView className="flex-1 py-5">
					<View className="">
						<TextInput
							placeholder="Name"
							placeholderTextColor={'grey'}
							onChangeText={text =>
								setFormData(prev => ({...prev, name: text}))
							}
							value={formData.name}
						/>
						<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
							{error.name}
						</Text>
					</View>
					<View className="">
						<TextInput
							placeholder="Description"
							placeholderTextColor={'grey'}
							onChangeText={text =>
								setFormData(prev => ({...prev, description: text}))
							}
							value={formData.description}
						/>
						<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
							{error.description}
						</Text>
					</View>
					<View className="flex-row items-center py-5">
						<View className="flex-1 gap-y-1 pr-4">
							<Text className="text-white font-inter-semibold text-lg">
								Only members see chat
							</Text>
							<Text className="text-gray-300 font-inter-regular text-sm leading-5">
								Non members can&apos;t view chats in the message
							</Text>
						</View>

						<CustomSwitch
							value={!formData.isPublic}
							onValueChange={value =>
								setFormData(prev => ({...prev, isPublic: !value}))
							}
						/>
					</View>
					<View className="flex-row items-center py-5">
						<View className="flex-1 gap-y-1 pr-4">
							<TouchableOpacity onPress={handlePickImage}>
								<View className="flex-row items-center gap-10 mb-10">
									<Text className="text-white font-inter-semibold text-lg">
										Select cover photo (optional)
									</Text>
									<FontAwesome6
										name="people-group"
										size={24}
										color={Colors.secondary}
									/>
								</View>
								<View>
									{formData.photo && (
										<Image
											source={{
												uri: formData.photo,
											}}
											style={{
												width: SCREEN_WIDTH * 0.5,
												height: SCREEN_WIDTH * 0.5,
												borderRadius: 10,
											}}
											contentFit="cover"
										/>
									)}
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
						{error.error}
					</Text>
				</ScrollView>
				<AppButton
					onPress={() =>
						createMutate({
							name: formData.name,
							description: formData.description,
							isPublic: formData.isPublic ? 1 : 0,
							category: formData.name.split(' ')[0],
							cover_image: formData.photo,
						})
					}
					loading={isPending}
					disabled={isPending || !formData.name || !formData.description}
					buttonText="Create"
				/>
			</View>
		</View>
	);
};

export default CreateCommunity;

const styles = StyleSheet.create({
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
});
