import {LinearGradient} from 'expo-linear-gradient';
import React, {useState} from 'react';
import {TextInput as BaseTextInput, TextInputProps} from 'react-native';

const TextInput = (
	props: TextInputProps & {
		className?: string;
		borderWidth?: number;
		showGradient?: boolean;
	}
) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<LinearGradient
			colors={
				isFocused || props.showGradient
					? ['#00CCFF', '#1520A6']
					: ['transparent', 'transparent']
			}
			start={{x: 0, y: 0}}
			end={{x: 1, y: 0.4}}
			style={{
				borderRadius: 12,
				padding: props.borderWidth ?? 2,
			}}
		>
			<BaseTextInput
				{...props}
				className={`border-white py-5 px-5 rounded-xl bg-[#192024] text-white font-sora-regular ${props.className}`}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				style={{
					borderWidth:
						isFocused || props.showGradient ? 0 : (props.borderWidth ?? 2),
					...(props.style as object),
				}}
			/>
		</LinearGradient>
	);
};

export default TextInput;
