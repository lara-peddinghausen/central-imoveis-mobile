import { router } from "expo-router";
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert, Pressable } from 'react-native';
import { Button01 } from "../components/Button01";
import { Button02 } from "../components/Button02";

export default function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [logado, setLogado] = useState(false);

    useEffect(() => {
        if (logado) {
            router.replace('/home');
        }
    }, [logado]);

    const entrar = () => {

        if (!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        // Simulação de login
        if (email === 'teste@gmail.com' && senha === '123') {
            Alert.alert('Login realizado com sucesso!');
            setLogado(true)

        } else {
            Alert.alert('E-mail ou senha inválidos');
        }
    };

    const cadastrar = () => {
        Alert.alert('Não implementado');
    }

    return (
        <View style={styles.container}>

            <Image
                source={require('../assets/images/logo1.png')}
                style={styles.img}
                resizeMode="contain"
            />

            <View style={styles.caixa}>

                <View>
                    <Text style={{ marginLeft: 10 }}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        onChangeText={setEmail} />

                    <Text style={{ marginLeft: 10 }}>Senha</Text>
                    <TextInput style={styles.input}
                        placeholder='Senha'
                        onChangeText={setSenha} />
                </View>

                <View style={styles.espacamentoBotoes}>
                    <Button02 title="Cadastrar"
                        onPress={cadastrar} />

                    <Button01 title="Entrar"
                        // onPress={entrar}
                        onPress={() => router.replace('/home')} 
                    />
                </View>

            </View>

        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    img: {
        width: '100%',
        maxWidth: 300,
        height: undefined,
        aspectRatio: 1.12,
        alignSelf: 'center'
    },
    textoFrase: {
        fontSize: 20,
        textAlign: 'center',
        color: '#dd7d22',
        fontStyle: 'italic'
    },
    botao: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: 115,
        // height: 35,
        borderRadius: 30,
        backgroundColor: '#0B3B63',
        margin: 10
    },
    btnArea: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    btnTexto: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white'
    },
    espacamentoBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        width: 250,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
    },
    caixa: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 24,
        borderColor: '#C8C8C8'
    }

})



