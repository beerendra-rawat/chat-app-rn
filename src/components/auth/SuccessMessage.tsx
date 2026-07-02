import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import PrimaryButton from './PrimaryButton';

type Props = {
    title: string;
    subtitle: string;
    buttonText: string;
    onPress: () => void;
};

export default function SuccessMessage({
    title,
    subtitle,
    buttonText,
    onPress,
}: Props) {

    return (
        <View style={styles.container}>

            <View style={styles.iconContainer}>

                <Image
                    source={require('../../assets/img/check.png')}
                    style={styles.icon}
                />

            </View>

            <Text style={styles.title}>
                {title}
            </Text>

            <Text style={styles.subtitle}>
                {subtitle}
            </Text>

            <PrimaryButton
                title={buttonText}
                onPress={onPress}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 70,
    },

    iconContainer: {
        width: 120,
        height: 120,

        borderRadius: 60,

        backgroundColor: '#EEF4FF',

        justifyContent: 'center',
        alignItems: 'center',

        alignSelf: 'center',

        marginBottom: 34,
    },

    icon: {
        width: 56,
        height: 56,

        tintColor: '#6487E8',
    },

    title: {
        fontSize: 32,
        fontWeight: '800',

        textAlign: 'center',

        color: '#1D2433',

        marginBottom: 16,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 28,

        color: '#8B93A7',

        textAlign: 'center',

        marginBottom: 42,
    },

});