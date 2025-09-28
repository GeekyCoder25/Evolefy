import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {useGlobalStore} from '@/context/store';
import {
	UpdateProfilePayload,
	updateUserProfile,
	uploadProfilePhoto,
} from '@/services/apis/user';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useMutation} from '@tanstack/react-query';
import {Image} from 'expo-image';
import {launchImageLibraryAsync} from 'expo-image-picker';
import {router} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import TextInput from '../components/ui/TextInput';
import AppButton from '../components/ui/button';
import Header from './components/Header';

const More = () => {
	const insets = useSafeAreaInsets();
	const {user, setUser} = useGlobalStore();
	const [formData, setFormData] = useState({
		fullname: user?.fullname || '',
		dob: user?.dob || '',
		email: user?.email || '',
		city: user?.city || '',
		profile_picture: user?.profile_picture || '',
	});
	const [age, setAge] = useState(
		`${
			new Date().getFullYear() -
			new Date(formData.dob || new Date()).getFullYear()
		}`
	);

	const [error, setError] = useState({
		fullname: '',
		dob: '',
		email: '',
		city: '',
		error: '',
	});
	const [hasChangesToUpdate, setHasChangesToUpdate] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [profilePhoto, setProfilePhoto] = useState('');

	useEffect(() => {
		setFormData({
			fullname: user?.fullname || '',
			dob: user?.dob || '',
			email: user?.email || '',
			city: user?.city || '',
			profile_picture: user?.profile_picture || '',
		});
	}, [
		user?.city,
		user?.dob,
		user?.email,
		user?.fullname,
		user?.profile_picture,
	]);

	useEffect(() => {
		if (age) {
			const currentYear = new Date().getFullYear();
			const birthYear = currentYear - parseInt(age, 10);
			const dob = new Date(birthYear, 1, 1).toISOString().split('T')[0];
			setFormData(prev => ({...prev, dob}));
		}
	}, [age]);

	useEffect(() => {
		setHasChangesToUpdate(
			formData.fullname !== user?.fullname ||
				formData.email !== user?.email ||
				formData.city !== user?.city ||
				formData.dob !== user?.dob ||
				formData.profile_picture !== user?.profile_picture
		);
	}, [
		formData.city,
		formData.dob,
		formData.email,
		formData.fullname,
		formData.profile_picture,
		user?.city,
		user?.dob,
		user?.email,
		user?.fullname,
		user?.profile_picture,
	]);

	const {mutate: updateMutation, isPending} = useMutation({
		mutationFn: updateUserProfile,
		onSuccess: response => {
			setUser({...response.data.attributes, id: response.data.id});
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Profile updated successfully',
			});
		},
		onError: (error: any) => {
			setError(error.response.data?.errors || {});
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
			setProfilePhoto(capturedAsset);
		}
	};

	useEffect(() => {
		if (age) {
			const currentYear = new Date().getFullYear();
			const birthYear = currentYear - parseInt(age, 10);
			const dob = new Date(birthYear, 1, 1).toISOString().split('T')[0];
			setFormData(prev => ({...prev, dob}));
		}
	}, [age]);

	const handleUpdate = async () => {
		let body: UpdateProfilePayload;
		const {profile_picture, ...updated} = formData;
		body = updated;

		if (profilePhoto) {
			try {
				setIsUploading(true);
				const formDataToSend = new FormData();
				const uriParts = profilePhoto.split('/');
				const filename = uriParts[uriParts.length - 1];

				let fileType = 'image/jpeg';

				if (filename.toLowerCase().endsWith('.png')) {
					fileType = 'image/png';
				} else if (filename.toLowerCase().endsWith('.gif')) {
					fileType = 'image/gif';
				} else if (filename.toLowerCase().endsWith('.heic')) {
					fileType = 'image/heic';
				} else if (filename.toLowerCase().endsWith('.webp')) {
					fileType = 'image/webp';
				}
				formDataToSend.append('profile_picture', {
					uri: profilePhoto,
					name: filename,
					type: fileType,
				} as any);

				await uploadProfilePhoto(formDataToSend);
				updateMutation(body);
			} catch (error: any) {
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2:
						error?.response?.data?.message ||
						error.message ||
						'Error updating profile',
				});
			} finally {
				setIsUploading(false);
			}
		}
	};

	return (
		<View className="flex-1 bg-background">
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<Header title="Profile" />

			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="flex-row ml-auto justify-end py-5 px-5 gap-3">
					{/* <TouchableOpacity onPress={() => router.push('/settings')}>
						<MaterialCommunityIcons
							name="view-dashboard"
							size={30}
							color="white"
						/>
					</TouchableOpacity> */}
					<TouchableOpacity onPress={() => router.push('/settings')}>
						<FontAwesome6 name="gear" size={30} color="white" />
					</TouchableOpacity>
				</View>
				<View className="items-center">
					<TouchableOpacity onPress={handlePickImage}>
						{formData?.profile_picture || profilePhoto ? (
							<Image
								source={{
									uri: profilePhoto || formData.profile_picture,
								}}
								style={{
									width: SCREEN_WIDTH * 0.3,
									height: SCREEN_WIDTH * 0.3,
									borderRadius: SCREEN_WIDTH * 0.3,
								}}
								contentFit="cover"
							/>
						) : (
							<View className="w-40 h-40 rounded-full bg-[#e4f5e5] flex items-center justify-center">
								<MaterialIcons
									name="person"
									size={110}
									color={Colors.secondary}
								/>
							</View>
						)}
					</TouchableOpacity>
					<Text className="text-white font-sora-bold text-2xl mt-5 mb-2">
						{user?.email}
					</Text>
					<Text className="text-white font-sora-regular">{user?.fullname}</Text>
					<View className="w-full my-10 px-10 pb-32 gap-3">
						<View className="">
							<TextInput
								placeholder="Name"
								placeholderTextColor={'grey'}
								onChangeText={text =>
									setFormData(prev => ({...prev, fullname: text}))
								}
								value={formData.fullname}
							/>
							<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
								{error.fullname}
							</Text>
						</View>
						<View className="">
							<TextInput
								placeholder="Email"
								placeholderTextColor={'grey'}
								inputMode="email"
								onChangeText={text =>
									setFormData(prev => ({...prev, email: text}))
								}
								value={formData.email}
							/>
							<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
								{error.email}
							</Text>
						</View>
						<View className="">
							<TextInput
								placeholder="Age"
								placeholderTextColor={'grey'}
								inputMode="decimal"
								onChangeText={setAge}
								value={age.toString()}
								maxLength={2}
							/>
							<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
								{error.dob}
							</Text>
						</View>
						<View className="">
							<TextInput
								placeholder="Location"
								placeholderTextColor={'grey'}
								inputMode="email"
								onChangeText={text =>
									setFormData(prev => ({...prev, city: text}))
								}
								value={formData.city}
							/>
							<Text className="text-red-500 text-sm font-sora-regular mt-1 ml-2">
								{error.city}
							</Text>
						</View>
						{hasChangesToUpdate && (
							<AppButton
								onPress={handleUpdate}
								buttonText="Update"
								className="mt-10"
								style={{marginBottom: insets.bottom + 120}}
								loading={isPending || isUploading}
							/>
						)}
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default More;

const styles = StyleSheet.create({
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
});
