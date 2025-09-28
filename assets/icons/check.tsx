import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Path} from 'react-native-svg';
const CheckIcon = (props: SvgProps) => (
	<Svg width={32} height={32} fill="none" {...props}>
		<Path
			fill="#fff"
			d="M2.111 23.125C.308 22.306-.495 20.171.317 18.354a3.574 3.574 0 0 1 4.738-1.807c.014.007 3.137 1.408 6.303 4.11C13.506 13.862 18.04 4.163 27.018.289a3.57 3.57 0 0 1 4.695 1.904c.774 1.832-.073 3.95-1.892 4.729-10.182 4.394-12.853 20.34-13.088 21.87a3.61 3.61 0 0 1-1.91 2.8 3.573 3.573 0 0 1-4.835-1.538c-2.282-4.418-7.86-6.922-7.877-6.93z"
		/>
	</Svg>
);
export default CheckIcon;
