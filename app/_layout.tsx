import {DarkTheme, ThemeProvider} from '@react-navigation/native';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';
import '../globals.css';

import PushNotification from '@/providers/pushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import DailyChallenge from './components/DailyChallenge';
import Streak from './components/StreakModal';

export default function RootLayout() {
	const [loaded] = useFonts({
		'Sora-Thin': require('../assets/fonts/Sora-Thin.ttf'),
		'Sora-ExtraLight': require('../assets/fonts/Sora-ExtraLight.ttf'),
		'Sora-Light': require('../assets/fonts/Sora-Light.ttf'),
		'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
		'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
		'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
		'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
		'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
		'Inter-ExtraLight': require('../assets/fonts/Inter-ExtraLight.ttf'),
		'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
		'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
		'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
		'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
		'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
		'Inter-ExtraBold': require('../assets/fonts/Inter-ExtraBold.ttf'),
	});

	const queryClient = new QueryClient();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	const asyncStoragePersister = createAsyncStoragePersister({
		storage: AsyncStorage,
		key: 'REACT_QUERY_CACHE',
	});

	useEffect(() => {
		const checkUpdate = async () => {
			try {
				const update = await Updates.checkForUpdateAsync();
				if (update.isAvailable) {
					await Updates.fetchUpdateAsync();
					setTimeout(() => {
						Updates.reloadAsync();
					}, 1000);
				}
			} catch (e) {
				console.log(e);
			}
		};
		if (!__DEV__) checkUpdate();
	}, []);

	if (!loaded) {
		return null;
	}

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{persister: asyncStoragePersister}}
		>
			<ThemeProvider value={DarkTheme}>
				<PushNotification>
					<Stack screenOptions={{headerShown: false}}>
						<Stack.Screen name="index" options={{headerShown: false}} />
						<Stack.Screen name="(tabs)" options={{headerShown: false}} />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="light" />
					<Toast topOffset={insets.top + 10} />
					<Streak />
					<DailyChallenge />
				</PushNotification>
			</ThemeProvider>
		</PersistQueryClientProvider>
	);
}
