import  { useRef, useState } from 'react';

import {
    View,
    TextInput,
    StyleSheet,
} from 'react-native';

type Props = {
    length?: number;
};

export default function OTPInput({
    length = 5,
}: Props) {

    const [otp, setOtp] = useState(
        new Array(length).fill('')
    );

    const inputs = useRef<any[]>([]);

    const handleChange = (
        text: string,
        index: number,
    ) => {

        const newOtp = [...otp];

        newOtp[index] = text;

        setOtp(newOtp);

        // Auto focus next input
        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (
        text: string,
        index: number,
    ) => {

        if (!text && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>

            {
                otp.map((item, index) => (

                    <TextInput
                        key={index}
                        ref={(ref) => {
                            inputs.current[index] = ref;
                        }}
                        value={item}
                        onChangeText={(text) =>
                            handleChange(text, index)
                        }
                        onKeyPress={({ nativeEvent }) => {

                            if (
                                nativeEvent.key === 'Backspace'
                            ) {
                                handleBackspace(
                                    item,
                                    index,
                                );
                            }

                        }}
                        style={[
                            styles.input,

                            item.length > 0
                            && styles.activeInput,
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                    />

                ))
            }

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginBottom: 32,
    },

    input: {
        width: 62,
        height: 62,

        borderWidth: 1.5,
        borderColor: '#D8D8D8',

        borderRadius: 16,

        backgroundColor: '#FFFFFF',

        textAlign: 'center',

        fontSize: 28,
        fontWeight: '700',

        color: '#444',
    },

    activeInput: {
        borderWidth: 2,
        borderColor: '#6487E8',
    },

});