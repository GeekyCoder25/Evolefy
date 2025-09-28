import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
const EVIcon = (props: SvgProps) => (
	<Svg width={19} height={10} fill="none" {...props}>
		<Path
			fill="url(#a)"
			d="M11.846 5.196c-.038 1.283-1.829 1.407-3.755 1.062-2.467-.337-6.737-2.797-6.058-4.382.988-2.412 9.704.6 9.813 3.32m-3.957 2.32c-2.16-.306-5.35-1.91-6.611-3.637l-.357.95c-.817 2.676 8.611 6.247 9.758 3.674l.356-.949a8 8 0 0 1-3.146-.038m9.993-5.573c-.824-2.194-5.946-1.188-7.796-.458 1.63.917 2.905 2.146 3.02 3.547 1.521-.312 4.854-1.294 4.776-3.089m.599 3.096-.198-1.013c-1.042 1.1-3.364 2.059-5.49 2.344a2.3 2.3 0 0 1-.592.669c.16.417.128.883-.09 1.273 2.522-.017 6.753-1.705 6.37-3.273"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={9.688}
				x2={9.688}
				y1={0.608}
				y2={9.392}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#F33E3E" />
				<Stop offset={1} stopColor="#D8902D" />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default EVIcon;
