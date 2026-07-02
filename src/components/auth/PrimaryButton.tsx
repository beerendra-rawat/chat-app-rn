import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';

import COLORS from '../../constants/Colors';

type Props = {
    title: string;
    onPress: () => void;
};

export default function PrimaryButton({
    title,
    onPress,
}: Props) {

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        backgroundColor: COLORS.primary,

        paddingVertical: 18,
        marginTop: 24,

        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: COLORS.primary,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.18,
        shadowRadius: 10,

        elevation: 5,
    },

    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

});