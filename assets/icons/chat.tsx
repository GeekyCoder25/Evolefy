import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const ChatHistoryIcon = (props: SvgProps) => (
	<Svg
		width={28}
		height={24}
		fill="none"
		{...props}
	>
		<Path
			fill="#fff"
			d="M14 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8m1.71 5.71a1 1 0 0 1-1.42 0l-1-1A1 1 0 0 1 13 10V8a1 1 0 0 1 2 0v1.59l.71.7a1 1 0 0 1 0 1.42"
		/>
		<Path
			fill="#fff"
			d="M25 0H3a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14.65l4.73 3.78A1 1 0 0 0 23 24a.9.9 0 0 0 .43-.1A1 1 0 0 0 24 23v-3h1a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3M14 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12"
		/>
	</Svg>
);
export default ChatHistoryIcon;
