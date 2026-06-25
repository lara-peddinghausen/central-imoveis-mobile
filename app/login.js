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

    // Fazer login
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

            {/* Loading */}
            <Modal transparent={true} animationType="none" visible={loading}>
                <View style={styles.loadingContainer}>
                    <View style={styles.areaLoading}>
                        <ActivityIndicator size="large" color={COLORS.darkBlue} />
                        <Text style={styles.textoLoading}>Acessando sistema...</Text>
                    </View>
                </View>
            </Modal>

            {/* Logo */}
            <Image
                source={require('../src/assets/images/logo1.png')}
                style={styles.img}
                resizeMode="contain"
            />

            {/* Input do login */}
            <View style={styles.areaInput}>

                <View style={styles.input}>
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

                {/* Botões */}
                <View style={styles.areaBotoes}>
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
    areaBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    areaInput: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 24,
        borderColor: COLORS.lightGrey,
        width: '100%',
        alignSelf: 'center'
    },
    input: {
        marginBottom: 15,
        width: '100%'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    areaLoading: {
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
    textoLoading: {
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        fontSize: 15,
    }
});