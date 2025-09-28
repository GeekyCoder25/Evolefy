import * as React from 'react';
import type {SvgProps} from 'react-native-svg';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
const UploadIcon = (props: SvgProps) => (
	<Svg width={63} height={66} fill="none" {...props}>
		<Path
			fill="url(#a)"
			d="M12.716 24.843A12.42 12.42 0 1 0 12.715 0a12.42 12.42 0 0 0 .001 24.842m0-18.97 6.379 6.377-1.83 1.83-3.257-3.256v8.147h-2.586v-8.147L8.166 14.08l-1.83-1.83z"
		/>
		<Path
			fill="url(#b)"
			d="M57.342 6.118H27.879a16.418 16.418 0 0 1-23.98 20.153v34.365A5.365 5.365 0 0 0 9.261 66h48.08a5.36 5.36 0 0 0 5.364-5.364V11.482a5.366 5.366 0 0 0-5.364-5.364m-11.626 9.467a7.526 7.526 0 1 1 0 15.052 7.526 7.526 0 0 1 0-15.052m8.688 40.949H12.202a.78.78 0 0 1-.682-1.156l12.985-23.559a1.02 1.02 0 0 1 1.742-.07l7.292 11.018a4.17 4.17 0 0 0 6.484.592l1.378-1.43a2.384 2.384 0 0 1 3.612.21l10.009 13.145a.778.778 0 0 1-.618 1.25"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={2.552}
				x2={22.689}
				y1={5.948}
				y2={18.526}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#0CF" />
				<Stop offset={1} stopColor="#1520A6" />
			</LinearGradient>
			<LinearGradient
				id="b"
				x1={9.244}
				x2={57.393}
				y1={20.456}
				y2={49.992}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#0CF" />
				<Stop offset={1} stopColor="#1520A6" />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default UploadIcon;
