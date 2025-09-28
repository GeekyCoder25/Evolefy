import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
const CrownIcon = (props: SvgProps) => (
	<Svg width={54} height={42} fill="none" {...props}>
		<Path
			fill="url(#a)"
			d="m53.944 13.913-4.31 25.344a2.685 2.685 0 0 1-2.66 2.241 1.7 1.7 0 0 1-.43-.036l-1.994-.325a106.9 106.9 0 0 0-35.1 0l-1.994.325a2.69 2.69 0 0 1-3.09-2.205L.055 13.913a3.62 3.62 0 0 1 1.27-3.43 3.57 3.57 0 0 1 3.598-.547l12.628 5.08 6.234-12.528A3.6 3.6 0 0 1 27 .5a3.6 3.6 0 0 1 3.215 1.988l6.234 12.528 12.628-5.08a3.57 3.57 0 0 1 3.597.547 3.62 3.62 0 0 1 1.27 3.43"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={4.909}
				x2={41.197}
				y1={10.317}
				y2={40.17}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#0CF" />
				<Stop offset={1} stopColor="#1520A6" />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default CrownIcon;
