import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Path} from 'react-native-svg';
const HomeIcon = (props: SvgProps) => (
	<Svg width={25} height={23} fill="none" {...props}>
		<Path
			stroke="#fff"
			strokeOpacity={0.7}
			d="M9.104 2.82a4.83 4.83 0 0 1 6.794 0l6.697 6.653A4.75 4.75 0 0 1 24 12.843v4.814c0 2.629-2.147 4.766-4.803 4.766H16.07V15.44c0-1.963-1.6-3.549-3.569-3.549s-3.57 1.586-3.57 3.549v6.983H5.804C3.147 22.423 1 20.286 1 17.657v-4.815l.006-.236a4.75 4.75 0 0 1 1.4-3.133z"
		/>
	</Svg>
);
export default HomeIcon;

export const HomeActiveIcon = (props: SvgProps) => (
	<Svg width={25} height={23} fill="none" {...props}>
		<Path
			fill="#D9D9D9"
			d="M8.75 2.466a5.33 5.33 0 0 1 7.5 0l6.697 6.652a5.25 5.25 0 0 1 1.553 3.724v4.815c0 2.908-2.374 5.266-5.302 5.266H15.57V15.44c0-1.684-1.375-3.049-3.07-3.049s-3.07 1.365-3.07 3.05v7.483H5.802C2.874 22.923.5 20.565.5 17.657v-4.815c0-1.397.559-2.737 1.553-3.724z"
		/>
	</Svg>
);
