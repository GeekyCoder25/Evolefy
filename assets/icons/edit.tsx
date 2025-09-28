import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Path} from 'react-native-svg';
const EditIcon = (props: SvgProps) => (
	<Svg width={33} height={33} fill="none" {...props}>
		<Path
			fill="#5F1D9C"
			d="M32.4 4.868 28.132.6A2.05 2.05 0 0 0 25.76.22a.19.19 0 0 0-.194.044L25.232.6 4.993 20.838l-2.292 2.294a.2.2 0 0 0-.053.103l-.025-.025L0 33l9.79-2.623-.025-.025a.2.2 0 0 0 .103-.053L32.736 7.432a.19.19 0 0 0 .045-.194 2.05 2.05 0 0 0-.381-2.37"
		/>
	</Svg>
);
export default EditIcon;
