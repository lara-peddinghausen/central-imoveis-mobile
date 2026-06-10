import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { ButtonDark } from "../src/components/ButtonDark";
import { ButtonLight } from "../src/components/ButtonLight";
import { COLORS } from '../src/theme/colors';
import InputItem from "../src/components/InputItem";
import { login } from "../src/services/authService";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importação adicionada!

export default function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [logado, setLogado] = useState(false);

    useEffect(() => {
        if (logado) {
            // Como a rota /home agora está dentro da pasta (tabs),
            // o Expo Router a redirecionará trazendo a barra inferior!
            router.replace('/home');
        }
    }, [logado]);

    const entrar = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        try {
            // 1. Dispara os dados para o endpoint público do Spring Boot
            const resposta = await api.post('/auth/login', {
                email: email,
                senha: senha
            });

            // 2. O back retorna o 'DadosTokenJWT' contendo o token string
            const token = resposta.data.token;

            // 3. Grava o Token real no celular para o seu index.js fazer o Auth Gate
            await AsyncStorage.setItem('usuario', token);

            Alert.alert('Sucesso', 'Login realizado com sucesso!');
            setLogado(true); // Seu useEffect vai disparar o router.replace('/home')

        } catch (error) {
            // Captura erros de credenciais incorretas ou servidor fora do ar
            if (error.response) {
                Alert.alert('Erro de Autenticação', 'E-mail ou senha inválidos.');
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor backend.');
            }
        }
    };

    const cadastrar = () => {
        router.push('/cadastro-admin');
    }

    return (
        <View style={styles.container}>

            <Image
                source={require('../src/assets/images/logo1.png')}
                style={styles.img}
                resizeMode="contain"
            />

            <View style={styles.caixa}>

                <View>
                    <InputItem
                        label='E-mail'
                        placeholder='Digite seu e-mail'
                        onChangeText={setEmail}
                    />

                    <InputItem
                        label='Senha'
                        placeholder='Digite sua senha'
                        onChangeText={setSenha}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.espacamentoBotoes}>
                    <ButtonLight
                        title="Cadastrar"
                        onPress={cadastrar}
                        flex
                    />

                    <ButtonDark
                        title="Entrar"
                        onPress={entrar}
                        flex
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
        borderColor: COLORS.lightGrey
    }
});