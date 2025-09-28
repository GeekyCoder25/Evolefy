import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
const FireIcon = (props: SvgProps) => (
	<Svg width={9} height={14} fill="none" {...props}>
		<Path
			fill="url(#a)"
			d="M1.254 11.26c.102.14 1.31 1.748 3.194 1.907 1.579.133 2.963-.806 3.652-1.708 1.434-1.882 1.048-5.204-1.295-7.884.146.278.711 1.433.252 2.648-.122.323-.29.58-.452.78C4.446 4.719 5.89.82 5.89.82S1.063 4.271 2.345 8.565q.047.156.096.304C1.046 8.091.712 6.084.712 6.084c-.106.276-1.054 2.855.451 5.047z"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={4.63}
				x2={4.63}
				y1={0.82}
				y2={13.18}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#F33E3E" />
				<Stop offset={1} stopColor="#D8902D" />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default FireIcon;
