import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';

type Props = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: any;
};

export default function CustomInput({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
}: Props) {

    return (
        <View style={styles.container}>

            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#A0A4AB"
                keyboardType={keyboardType}
                style={styles.input}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginBottom: 10,
    },

    label: {
        fontSize: 15,
        fontWeight: '700',

        color: '#1F2937',

        marginBottom: 10,
    },

    input: {
        backgroundColor: '#FFFFFF',

        borderWidth: 1.5,
        borderColor: '#E5E7EB',

        borderRadius: 18,

        paddingVertical: 18,
        paddingHorizontal: 18,

        fontSize: 15,
        color: '#111827',
    },

});