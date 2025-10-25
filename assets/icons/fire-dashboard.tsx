import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
const FireIcon = (props: SvgProps) => (
	<Svg width={40} height={57} fill="none" {...props}>
		<Path
			fill="url(#a)"
			fillOpacity={0.28}
			d="M4.335 48.143c.473.648 6.08 8.065 14.82 8.799 7.329.612 13.753-3.72 16.951-7.88 6.654-8.678 4.862-23.997-6.008-36.358.674 1.282 3.298 6.611 1.168 12.212a12.9 12.9 0 0 1-2.1 3.598C19.149 17.984 25.853 0 25.853 0S3.446 15.917 9.397 35.717c.144.484.294.947.445 1.403-6.475-3.59-8.024-12.846-8.024-12.846-.494 1.276-4.89 13.167 2.094 23.277.1.136.237.335.423.592"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={20}
				x2={20}
				y1={0}
				y2={57}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#F33E3E" />
				<Stop offset={1} stopColor="#D8902D" />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default FireIcon;
