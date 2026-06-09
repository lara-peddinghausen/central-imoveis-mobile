import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { COLORS } from '../../theme/colors';
import { FONT_SIZE } from '../../theme/typography';

export default function InputItem({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    error = false,
}) {

    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <View style={styles.wrapper}>

            <Text style={styles.text}> {label} </Text>


            <View style={[styles.container, error && styles.containerError]}>

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
    wrapper: {
        marginBottom: 10,
    },
    text: {
        marginLeft: 10,
        marginTop: 20,
        fontSize: FONT_SIZE.small,

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        width: '90%',
        paddingTop: 3,
    },
    containerError: {
        borderColor: COLORS.red,
        borderWidth: 2
    },
    input: {
        width: 250,
        height: 40,
        flex: 1,
        // borderWidth: 1,
        // borderRadius: 5,
        // margin: 10,
        fontSize: FONT_SIZE.small,
    },
})
