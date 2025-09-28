import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Circle, Ellipse} from 'react-native-svg';
const RadioActiveIcon = (props: SvgProps) => (
	<Svg width={16} height={17} fill="none" {...props}>
		<Circle cx={8} cy={8.5} r={7} stroke="#E8D5F9" strokeWidth={2} />
		<Ellipse cx={8} cy={8.5} fill="#E8D5F9" rx={5} ry={5.5} />
	</Svg>
);
export default RadioActiveIcon;
