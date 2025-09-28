/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				primary: '#00CCFF',
				secondary: '#8A2BE2',
				button: '#4CAF50',
				background: '#0B0F1C',
			},
			fontFamily: {
				'sora-thin': ['Sora-Thin'],
				'sora-extralight': ['Sora-ExtraLight'],
				'sora-light': ['Sora-Light'],
				'sora-regular': ['Sora-Regular'],
				'sora-medium': ['Sora-Medium'],
				'sora-semibold': ['Sora-SemiBold'],
				'sora-bold': ['Sora-Bold'],
				'sora-extrabold': ['Sora-ExtraBold'],
				'inter-thin': ['Inter-Thin'],
				'inter-extralight': ['Inter-ExtraLight'],
				'inter-light': ['Inter-Light'],
				'inter-regular': ['Inter-Regular'],
				'inter-medium': ['Inter-Medium'],
				'inter-semibold': ['Inter-SemiBold'],
				'inter-bold': ['Inter-Bold'],
				'inter-extrabold': ['Inter-ExtraBold'],
			},
		},
	},
	plugins: [],
};
