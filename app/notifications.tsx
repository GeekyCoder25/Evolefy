import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@/constants';
import {Colors} from '@/constants/Colors';
import {
	GroupedNotification,
	listNotifications,
	Notification,
} from '@/services/apis/notification';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useMemo, useState} from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from './(tabs)/components/Header';

const getDateLabel = (dateString: string): string => {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	// Reset time parts for comparison
	today.setHours(0, 0, 0, 0);
	yesterday.setHours(0, 0, 0, 0);
	date.setHours(0, 0, 0, 0);

	if (date.getTime() === today.getTime()) {
		return 'Today';
	} else if (date.getTime() === yesterday.getTime()) {
		return 'Yesterday';
	} else {
		// Format as "Jan 15, 2024" or your preferred format
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}
};

const Notifications = () => {
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);

	const {data: notifications, isLoading} = useQuery({
		queryKey: ['notifications'],
		queryFn: listNotifications,
	});

	const groupedNotifications = useMemo(() => {
		if (!notifications?.data) return [];

		const groups: {[key: string]: Notification[]} = {};

		notifications.data.forEach(notification => {
			const label = getDateLabel(notification.attributes.sent_at);
			if (!groups[label]) {
				groups[label] = [];
			}
			groups[label].push(notification);
		});

		// Convert to array and sort by priority (Today, Yesterday, then dates)
		const result: GroupedNotification[] = Object.entries(groups).map(
			([title, data]) => ({
				title,
				data,
			})
		);

		result.sort((a, b) => {
			if (a.title === 'Today') return -1;
			if (b.title === 'Today') return 1;
			if (a.title === 'Yesterday') return -1;
			if (b.title === 'Yesterday') return 1;
			// For other dates, sort by date descending
			return (
				new Date(b.data[0].attributes.sent_at).getTime() -
				new Date(a.data[0].attributes.sent_at).getTime()
			);
		});

		return result;
	}, [notifications]);
	const handleRefresh = async () => {
		setRefreshing(true);
		queryClient.invalidateQueries({queryKey: ['notifications']});
		setRefreshing(false);
	};

	const renderItem = ({item}: {item: GroupedNotification}) => (
		<View>
			<Text style={styles.dateHeader}>{item.title}</Text>
			{item.data.map(notification => {
				const sentAt = new Date(notification.attributes.sent_at);
				const timeString = sentAt
					.toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: '2-digit',
						hour12: true,
					})
					.toLowerCase();
				return (
					<View key={notification.id} style={styles.notificationItem}>
						<Text style={styles.notificationTitle}>
							{notification.attributes.title}
						</Text>
						<Text style={styles.notificationMessage}>
							{notification.attributes.message}
						</Text>
						<Text style={{color: '#aaa', fontSize: 12, marginTop: 4}}>
							{timeString}
						</Text>
					</View>
				);
			})}
		</View>
	);

	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/images/onboarding_bg.jpg')}
				style={styles.bgImage}
			/>

			<Header showBack title="Notification" />

			<View className="flex-1">
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#fff" />
					</View>
				) : (
					<FlatList
						data={groupedNotifications}
						keyExtractor={item => item.title}
						contentContainerStyle={{
							paddingBottom: insets.bottom + 50,
							flexGrow: 1,
						}}
						ListEmptyComponent={
							<Text style={styles.emptyText}>No notifications</Text>
						}
						renderItem={renderItem}
						refreshControl={
							<RefreshControl
								onRefresh={handleRefresh}
								refreshing={refreshing}
								colors={[Colors.secondary]}
							/>
						}
					/>
				)}
			</View>
		</View>
	);
};

export default Notifications;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	bgImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		position: 'absolute',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 40,
	},
	dateHeader: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		paddingHorizontal: '3%',
		paddingTop: 20,
	},
	notificationItem: {
		marginHorizontal: '2%',
		padding: 14,
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		marginTop: 20,
		borderRadius: 10,
	},
	notificationTitle: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 4,
	},
	notificationMessage: {
		color: '#aaa',
		fontSize: 14,
	},
	emptyText: {
		color: '#fff',
		textAlign: 'center',
		padding: 20,
	},
	actionButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		minWidth: 80,
		alignItems: 'center',
	},
});
