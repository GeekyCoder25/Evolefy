import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from 'react-native-svg';
const SendIcon = (props: SvgProps) => (
	<Svg width={52} height={52} fill="none" {...props}>
		<Rect width={52} height={52} fill="url(#a)" rx={10} />
		<Path
			fill="#fff"
			d="m34.31 14.117-18.244 5.366a2.878 2.878 0 0 0-.475 5.334l7.195 3.598c.345.173.626.454.799.799l3.598 7.195A2.82 2.82 0 0 0 29.739 38q.135 0 .273-.012a2.82 2.82 0 0 0 2.505-2.054l5.366-18.244a2.877 2.877 0 0 0-3.572-3.573"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={4.727}
				x2={46.877}
				y1={12.451}
				y2={38.779}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#0CF" />
				<Stop offset={1} stopColor="#1520A6" />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default SendIcon;
