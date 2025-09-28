import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Circle, Path} from 'react-native-svg';

const ProfileIcon = (props: SvgProps) => (
	<Svg width={24} height={24} fill="none" {...props}>
		<Circle
			cx={12}
			cy={12}
			r={10}
			stroke="#fff"
			strokeOpacity={0.7}
			strokeWidth={1.5}
		/>
		<Circle
			cx={12}
			cy={9}
			r={3}
			stroke="#fff"
			strokeOpacity={0.7}
			strokeWidth={1.5}
		/>
		<Path
			stroke="#fff"
			strokeOpacity={0.7}
			strokeWidth={1.5}
			d="M6.168 18.849A6.99 6.99 0 0 1 12 16a6.99 6.99 0 0 1 5.832 2.849"
		/>
	</Svg>
);

export default ProfileIcon;

export const ProfileActiveIcon = (props: SvgProps) => (
	<Svg width={24} height={24} fill="none" {...props}>
		<Circle cx={12} cy={12} r={10} stroke="#fff" strokeWidth={2} />
		<Circle cx={12} cy={9} r={3} fill="#fff" />
		<Path
			fill="#fff"
			d="M6.168 18.849A6.99 6.99 0 0 1 12 16a6.99 6.99 0 0 1 5.832 2.849C16.537 20.157 14.377 21 12 21s-4.537-.843-6.832-2.151Z"
		/>
	</Svg>
);
