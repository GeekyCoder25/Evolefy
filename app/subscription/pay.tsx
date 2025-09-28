import {useQueryClient} from '@tanstack/react-query';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView, {WebViewNavigation} from 'react-native-webview';
import Back from '../components/ui/back';

const Pay = () => {
	const {uri}: {uri: string} = useLocalSearchParams();
	const queryClient = useQueryClient();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const onNavigationStateChange = (webNavigation: WebViewNavigation) => {
		console.log(webNavigation.url);
		// Example: Show success modal if payment success detected in URL
		if (webNavigation.url.includes('callback?')) {
			setShowSuccessModal(true);
			queryClient.invalidateQueries({queryKey: ['subscription_plans']});
			queryClient.invalidateQueries({queryKey: ['current_plan']});
		}
	};

	const handleBackPress = () => {
		setShowModal(true);
	};

	const handleConfirmCancel = () => {
		setShowModal(false);
		router.back();
	};

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleSuccessClose = () => {
		setShowSuccessModal(false);
		router.back();
	};

	return (
		<View
			className="flex-1 bg-white"
			style={{paddingTop: insets.top, paddingBottom: insets.bottom}}
		>
			<View className="px-[5%] py-5">
				<Back onPress={handleBackPress} />
			</View>
			<WebView
				source={{uri}}
				onNavigationStateChange={onNavigationStateChange}
			/>
			{/* Cancel Modal */}
			<Modal
				visible={showModal}
				transparent
				animationType="fade"
				onRequestClose={handleCancel}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0,0.4)',
					}}
				>
					<View
						style={{
							backgroundColor: 'white',
							borderRadius: 10,
							padding: 24,
							width: '80%',
							alignItems: 'center',
						}}
					>
						<Text style={{fontSize: 18, marginBottom: 16, textAlign: 'center'}}>
							Are you sure you want to cancel the payment?
						</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
							}}
						>
							<TouchableOpacity
								onPress={handleCancel}
								style={{
									flex: 1,
									padding: 12,
									marginRight: 8,
									backgroundColor: '#eee',
									borderRadius: 6,
									alignItems: 'center',
								}}
							>
								<Text>Stay</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleConfirmCancel}
								style={{
									flex: 1,
									padding: 12,
									marginLeft: 8,
									backgroundColor: '#ff5252',
									borderRadius: 6,
									alignItems: 'center',
								}}
							>
								<Text style={{color: 'white'}}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			{/* Success Modal */}
			<Modal
				visible={showSuccessModal}
				transparent
				animationType="fade"
				onRequestClose={handleSuccessClose}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0,0.4)',
					}}
				>
					<View
						style={{
							backgroundColor: 'white',
							borderRadius: 10,
							padding: 24,
							width: '80%',
							alignItems: 'center',
						}}
					>
						<Text
							style={{
								fontSize: 20,
								marginBottom: 16,
								textAlign: 'center',
								fontWeight: 'bold',
							}}
						>
							Payment Successful!
						</Text>
						<Text style={{fontSize: 16, marginBottom: 24, textAlign: 'center'}}>
							Thank you for your payment. Your subscription is now active.
						</Text>
						<TouchableOpacity
							onPress={handleSuccessClose}
							style={{
								padding: 12,
								backgroundColor: '#4caf50',
								borderRadius: 6,
								alignItems: 'center',
								width: '100%',
							}}
						>
							<Text style={{color: 'white', fontWeight: 'bold'}}>Continue</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default Pay;
