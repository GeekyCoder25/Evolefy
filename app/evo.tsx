import ChatHistoryIcon from '@/assets/icons/chat';
import SendIcon from '@/assets/icons/send';
import {HAS_OPENED_EVO, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {useGlobalStore} from '@/context/store';
import {
	createChat,
	createConversation,
	fetchConversationHistory,
	getConversationMessages,
} from '@/services/apis/evo';
import {MemoryStorage} from '@/utils/storage';
import Entypo from '@expo/vector-icons/Entypo';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import {Image, ImageBackground} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	ActivityIndicator,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from './(tabs)/components/Header';
import ProfilePicture from './components/ProfilePicture';
import Back from './components/ui/back';

interface Message {
	id: string | number;
	text: string;
	isBot: boolean;
	timestamp: Date;
}

const Evo = () => {
	const insets = useSafeAreaInsets();
	const {user} = useGlobalStore();
	const queryClient = useQueryClient();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');
	const scrollViewRef = useRef<ScrollView>(null);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const inputRef = useRef<TextInput | null>(null);
	const [conversationId, setConversationId] = useState(0);
	const [showHistory, setShowHistory] = useState(false);
	const [isNewConversation, setIsNewConversation] = useState(false);

	const {
		data: oldMessages,
		isFetching,
		isPending: isLoadingHistory,
	} = useQuery({
		queryKey: ['conversation', conversationId],
		queryFn: () => getConversationMessages(conversationId),
		enabled: !!conversationId,
	});

	const firstMessage = [
		{
			id: '1',
			text: `Hi, ${user?.fullname.split(' ')[0] || ''} how was your day?`,
			isBot: true,
			timestamp: new Date(),
		},
	];

	useEffect(() => {
		if (oldMessages?.data) {
			setMessages(
				oldMessages.data.messages.map(message => ({
					id: message.id,
					text: message.content,
					isBot: message.sender_type === 'ai',
					timestamp: new Date(),
				}))
			);
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({animated: false});
			}, 100);
		}
	}, [oldMessages]);

	const {mutate: chatMutation, isPending} = useMutation({
		mutationFn: createChat,
		onSuccess: res => {
			const evoResponse = res.data.ai_response;
			const newMessage: Message = {
				id: evoResponse.id,
				text: evoResponse.content,
				isBot: true,
				timestamp: new Date(evoResponse.created_at),
			};
			setMessages(prev => [...prev, newMessage]);
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({animated: true});
			}, 100);
		},
	});

	const sendMessage = async () => {
		if (inputText.trim() === '') return;

		const newMessage: Message = {
			id: Date.now().toString(),
			text: inputText.trim(),
			isBot: false,
			timestamp: new Date(),
		};

		setMessages(prev => [...prev, newMessage]);
		setInputText('');
		Keyboard.dismiss();
		let conversation_id = conversationId;
		if (conversationId === 0) {
			const res = await createConversation();
			conversation_id = res.data.id;
			setIsNewConversation(true);
			setConversationId(res.data.id);
		}

		chatMutation({
			conversation_id,
			message: inputText,
		});

		// Auto scroll to bottom
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({animated: true});
		}, 100);
	};

	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setIsInputFocused(false);
				inputRef.current?.blur();
			}
		);
		return () => {
			keyboardDidHideListener?.remove();
		};
	}, []);

	useEffect(() => {
		const storage = new MemoryStorage();
		storage.getItem(HAS_OPENED_EVO).then(res => {
			if (!res) {
				storage.setItem(HAS_OPENED_EVO, 'true');
			}
		});
	}, []);

	const handleCopy = (text: string) => {
		Clipboard.setStringAsync(text);
		ToastAndroid.show('Copied to clipboard', 1000);
	};

	const renderMessage = (message: Message) => {
		if (message.isBot) {
			return (
				<TouchableOpacity
					onLongPress={() => handleCopy(message.text)}
					key={message.id}
					className="flex-row items-start mb-4 px-4"
				>
					<View className="rounded-full p-2 mr-1">
						<Image
							source={require('../assets/images/evoIcon.png')}
							style={{width: 30, height: 30}}
						/>
					</View>
					<View className="flex-1 flex-row py-2">
						<View
							className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]"
							style={{backgroundColor: 'rgba(0, 66, 86, 0.32)'}}
						>
							<Text className="text-white font-inter-semibold text-base leading-5">
								{message.text}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			);
		} else {
			return (
				<View key={message.id} className="items-start mb-4 px-4 ml-auto">
					<View className="flex-row py-2">
						<View
							className="rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%] mr-3"
							style={{backgroundColor: 'rgba(0, 66, 86, 1)'}}
						>
							<Text className="text-white font-inter-semibold text-base leading-5">
								{message.text}
							</Text>
						</View>
						<ProfilePicture />
					</View>
				</View>
			);
		}
	};

	return (
		<KeyboardAvoidingView
			className="flex-1 bg-background"
			behavior={isInputFocused ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : -20}
			style={{flex: 1}}
		>
			<Image
				source={require('../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			{/* Header */}
			<ImageBackground source={require('../assets/images/noise-bg.png')}>
				<View className="px-[5%] pb-4" style={{paddingTop: insets.top + 10}}>
					<View className="flex-row justify-between items-center gap-2">
						<Back />
						<LinearGradient
							colors={['#00CCFF', '#1520A6']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0.4}}
							style={styles.header}
						>
							<Image
								source={require('../assets/images/evoIcon.png')}
								style={{width: 30, height: 30}}
							/>
							<Text className="text-white font-inter-bold text-xl mt-1">
								EVO
							</Text>
						</LinearGradient>
						<TouchableOpacity
							onPress={() => {
								setIsNewConversation(false);
								setShowHistory(true);
								queryClient.invalidateQueries({
									queryKey: ['conversation_history'],
								});
							}}
						>
							<ChatHistoryIcon />
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>

			{/* Messages */}
			{isLoadingHistory && isFetching && !isNewConversation ? (
				<View className="flex-1 pt-6 justify-center ">
					<ActivityIndicator size={'large'} color={Colors.primary} />
				</View>
			) : (
				<ScrollView
					ref={scrollViewRef}
					showsVerticalScrollIndicator={false}
					className="flex-1 pt-6"
					contentContainerStyle={{paddingBottom: 20}}
				>
					{firstMessage.map(renderMessage)}
					{messages.map(renderMessage)}
					{isPending && (
						<View className="flex-row items-start my-4 px-4">
							<ActivityIndicator color={Colors.primary} />
						</View>
					)}
				</ScrollView>
			)}

			{/* Input */}
			<View
				className="px-4 pb-0 flex-row items-center"
				style={{paddingBottom: insets.bottom + 16}}
			>
				<TextInput
					value={inputText}
					onChangeText={setInputText}
					placeholder="Tell me something, I love future talk"
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
			<HistoryModal
				visible={showHistory}
				onClose={() => setShowHistory(false)}
				setConversationId={setConversationId}
			/>
		</KeyboardAvoidingView>
	);
};

export default Evo;

const HistoryModal = ({
	visible,
	onClose,
	setConversationId,
}: {
	visible: boolean;
	onClose: () => void;
	setConversationId: Dispatch<SetStateAction<number>>;
}) => {
	const insets = useSafeAreaInsets();
	const {data, isPending} = useQuery({
		queryKey: ['conversation_history'],
		queryFn: fetchConversationHistory,
	});

	return (
		<Modal
			visible={visible}
			onRequestClose={onClose}
			transparent
			statusBarTranslucent
			style={{flex: 1}}
			animationType="slide"
		>
			<Image
				source={require('../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>
			<Header
				title="Chat history"
				showBack
				hideRightElements
				onBackPress={onClose}
			/>
			<FlatList
				data={data?.data}
				keyExtractor={({id}) => `${id}`}
				style={{marginBottom: insets.bottom}}
				renderItem={({item: converse}) => (
					<TouchableOpacity
						className="px-[5%] py-5 border-b border-b-[#192024] flex-row justify-between items-center gap-10"
						onPress={() => {
							setConversationId(converse.id);
							onClose();
						}}
					>
						<View className="flex-1">
							<Text className="text-white font-inter-semibold">
								{converse.title}
							</Text>
							<Text className="text-[#9CA3AF] font-inter-regular">
								{converse.summary}
							</Text>
							<Text className="text-[#9CA3AF] font-inter-regular mt-1">
								{(() => {
									const createdAt = new Date(
										converse.latest_message.metadata.timestamp
									);
									const now = new Date();
									const diffMs = now.getTime() - createdAt.getTime();
									const diffSec = Math.floor(diffMs / 1000);
									const diffMin = Math.floor(diffSec / 60);
									const diffHour = Math.floor(diffMin / 60);
									const diffDay = Math.floor(diffHour / 24);

									if (diffDay > 0)
										return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
									if (diffHour > 0)
										return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
									if (diffMin > 0)
										return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
									return 'Just now';
								})()}
							</Text>
						</View>
						<Entypo name="chevron-small-right" size={24} color="#FFFFFF" />
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					<View className="px-[5%] py-20">
						{isPending ? (
							<ActivityIndicator color={Colors.primary} size={'large'} />
						) : (
							<Text className="text-white font-sora-medium text-center">
								No history conversations yet.
							</Text>
						)}
					</View>
				}
			/>
		</Modal>
	);
};

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
