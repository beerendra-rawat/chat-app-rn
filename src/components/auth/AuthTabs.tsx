import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

type Props = {
    activeTab: 'signin' | 'signup';

    onSignInPress: () => void;
    onSignUpPress: () => void;
};

export default function AuthTabs({
    activeTab,
    onSignInPress,
    onSignUpPress,
}: Props) {

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.tab}
                onPress={onSignInPress}
            >

                <Text
                    style={[
                        styles.text,
                        activeTab === 'signin'
                        && styles.activeText,
                    ]}
                >
                    Log in
                </Text>

                {
                    activeTab === 'signin'
                    &&
                    <View style={styles.line} />
                }

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={onSignUpPress}
            >

                <Text
                    style={[
                        styles.text,
                        activeTab === 'signup'
                        && styles.activeText,
                    ]}
                >
                    Sign up
                </Text>

                {
                    activeTab === 'signup'
                    &&
                    <View style={styles.line} />
                }

            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginTop: 18,
        marginBottom: 45,

        paddingHorizontal: 10,
    },

    tab: {
        flex: 1,
        alignItems: 'center',
    },

    text: {
        fontSize: 18,
        fontWeight: '600',
        color: '#B7B7B7',

        marginBottom: 10,
    },

    activeText: {
        color: '#4F7CF7',
        fontWeight: '700',
    },

    line: {
        width: 55,
        height: 3,

        backgroundColor: '#4F7CF7',

        borderRadius: 20,
    },

});