import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputItem from '../../src/components/InputItem';
import { COLORS } from '../../src/theme/colors';
import { FONT_SIZE } from '../../src/theme/typography';
import { ButtonDark } from '../../src/components/ButtonDark';
import { ButtonLight } from '../../src/components/ButtonLight';
import { useAuth } from '../../src/context/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '../../src/services/api.js';

export default function Perfil() {
    const router = useRouter();
    const { user, atualizarDadosUser } = useAuth();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    // Controla se os inputs estão bloqueados ou liberados para edição
    const [isEditable, setIsEditable] = useState(false);

    // Carrega os dados assim que a tela abre ou quando o objeto 'user' atualizar
    useEffect(() => {
        if (user) {
            // 🚀 Ajustado para bater exatamente com as propriedades do AuthResponse do Java
            setNome(user.nome || '');
            setEmail(user.email || '');
            setCpf(user.cpf || '');
            setDataNascimento(user.dataNascimento || '');
        }
    }, [user]);

    // Ação de Logout
    const handleLogout = async () => {
        await AsyncStorage.removeItem('usuario');
        router.replace('/login');
    };

    // Salva as alterações mandando para o backend Java
    const handleSalvar = async () => {
        try {
            const dadosAtualizados = {
                id: user.id,
                nome,
                dataNascimento
            };

            // Envia a requisição PUT para o endpoint do Spring Boot
            const resposta = await api.put('/administrador', dadosAtualizados);

            if (resposta.status === 200 || resposta.status === 204) {
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
                setIsEditable(false); // Tranca os inputs novamente

                if (atualizarDadosUser) {
                    atualizarDadosUser(dadosAtualizados);
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            Alert.alert('Erro', 'Não foi possível atualizar os dados no servidor.');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.titleArea} >
                <View style={styles.line} />
                <Text style={styles.title}>Meu perfil</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                {/* 🔓 Nome: Habilita APENAS quando estiver em modo de edição */}
                <InputItem
                    label='Nome'
                    placeholder='Seu nome completo'
                    value={nome}
                    onChangeText={setNome}
                    editable={isEditable}
                />

                {/* 🔒 E-mail: Nunca pode ser editado, continua desabilitado sempre */}
                <InputItem
                    label='E-mail'
                    placeholder='seuemail@email.com'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    editable={false}
                />

                {/* 🔒 CPF: Nunca pode ser editado, continua desabilitado sempre */}
                <InputItem
                    label='CPF'
                    placeholder='Apenas números, sem pontos ou traços'
                    value={cpf}
                    keyboardType='numeric'
                    maxLength={11}
                    onChangeText={setCpf}
                    editable={false}
                />

                {/* 🔓 Data de Nascimento: Habilita APENAS quando estiver em modo de edição */}
                <InputItem
                    label='Data de nascimento'
                    placeholder='dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                    editable={isEditable}
                />
            </View>

            {/* Área dinâmica de botões */}
            <View style={styles.buttonArea}>
                {isEditable ? (
                    // Se estiver em modo de edição, mostra "Salvar" e "Cancelar"
                    <>
                        <ButtonDark
                            title="Salvar"
                            onPress={handleSalvar}
                            flex
                        />
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                // Restaura os dados originais do contexto salvos no banco
                                setNome(user.nome || '');
                                setEmail(user.email || '');
                                setCpf(user.cpf || '');
                                setDataNascimento(user.dataNascimento || '');
                                setIsEditable(false); // Tranca tudo de novo
                            }}
                            flex
                        />
                    </>
                ) : (
                    // Se estiver bloqueado, mostra os botões padrão "Editar" e "Sair"
                    <>
                        <ButtonDark
                            title="Editar"
                            onPress={() => setIsEditable(true)} // Destrava os campos permitidos
                            flex
                        />
                        <ButtonLight
                            title="Sair da Conta"
                            onPress={handleLogout}
                            flex
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
    },
    titleArea: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: '40%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 20,
    },
    title: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    formArea: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        paddingBottom: 15,
    },
    buttonArea: {
        flexDirection: 'row',
        width: '90%',
        gap: 15,
    },
});