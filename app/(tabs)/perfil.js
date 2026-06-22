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

    // Formata a data vinda do banco (yyyy-mm-dd) para a tela (dd/mm/aaaa)
    const formatarDataParaExibicao = (dataStr) => {
        if (!dataStr) return '';
        if (dataStr.includes('-')) {
            const [ano, mes, dia] = dataStr.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return dataStr;
    };

    // Carrega os dados assim que a tela abre ou quando o objeto 'user' atualizar
    useEffect(() => {
        if (user) {
            setNome(user.nome || '');
            setEmail(user.email || '');
            setCpf(user.cpf || '');
            
            // Converte a data do banco antes de salvar no estado da tela
            setDataNascimento(formatarDataParaExibicao(user.dataNascimento));
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
            // Garante que se o estado ainda contiver hífens, converte para barras para o Java
            let dataFormatada = dataNascimento;
            if (dataNascimento.includes('-')) {
                const [ano, mes, dia] = dataNascimento.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            }

            const dadosAtualizados = {
                id: user.id,
                nome: nome.trim(),
                dataNascimento: dataFormatada 
            };

            // Envia a requisição PUT para o endpoint do Spring Boot
            const resposta = await api.put('/administrador', dadosAtualizados);

            if (resposta.status === 200 || resposta.status === 204) {
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
                setIsEditable(false); // Tranca os inputs novamente

                if (atualizarDadosUser) {
                    // Atualiza o contexto global do App
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
                <InputItem
                    label='Nome'
                    placeholder='Seu nome completo'
                    value={nome}
                    onChangeText={setNome}
                    editable={isEditable}
                />

                <InputItem
                    label='E-mail'
                    placeholder='seuemail@email.com'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    editable={false}
                />

                <InputItem
                    label='CPF'
                    placeholder='Apenas números, sem pontos ou traços'
                    value={cpf}
                    keyboardType='numeric'
                    maxLength={11}
                    onChangeText={setCpf}
                    editable={false}
                />

                <InputItem
                    label='Data de nascimento'
                    placeholder='dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                    editable={isEditable}
                />
            </View>

            <View style={styles.buttonArea}>
                {isEditable ? (
                    <>
                        <ButtonDark
                            title="Salvar"
                            onPress={handleSalvar}
                            flex
                        />
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                // Restaura os dados originais e formata a data de volta
                                setNome(user.nome || '');
                                setEmail(user.email || '');
                                setCpf(user.cpf || '');
                                setDataNascimento(formatarDataParaExibicao(user.dataNascimento));
                                setIsEditable(false);
                            }}
                            flex
                        />
                    </>
                ) : (
                    <>
                        <ButtonDark
                            title="Editar"
                            onPress={() => setIsEditable(true)}
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