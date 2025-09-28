import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Path} from 'react-native-svg';
const MoreIcon = (props: SvgProps) => (
	<Svg width={20} height={20} fill="none" {...props}>
		<Path
			stroke="#fff"
			strokeOpacity={0.7}
			d="M3.571.5a3.072 3.072 0 1 1 0 6.144 3.072 3.072 0 0 1 0-6.144ZM16.428.5a3.072 3.072 0 1 1 0 6.144 3.072 3.072 0 0 1 0-6.144ZM16.428 13.357a3.072 3.072 0 1 1 0 6.145 3.072 3.072 0 0 1 0-6.145ZM3.571 13.357a3.072 3.072 0 1 1 0 6.144 3.072 3.072 0 0 1 0-6.144Z"
		/>
	</Svg>
);
export default MoreIcon;

export const MoreActiveIcon = (props: SvgProps) => (
	<Svg width={20} height={20} fill="none" {...props}>
		{/* Filled circles for active state */}
		<Path
			fill="#FFFFFF"
			d="M3.571.5a3.072 3.072 0 1 1 0 6.144 3.072 3.072 0 0 1 0-6.144Z"
		/>
		<Path
			fill="#FFFFFF"
			d="M16.428.5a3.072 3.072 0 1 1 0 6.144 3.072 3.072 0 0 1 0-6.144Z"
		/>
		<Path
			fill="#FFFFFF"
			d="M16.428 13.357a3.072 3.072 0 1 1 0 6.145 3.072 3.072 0 0 1 0-6.145Z"
		/>
		<Path
			fill="#FFFFFF"
			d="M3.571 13.357a3.072 3.072 0 1 1 0 6.144 3.072 3.072 0 0 1 0-6.144Z"
		/>
	</Svg>
);
