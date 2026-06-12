import { useRouter } from "expo-router";
import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ButtonDark } from "../src/components/ButtonDark";
import { ButtonLight } from "../src/components/ButtonLight";
import { COLORS } from '../src/theme/colors';
import InputItem from "../src/components/InputItem";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Importação adicionada!
import { AuthContext } from "../src/context/AuthContext";

export default function Login() {
    const router = useRouter();
    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const entrar = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);

            // 🚀 CORREÇÃO: Enviando e-mail e senha limpos para o seu AuthContext
            await signIn(email, senha);

            // 💡 NOTA: Você não precisa chamar router.replace('/home') aqui!
            // O componente app/index.js monitora o estado 'signed' e fará o redirecionamento automático!
            Alert.alert('Sucesso', 'Login realizado com sucesso!');
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error(error);
            if (error.response) {
                Alert.alert('Erro de Autenticação', 'E-mail ou senha inválidos.');
            } else {
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor backend.');
            }
        } finally {
            setLoading(false);
        }
    };

    const cadastrar = () => {
        router.push('/cadastroAdministrador');
    }

    return (
        <View style={styles.container}>

            <Image
                source={require('../src/assets/images/logo1.png')}
                style={styles.img}
                resizeMode="contain"
            />

            <View style={styles.inputArea}>

                <View style={styles.fieldsWrapper}>
                    <InputItem
                        label='E-mail'
                        placeholder='Digite seu e-mail'
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <InputItem
                        label='Senha'
                        placeholder='Digite sua senha'
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.buttonsArea}>
                    <ButtonLight
                        title="Cadastrar"
                        onPress={cadastrar}
                        flex
                    />

                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="small" color={COLORS.darkBlue} />
                        </View>
                    ) : (
                        <ButtonDark
                            title="Entrar"
                            onPress={entrar}
                            flex
                        />
                    )}
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
    buttonsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    inputArea: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 24,
        borderColor: COLORS.lightGrey,
        width: '100%',
        alignSelf: 'center'
    },
    fieldsWrapper: {
        marginBottom: 15,
        width: '100%'
    },
});