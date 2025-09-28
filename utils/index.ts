import Constants from 'expo-constants';

export const stripIfTarget = (text: string, target: string) => {
	if (text.startsWith(target)) {
		text = text.slice(1);
	}

	if (text.endsWith(target)) {
		text = text.slice(0, text.length - 1);
	}

	return text;
};

export const amountFormat = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
}).format;

export const deepSearch = (obj: any, searchParams: string): boolean => {
	const query = searchParams.toLowerCase();
	if (Array.isArray(obj)) {
		return obj.some(item => deepSearch(item, query));
	}
	if (typeof obj === 'object' && obj !== null) {
		return Object.values(obj).some(value => deepSearch(value, query));
	}
	if (typeof obj === 'string' || typeof obj === 'number') {
		return obj.toString()?.toLowerCase().includes(query);
	}

	return false;
};

export const isExpo = Constants.executionEnvironment === 'storeClient';

export function toKebabCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export const colorOptions = [
	'#7825c5',
	'#005c3a',
	'#e67e22',
	'#e74c3c',
	'#16a085',
	'#2980b9',
	'#d35400',
	'#27ae60',
];

export function createStableRandomColor(label: string): string {
	// Simple hash function to get consistent index from string
	let hash = 0;
	for (let i = 0; i < label.length; i++) {
		hash = ((hash << 5) - hash + label.charCodeAt(i)) & 0xffffffff;
	}

	return colorOptions[Math.abs(hash) % colorOptions.length];
}

export const minimumDate = (count: number) => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + count);
	return tomorrow;
};
