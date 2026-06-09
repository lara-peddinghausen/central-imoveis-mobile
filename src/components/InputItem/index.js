import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { COLORS } from '../../theme/colors';

export default function InputItem({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
}) {

    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <View>

            <Text style={styles.text}>
                {label}
            </Text>

            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={
                        secureTextEntry && !mostrarSenha
                    }
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                        <Ionicons
                            name={
                                mostrarSenha
                                    ? 'eye-off'
                                    : 'eye'
                            }
                            size={24}
                        />
                    </TouchableOpacity>
                )}

            </View>

        </View>
    );

}

const styles = StyleSheet.create({
    text: {
        marginLeft: 10,
        marginTop: 20

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        width: '90%',
    },
    input: {
        width: 250,
        height: 40,
        // borderWidth: 1,
        // borderRadius: 5,
        margin: 10,
    }
})
