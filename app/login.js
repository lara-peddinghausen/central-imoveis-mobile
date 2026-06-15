import { useRouter } from "expo-router";
import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator, Modal, Text } from 'react-native'; // ◄ IMPORTADO MODAL E TEXT
import { ButtonDark } from "../src/components/ButtonDark";
import { ButtonLight } from "../src/components/ButtonLight";
import { COLORS } from '../src/theme/colors';
import InputItem from "../src/components/InputItem";
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
            await signIn(email, senha);

            Alert.alert('Sucesso', 'Login realizado com sucesso!');
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error(error);
            
            // 🚀 TRATAMENTO DO ERRO DE CONEXÃO COM O BANCO DE DADOS (STATUS 500):
            if (error.response) {
                if (error.response.status === 500) {
                    Alert.alert(
                        'Erro no Servidor', 
                        'Não foi possível conectar ao banco de dados. Verifique o status do banco.'
                    );
                } else {
                    Alert.alert('Erro de Autenticação', 'E-mail ou senha inválidos.');
                }
            } else {
                // Erro de rede genérico (ex: backend offline ou IP mudou)
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor backend.');
            }
        } finally {
            setLoading(false);
        }
    };

    const cadastrar = () => {
        router.push('/cadastrar-administrador');
    }

    return (
        <View style={styles.container}>

            {/* 🚀 MODAL DE LOADING EM TELA CHEIA */}
            <Modal transparent={true} animationType="none" visible={loading}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={COLORS.darkBlue} />
                        <Text style={styles.loadingText}>Acessando sistema...</Text>
                    </View>
                </View>
            </Modal>

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

                {/* O botão "Entrar" agora fica visível fixo, sem sumir pelo loading local */}
                <View style={styles.buttonsArea}>
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
    // 🚀 NOVOS ESTILOS DO LOADING EM TELA CHEIA:
    loadingContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Escurece levemente o fundo da tela
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingBox: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        gap: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    loadingText: {
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        fontSize: 15,
    }
});