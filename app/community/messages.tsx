import SendIcon from '@/assets/icons/send';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {useGlobalStore} from '@/context/store';
import {
	getCommunityMessages,
	sendMessageCommunity,
} from '@/services/apis/community';
import {useQuery} from '@tanstack/react-query';
import {Image, ImageBackground} from 'expo-image';
import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProfilePicture from '../components/ProfilePicture';
import Back from '../components/ui/back';

interface Message {
	id: string | number;
	text: string;
	isUser: boolean;
	timestamp: Date;
	photo: string | null;
	username: string;
}

interface Params {
	id: number;
	name: string;
	description: string;
	cover_image: string | null;
	member_count: number;
}

const CommunityMessages = () => {
	const params = useLocalSearchParams();
	const community: Params = {
		id: Number(params.id),
		name: String(params.name),
		description: String(params.description),
		cover_image: params.cover_image ? String(params.cover_image) : null,
		member_count: Number(params.member_count),
	};
	const insets = useSafeAreaInsets();
	const [inputText, setInputText] = useState('');
	const scrollViewRef = useRef<ScrollView>(null);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const inputRef = useRef<TextInput | null>(null);
	const {user} = useGlobalStore();

	const {data: messagesData} = useQuery({
		queryKey: ['community_' + community.id],
		queryFn: () => getCommunityMessages(Number(community.id)),
	});
	const [messages, setMessages] = useState<Message[]>(
		messagesData?.data
			.map(message => ({
				id: message.id,
				text: message.attributes.message,
				isUser: user?.id === message.relationships.user.data.id,
				timestamp: new Date(),
				photo:
					message.relationships.user.data.attributes.profile_picture || null,
				username: message.relationships.user.data.attributes.name,
			}))
			.reverse() || []
	);

	useEffect(() => {
		if (messagesData) {
			setMessages(
				messagesData?.data
					.map(message => ({
						id: message.id,
						text: message.attributes.message,
						isUser: user?.id === message.relationships.user.data.id,
						timestamp: new Date(),
						photo:
							message.relationships.user.data.attributes.profile_picture ||
							null,
						username: message.relationships.user.data.attributes.name,
					}))
					.reverse()
			);
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({animated: false});
			}, 100);
		}
	}, [messagesData, user?.id]);

	const sendMessage = async () => {
		if (inputText.trim() === '') return;

		const newMessage: Message = {
			id: Date.now().toString(),
			text: inputText.trim(),
			isUser: true,
			timestamp: new Date(),
			photo: null,
			username: user?.fullname || '',
		};

		setMessages(prev => [...prev, newMessage]);
		setInputText('');
		Keyboard.dismiss();

		sendMessageCommunity({id: Number(community.id), message: inputText});

		// Auto scroll to bottom
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({animated: true});
		}, 100);
	};

	const renderMessage = (message: Message) => {
		if (message.isUser)
			return (
				<View key={message.id} className="items-start mb-4 px-4 ml-auto">
					<View className="flex-row py-2">
						<View
							className="rounded-2xl rounded-tr-md px-4 py-3 mr-3 max-w-[80%]"
							style={{backgroundColor: 'rgba(0, 66, 86, 1)'}}
						>
							<Text className="text-white font-inter-semibold text-base leading-5">
								{message.text}
							</Text>
							<Text className="text-white font-sora-regular text-[8px] mt-1 ml-auto">
								{new Date(message.timestamp).toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</Text>
						</View>
						<ProfilePicture />
					</View>
				</View>
			);
		else
			return (
				<View key={message.id} className="flex-row items-start mb-4 px-4">
					{message.photo ? (
						<Image
							source={{uri: message.photo}}
							className="w-full h-full"
							style={{width: 40, height: 40, borderRadius: 40}}
						/>
					) : (
						<View className="w-10 h-10 rounded-full bg-purple-600 items-center justify-center">
							<Text className="text-white font-sora-semibold text-xl">
								{message.username.charAt(0)}
							</Text>
						</View>
					)}
					<View className="flex-1 flex-row py-2 ml-3">
						<View
							className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]"
							style={{backgroundColor: 'rgba(0, 66, 86, 0.32)'}}
						>
							<Text className="text-white font-inter-semibold text-base leading-5">
								{message.text}
							</Text>
							<Text className="text-white font-sora-regular text-[8px] mt-1 ml-auto">
								{new Date(message.timestamp).toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</Text>
						</View>
					</View>
				</View>
			);
	};
	return (
		<KeyboardAvoidingView
			className="flex-1 bg-background"
			behavior={isInputFocused ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : -20}
			style={{flex: 1}}
		>
			<Image
				source={require('../../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			{/* Header */}
			<ImageBackground source={require('../../assets/images/noise-bg.png')}>
				<View className="px-[5%] pb-4" style={{paddingTop: insets.top + 10}}>
					<View className="flex-row items-center gap-3">
						<Back />
						<View className="flex-row items-center gap-2">
							{community.cover_image ? (
								<Image
									source={{uri: community.cover_image}}
									className="w-full h-full"
									style={{width: 40, height: 40, borderRadius: 40}}
								/>
							) : (
								<View className="w-10 h-10 rounded-full bg-purple-600 items-center justify-center">
									<Text className="text-white font-sora-bold text-xl">
										{community.name.charAt(0)}
									</Text>
								</View>
							)}

							<View>
								<Text className="text-white font-sora-semibold">
									{community.name}
								</Text>
								<Text className="text-white font-sora-regular">
									{community.member_count}{' '}
									{community.member_count > 1 ? 'members' : 'member'}
								</Text>
							</View>
						</View>
					</View>
					{/* <Image source={{uri: 
    
}}/> */}
				</View>
			</ImageBackground>

			{/* Messages */}
			<ScrollView
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
				className="flex-1 pt-6"
				contentContainerStyle={{paddingBottom: 20}}
			>
				{messages.map(renderMessage)}
			</ScrollView>

			{/* Input */}
			<View
				className="px-4 pb-0 flex-row items-center"
				style={{paddingBottom: insets.bottom + 16}}
			>
				<TextInput
					value={inputText}
					onChangeText={setInputText}
					placeholder="Type something here"
					placeholderTextColor="#9CA3AF"
					className="flex-1 text-white font-inter-regular text-base bg-[#192024] rounded-2xl px-4 py-5 border border-white"
					multiline
					maxLength={500}
					onSubmitEditing={sendMessage}
					returnKeyType="send"
					onFocus={() => {
						setIsInputFocused(true);
						setTimeout(() => {
							scrollViewRef.current?.scrollToEnd({animated: true});
						}, 100);
					}}
					onBlur={() => setIsInputFocused(false)}
					ref={inputRef}
				/>
				<TouchableOpacity
					onPress={sendMessage}
					className="ml-3"
					disabled={inputText.trim() === ''}
				>
					<SendIcon />
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default CommunityMessages;

const styles = StyleSheet.create({
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		flex: 1,
		position: 'absolute',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 40,
		paddingVertical: 5,
		borderRadius: 20,
	},
});
